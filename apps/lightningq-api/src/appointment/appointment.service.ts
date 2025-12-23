import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { QuickAppointmentDto } from './dto/create-appointment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BloodGroup, AcuityLevel, $Enums, GenderType } from 'generated/prisma';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { MailerService } from 'src/common/mailer/mailer.service';
import { createEvent } from 'ics';
import { STATUS_CODES } from 'http';
import { addDays } from 'date-fns';
import { WhatsappService } from 'src/common/whatsapp/whatsapp.service';
import { ConsultationStatus } from '@prisma/client';
import { Cron } from '@nestjs/schedule';
import { istDayRangeToUtc } from 'src/utils/date.util';
import dayjs from 'dayjs';
import { first, last } from 'rxjs';

// import { subMinutes, addMilliseconds } from 'date-fns';

@Injectable()
export class AppointmentService {
  private readonly logger = new Logger(AppointmentService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
    private readonly whatsappService: WhatsappService,
  ) {}

  async BookAppointment(dto: QuickAppointmentDto, CreatedBy: number) {
    let patient;

    // 🧭 Start DB Transaction (only for DB operations)
    const result = await this.prisma.$transaction(async (tx) => {
      // 1️⃣ Find or create patient
      if (dto.PatientId) {
        patient = await tx.patient.findUnique({
          where: { PatientId: dto.PatientId },
        });
        if (!patient)
          throw new Error('Patient not found with provided PatientId');
      } else {
        // Generate new MRN
        const patients = await tx.patient.findMany({
          where: { HospitalId: Number(dto.hospitalId) },
          select: { Patient_Medical_Record_No: true },
        });

        let lastNumber = 0;
        for (const p of patients) {
          if (!p.Patient_Medical_Record_No) continue;
          const numericPart = p.Patient_Medical_Record_No.slice(
            dto.hospitalCode.length,
          );
          if (!/^0\d{6}$/.test(numericPart)) continue;
          const parsed = parseInt(numericPart, 10);
          if (parsed > lastNumber) lastNumber = parsed;
        }

        const nextNumber = lastNumber + 1;
        const paddedNumber = String(nextNumber).padStart(7, '0');
        const generatedMRN = `${dto.hospitalCode}${paddedNumber}`;
        console.log('Generated MRN:', generatedMRN);

        patient = await tx.patient.create({
          data: {
            Prefix: dto.Prefix ?? 'Mr',
            firstName: dto.firstName ?? '',
            lastName: dto.lastName ?? '',
            dateOfBirth: new Date(dto.dateOfBirth ?? ''),
            gender: (dto.gender as GenderType) ?? 'OTHER',
            mobile: dto.mobile ?? '',
            email: dto.email ?? '',
            addressLine1: dto.addressLine1,
            isQuickRegistered: true,
            HospitalId: dto.hospitalId,
            OrganizationId: 1,
            city: '',
            state: '',
            postalCode: 0,
            country: 'India',
            CreatedBy: String(CreatedBy),
            bloodGroup: (dto.bloodGroup as BloodGroup) ?? null,
            Patient_Medical_Record_No: generatedMRN,
          },
        });
      }

      // 2️⃣ Prevent duplicate scheduled appointment
      const existingAppointment = await tx.appointment.findFirst({
        where: {
          PatientId: patient.PatientId,
          DoctorId: dto.DoctorId,
          appointmentDate: {
            gte: new Date(dto.appointmentDate + 'T00:00:00'),
            lt: new Date(dto.appointmentDate + 'T23:59:59'),
          },
          status: {
            in: ['SCHEDULED', 'COMPLETED'], // optional
          },
        },
      });

      if (existingAppointment) {
        throw new HttpException(
          {
            status: 'failure',
            message:
              'Appointment already exists for this patient with this doctor. Please reschedule instead.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // 3️⃣ Create appointment
      // const appointmentDate = new Date(
      //   `${dto.appointmentDate}T${dto.appointmentTime}:00`,
      // );
      if (!dto.appointmentDate || !dto.appointmentTime) {
        throw new Error('appointmentDate and appointmentTime are required');
      }

      const dateParts = dto.appointmentDate.split('-');
      const timeParts = dto.appointmentTime.split(':');

      if (dateParts.length !== 3 || timeParts.length !== 2) {
        throw new BadRequestException(
          'Invalid appointmentDate or appointmentTime',
        );
      }

      const year = Number(dateParts[0]);
      const month = Number(dateParts[1]);
      const day = Number(dateParts[2]);
      const hour = Number(timeParts[0]);
      const minute = Number(timeParts[1]);

      if (
        !Number.isInteger(year) ||
        !Number.isInteger(month) ||
        !Number.isInteger(day) ||
        !Number.isInteger(hour) ||
        !Number.isInteger(minute)
      ) {
        throw new BadRequestException(
          'Invalid appointmentDate or appointmentTime',
        );
      }

      // ✅ Validate time strictly
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (!timeRegex.test(dto.appointmentTime)) {
        throw new BadRequestException(
          'appointmentTime must be in 24-hour HH:mm format',
        );
      }

      /**
       * 🔥 Create UTC date directly from IST
       * IST = UTC + 5:30
       */
      const appointmentDateUtc = new Date(
        Date.UTC(year, month - 1, day, hour - 5, minute - 30, 0),
      );

      const appointment = await tx.appointment.create({
        data: {
          PatientId: patient.PatientId,
          DoctorId: dto.DoctorId!,
          hospitalId: dto.hospitalId,
          visitTypeId: dto.visitTypeId!,
          paymentTypeId: dto.paymentTypeId!,
          appointmentDate: appointmentDateUtc,
          reason: dto.VisitReason,
          age: dto.age,
          createdBy: CreatedBy,
          sendWhatsappMessage: dto.sendWhatsappMessage,
          sendSmsMessage: dto.sendSmsMessage,
          sendEmailMessage: dto.sendEmailMessage,
          acuity: (dto.acuity as AcuityLevel) ?? 'MODERATE',
          fasttrackpatient: dto.fasttrackpatient ?? false,
          SpecializationId: dto.SpecializationId!,
          TagPatients: dto.TagPatientIds?.length
            ? { connect: dto.TagPatientIds.map((id) => ({ TagPatientId: id })) }
            : undefined,
          consultationStatus: dto.consultationStatus ?? 'NOT_STARTED',
        },
      });
      if (!dto.isBillingEnabled) {
        // 4️⃣ Create payment history
        const paymentHistory = await tx.paymentHistory.create({
          data: {
            TransactionId: Date.now(),
            Transaction_DateTime: new Date(),
            paymentTypePaymentTypeId: dto.paymentTypeId!,
            AppointmentChargesPaid: parseFloat(
              dto.AppointmentChargesPaid || '0',
            ),
            isAmountPaid: dto.isAmountPaid ?? true,
            ActualAppointmentCharges: parseFloat(
              dto.ActualAppointmentCharges || '0',
            ),
            DiscountOnAppointment: parseFloat(dto.DiscountOnAppointment || '0'),
            FastTrackCharges: parseFloat(dto.FastTrackCharges || '0'),
            TotalAppointmentCharges: parseFloat(
              dto.TotalAppointmentCharges || '0',
            ),

            appointments: {
              connect: { AppointmentId: appointment.AppointmentId },
            },
          },
        });

        await tx.appointment.update({
          where: { AppointmentId: appointment.AppointmentId },
          data: { paymentHistoryId: paymentHistory.PaymentHistoryId },
        });
      }

      // 5️⃣ Create doctor slot
      const slotDate = new Date(dto.appointmentDate ?? '');
      const slotDayOfWeek = slotDate
        .toLocaleString('en-US', { weekday: 'long' })
        .toUpperCase();

      const doctorTimeSlot = await tx.doctorTimeSlot.findFirst({
        where: {
          DoctorId: dto.DoctorId,
          HospitalId: dto.hospitalId,
          DoctorTimeSlotId: dto.DoctorTimeSlotId,
        },
      });

      if (!doctorTimeSlot)
        throw new Error(`No time slot found for doctor on ${slotDayOfWeek}`);

      await tx.doctorSlot.create({
        data: {
          doctorId: dto.DoctorId!,
          hospitalId: dto.hospitalId,
          DoctorTimeSlotId: doctorTimeSlot.DoctorTimeSlotId,
          slotDate,
          slotTime: dto.appointmentTime!,
          dayOfWeek: slotDayOfWeek,
          isBooked: true,
          appointmentId: appointment.AppointmentId,
        },
      });

      // 6️⃣ Return summary
      const appointmentWithDetails = await tx.appointment.findUnique({
        where: { AppointmentId: appointment.AppointmentId },
        include: { doctor: true, hospital: true, visitType: true },
      });

      return {
        appointment,
        patient,
        appointmentWithDetails,
      };
    });
    console.log(result);
    console.log('Appointment booked successfully:', result.appointment);

    // 🧩 Now run notifications asynchronously, AFTER commit
    setImmediate(async () => {
      try {
        await this.sendAllNotificationsForAppointment(
          result.appointment.AppointmentId,
          result.patient.email,
          result.appointment,
          result.patient,
          result.appointmentWithDetails!,
          result.appointment.sendEmailMessage,
          result.appointment.sendSmsMessage,
          result.appointment.sendWhatsappMessage,
        );
      } catch (err) {
        console.error('⚠️ Notification error (ignored):', err);
      }
    });

    return {
      message: 'Quick appointment booked successfully',
      appointment: result.appointment,
      patient: result.patient,
      STATUS_CODES: 200,
    };
  }

  // appointment.service.ts

  async startConsultation(appointmentId: number, userId?: number) {
    // optionally validate appointment exists / permission
    return this.prisma.appointment.update({
      where: { AppointmentId: appointmentId },
      data: {
        consultationStatus: 'ONGOING',
        // consultationStartDateTime: new Date(),
        // optionally track who started:
        createdBy: userId,
      },
    });
  }

  async completeConsultation(
    appointmentId: number,
    consultationId: number,
    userId: number,
  ) {
    return this.prisma.$transaction(async (tx) => {
      // Update Appointment table
      await tx.appointment.update({
        where: { AppointmentId: appointmentId },
        data: {
          consultationStatus: 'COMPLETED',
          createdBy: userId,
        },
      });

      // Update Consultation table
      await tx.consultation.update({
        where: { ConsultationId: consultationId },
        data: {
          consultationStatus: 'COMPLETED',
          consultationEndDateTime: new Date(),
        },
      });

      return { success: true };
    });
  }

  async markIncomplete(
    appointmentId: number,
    consultationId: number,
    userId: number,
  ) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Update Appointment table
      await tx.appointment.update({
        where: { AppointmentId: appointmentId },
        data: {
          consultationStatus: 'INCOMPLETE',
          createdBy: userId,
        },
      });

      // 2. Update Consultation table
      await tx.consultation.update({
        where: { ConsultationId: consultationId },
        data: {
          consultationStatus: 'INCOMPLETE',
          createdById: userId,
        },
      });

      return { success: true };
    });
  }

  async sendAllNotificationsForAppointment(
    AppointmentId: number,
    toEmail: string,
    appointment: any,
    patient: any,
    appointmentWithDetails: any,
    sendEmail: boolean,
    sendSms: boolean,
    sendWhatsapp: boolean,
  ) {
    if (!toEmail) return;

    const appointmentDate = new Date(
      appointment.appointmentDate,
    ).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const appointmentTime = new Date(
      appointment.appointmentDate,
    ).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const doctorFullName =
      `${appointmentWithDetails?.doctor?.firstName ?? ''} ${appointmentWithDetails?.doctor?.lastName ?? ''}`.trim();
    const hospitalName =
      appointmentWithDetails?.hospital?.HospitalName ?? 'LightningQ';
    const hospitalAddress = appointmentWithDetails?.hospital?.address ?? 'N/A';
    const hospitalContact =
      appointmentWithDetails?.hospital?.contactNumber ?? 'N/A';
    const hospitalEmail = appointmentWithDetails?.hospital?.email ?? 'N/A';

    const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px;">
    <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; border: 1px solid #eee;">
      <div style="background-color: #29bab0; color: white; padding: 20px 30px;">
<h2 style="margin: 0;">
  Your ${
    ['Free Follow-up', 'Paid Follow-up'].includes(
      appointmentWithDetails?.visitType?.AppointmentTypeName,
    )
      ? `${appointmentWithDetails?.visitType?.AppointmentTypeName} Appointment`
      : (appointmentWithDetails?.visitType?.AppointmentTypeName ?? 'Follow Up')
  } is ${appointment?.status}.
</h2>
      </div>
      <div style="padding: 30px;">
        <p>Dear <strong>${patient?.firstName} ${patient?.lastName}</strong>,</p>
        <p>This is a confirmation email for your Appointment with <strong>Dr. ${doctorFullName}</strong> on <strong>${appointmentDate}</strong> at <strong>${appointmentTime}</strong>.</p>

        <p>Should you have queries or require any clarifications, please do not hesitate to contact us.</p>

        <p>If for any reason you wish to cancel your appointment, we appreciate a prompt and early notification from your side.</p>

        <table style="margin-top: 20px; width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; font-weight: bold;">Doctor Name:</td>
            <td style="padding: 10px;">Dr. ${doctorFullName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Hospital:</td>
            <td style="padding: 10px;">${hospitalName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Date:</td>
            <td style="padding: 10px;">${appointmentDate}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Time:</td>
            <td style="padding: 10px;">${appointmentTime}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Acuity:</td>
            <td style="padding: 10px;">${appointment.acuity}</td>
          </tr>
        </table>

        <div style="margin-top: 30px; background-color: #f1f1f1; padding: 20px; border-radius: 4px;">
          <p style="margin: 0;"><strong>${hospitalName}</strong></p>
          <p style="margin: 0;">Address: ${hospitalAddress}</p>
          <p style="margin: 0;">Contact: ${hospitalContact}</p>
          <p style="margin: 0;">Email: ${hospitalEmail}</p>
        </div>
      </div>
    </div>
  </div>
  `;

    // ✅ Send Email
    if (sendEmail && toEmail) {
      const icsBuffer = await this.generateICSFile(
        appointmentWithDetails,
        patient,
      );

      await this.mailerService.sendMailWithAttachment(
        toEmail,
        `Appointment ${appointment?.status} 'Confirmed': ${appointmentDate} ${appointmentTime}`,
        html,
        [
          {
            filename: 'appointment.ics',
            content: icsBuffer,
            contentType: 'text/calendar',
          },
        ],
      );
    }

    // if (sendSms && patient?.mobile) {
    //   const message = `Dear ${patient?.firstName}, Your ${
    //     appointmentWithDetails?.visitType?.AppointmentTypeName ?? 'FollowUp'
    //   } appointment with Dr. ${doctorFullName} at ${appointmentTime} on ${appointmentDate} at ${hospitalName} is confirmed. Please be there at the clinic 15 mins early. For queries contact ${hospitalContact}. Thank you.`;

    //   try {
    //     await this.sendSms(patient.mobile, message);
    //   } catch (err) {
    //     if (err instanceof Error) {
    //       console.error('❌ Failed to send SMS:', err.message);
    //     } else {
    //       console.error('❌ Failed to send SMS:', err);
    //     }
    //   }
    // }

    // ✅ Send WhatsApp Message
    if (sendWhatsapp && patient?.mobile) {
      try {
        await this.whatsappService.sendAppointmentConfirmation({
          patient: {
            firstName: patient?.firstName ?? '',
            lastName: patient?.lastName ?? '',
            mobile: patient?.mobile,
          },
          appointmentType:
            appointmentWithDetails?.visitType?.AppointmentTypeName ??
            'FollowUp',
          doctorName: doctorFullName,
          appointmentDate,
          appointmentTime,
          hospitalName,
          hospitalContact,
        });
      } catch (err) {
        if (err instanceof Error) {
          console.error('❌ Failed to send WhatsApp message:', err.message);
        } else {
          console.error('❌ Failed to send WhatsApp message:', String(err));
        }
      }
    }
  }

  //ICS Calender
  async generateICSFile(appointment: any, patient: any): Promise<Buffer> {
    const date = new Date(appointment.appointmentDate);

    const event = {
      start: [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
      ] as [number, number, number, number, number],
      duration: { minutes: 30 },
      title: `Appointment with Dr. ${appointment?.doctor?.firstName}`,
      description: `Medical appointment at ${appointment?.hospital?.HospitalName}`,
      location: appointment?.hospital?.address,
      organizer: {
        name: 'LightningQ Healthcare',
        email: 'info@lightningq.in',
      },
    };

    return new Promise((resolve, reject) => {
      createEvent(event, (error, value) => {
        if (error) return reject(error);
        resolve(Buffer.from(value));
      });
    });
  }

  // async sendSms(to: string, message: string) {
  //   const formattedMobile = to.startsWith('+91') ? to : `91${to}`;

  //   const url = 'https://api.textlocal.in/send/';
  //   const params = new URLSearchParams();
  //   params.append('apikey', process.env.TEXTLOCAL_API_KEY ?? '');
  //   params.append('numbers', formattedMobile);
  //   params.append('sender', 'TXTLCL'); // must be approved sender name
  //   params.append('message', message);

  //   const response = await fetch(url, {
  //     method: 'POST',
  //     body: params,
  //   });

  //   const result = await response.json();
  //   if (result.status !== 'success') {
  //     throw new Error(`TextLocal Error: ${JSON.stringify(result)}`);
  //   }

  //   console.log('✅ SMS sent successfully:', result);
  // }

  // sendAllNotificationsForAppointment() {
  //   throw new Error('Method not implemented.');
  // }

  //updateAppointment
  async updateAppointment(dto: UpdateAppointmentDto, UpdatedBy: number) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { AppointmentId: dto.AppointmentId },
      include: { patient: true },
    });

    if (!appointment) throw new Error('Appointment not found');

    const existingPatient = await this.prisma.patient.findUnique({
      where: { PatientId: appointment.PatientId },
    });

    if (!existingPatient) {
      throw new NotFoundException('Patient not found');
    }

    // Optional: Update patient if quick registered
    if (appointment.patient.isQuickRegistered) {
      await this.prisma.patient.update({
        where: { PatientId: appointment.PatientId },
        data: {
          firstName: dto.firstName ?? existingPatient.firstName,
          lastName: dto.lastName ?? existingPatient.lastName,
          mobile: dto.mobile ?? existingPatient.mobile,
          email: dto.email ?? existingPatient.email,
          dateOfBirth: dto.dateOfBirth
            ? new Date(dto.dateOfBirth)
            : existingPatient.dateOfBirth,
        },
      });
    }

    // Combine appointment date + time if provided
    let newAppointmentDate = appointment.appointmentDate;
    if (dto.appointmentDate && dto.appointmentTime) {
      newAppointmentDate = new Date(
        `${dto.appointmentDate}T${dto.appointmentTime}:00`,
      );
    }
    const appointmentDate = new Date(
      `${dto.appointmentDate}T${dto.appointmentTime}:00`,
    );

    const updatedAppointment = await this.prisma.appointment.update({
      where: { AppointmentId: dto.AppointmentId },
      data: {
        DoctorId: dto.DoctorId ?? 0,
        appointmentDate:
          dto.appointmentDate && dto.appointmentTime
            ? newAppointmentDate
            : undefined,
        status: dto.status ?? 'RESCHEDULED',
        RescheduleReason: dto.RescheduleReason ?? '',
        cancellationReason: dto.cancellationReason ?? '',
        rescheduledAt: new Date(),
        rescheduledDate: newAppointmentDate,
        rescheduledBy: UpdatedBy,
        sendWhatsappMessage: dto.sendWhatsappMessage,
        sendSmsMessage: dto.sendSmsMessage,
        sendEmailMessage: dto.sendEmailMessage,
        fasttrackpatient: dto.fasttrackpatient ?? false,
        consultationStatus: dto.consultationStatus ?? 'NOT_STARTED',
      },
    });

    const slotDate = new Date(dto.appointmentDate ?? ''); // ✅ "2025-07-17"

    const slotDayOfWeek = slotDate
      .toLocaleString('en-US', { weekday: 'long' })
      .toUpperCase(); // "THURSDAY"

    await this.prisma.doctorSlot.updateMany({
      where: {
        appointmentId: dto.AppointmentId,
      },
      data:
        dto.status === 'CANCELLED'
          ? {
              isBooked: false,
              slotDate: null,
              slotTime: null,
              dayOfWeek: null,
            }
          : {
              isBooked: true,
              slotDate,
              slotTime: dto.appointmentTime!,
              dayOfWeek: slotDayOfWeek,
            },
    });

    const appointmentWithDetails = await this.prisma.appointment.findUnique({
      where: {
        AppointmentId: appointment.AppointmentId,
      },
      include: {
        doctor: true,
        hospital: true,
        visitType: true,
        patient: true,
        PaymentType: true,
      },
    });
    console.log(appointmentWithDetails);
    await this.sendAllNotificationsForAppointment(
      appointment.AppointmentId,
      appointmentWithDetails?.patient?.email ?? '',
      updatedAppointment,
      appointmentWithDetails?.patient,
      appointmentWithDetails,
      dto.sendEmailMessage ?? false,
      appointment.sendSmsMessage,
      appointment.sendWhatsappMessage,
    );

    // AppointmentId: number,
    // toEmail: string,
    // appointment: any,
    // patient: any,
    // appointmentWithDetails: any,
    // sendEmail: boolean,
    // sendSms: boolean,
    // sendWhatsapp: boolean,

    return {
      message: 'Appointment updated successfully',
      updatedAppointment,
      appointmentWithDetails,
      STATUS_CODES: 200,
    };
  }

  //searchAppointments
  // async searchAppointments(filters: {
  //   hospitalId?: number;
  //   DoctorId?: number;
  //   status?: string;
  //   visitTypeId?: number;
  //   TagPatientId?: number;
  //   GenderName?: string;
  //   SpecializationId?: number;
  //   isConsultationcompleted?: boolean | string;
  //   acuity?: string;
  //   search?: string;
  //   appointmentDate?: string;
  //   appointmentDateFrom?: string;
  //   appointmentDateTo?: string;
  //   minage?: number | string;
  //   maxage?: number | string;
  //   page?: number | string;
  //   limit?: number | string;
  // }) {
  //   // helpers to build dates in IST
  //   const istDayStart = (yyyyMmDd: string) =>
  //     new Date(`${yyyyMmDd}T00:00:00+05:30`);
  //   const istDayEnd = (yyyyMmDd: string) =>
  //     new Date(`${yyyyMmDd}T23:59:59.999+05:30`);

  //   const andConditions: any[] = [];

  //   // pagination
  //   const page = Number(filters.page ?? 1);
  //   const limit = Number(filters.limit ?? 10);
  //   const skip = (page - 1) * limit;

  //   // scalar filters (only if they’re numbers, not undefined/NaN)
  //   if (filters.hospitalId)
  //     andConditions.push({ hospitalId: Number(filters.hospitalId) });
  //   if (filters.DoctorId)
  //     andConditions.push({ DoctorId: Number(filters.DoctorId) });
  //   if (filters.visitTypeId)
  //     andConditions.push({ visitTypeId: Number(filters.visitTypeId) });
  //   if (filters.TagPatientId)
  //     andConditions.push({ TagPatientId: Number(filters.TagPatientId) });
  //   if (filters.SpecializationId)
  //     andConditions.push({
  //       SpecializationId: Number(filters.SpecializationId),
  //     });
  //   if (filters.status) andConditions.push({ status: filters.status });

  //   // enum (acuity)
  //   if (filters.acuity) {
  //     andConditions.push({ acuity: String(filters.acuity).toUpperCase() });
  //   }

  //   // consultation completed flag
  //   if (typeof filters.isConsultationcompleted !== 'undefined') {
  //     const isCompleted =
  //       String(filters.isConsultationcompleted).toLowerCase() === 'true';
  //     andConditions.push({
  //       consultation: { is: { IsconsultationCompleted: isCompleted } },
  //     });
  //   }

  //   // patient filters
  //   const patientFilter: any = {};
  //   if (filters.GenderName) {
  //     patientFilter.gender = filters.GenderName;
  //   }

  //   if (filters.minage || filters.maxage) {
  //     const today = new Date();

  //     if (filters.minage) {
  //       const minAgeNum = Number(filters.minage);
  //       if (!isNaN(minAgeNum)) {
  //         const maxDob = new Date(today);
  //         maxDob.setFullYear(today.getFullYear() - minAgeNum);
  //         maxDob.setHours(23, 59, 59, 999);
  //         patientFilter.dateOfBirth = {
  //           ...(patientFilter.dateOfBirth || {}),
  //           lte: maxDob,
  //         };
  //       }
  //     }

  //     if (filters.maxage) {
  //       const maxAgeNum = Number(filters.maxage);
  //       if (!isNaN(maxAgeNum)) {
  //         const minDob = new Date(today);
  //         minDob.setFullYear(today.getFullYear() - maxAgeNum);
  //         minDob.setHours(0, 0, 0, 0);
  //         patientFilter.dateOfBirth = {
  //           ...(patientFilter.dateOfBirth || {}),
  //           gte: minDob,
  //         };
  //       }
  //     }
  //   }

  //   if (Object.keys(patientFilter).length > 0) {
  //     andConditions.push({ patient: { is: patientFilter } });
  //   }

  //   // appointment date filters
  //   if (filters.appointmentDate) {
  //     const from = istDayStart(filters.appointmentDate);
  //     const to = istDayEnd(filters.appointmentDate);
  //     if (!isNaN(from.getTime()) && !isNaN(to.getTime())) {
  //       andConditions.push({ appointmentDate: { gte: from, lte: to } });
  //     }
  //   } else if (filters.appointmentDateFrom || filters.appointmentDateTo) {
  //     const dateFilter: any = {};
  //     if (filters.appointmentDateFrom) {
  //       const from = istDayStart(filters.appointmentDateFrom);
  //       if (!isNaN(from.getTime())) dateFilter.gte = from;
  //     }
  //     if (filters.appointmentDateTo) {
  //       const to = istDayEnd(filters.appointmentDateTo);
  //       if (!isNaN(to.getTime())) dateFilter.lte = to;
  //     }
  //     if (Object.keys(dateFilter).length > 0) {
  //       andConditions.push({ appointmentDate: dateFilter });
  //     }
  //   }

  //   // search filter (only if 3+ chars)
  //   if (filters.search && String(filters.search).length >= 3) {
  //     const q = String(filters.search);
  //     andConditions.push({
  //       OR: [
  //         { patient: { firstName: { contains: q, mode: 'insensitive' } } },
  //         { patient: { lastName: { contains: q, mode: 'insensitive' } } },
  //         { patient: { mobile: { contains: q } } },
  //         { patient: { Patient_Medical_Record_No: { contains: q } } },
  //       ],
  //     });
  //   }

  //   const whereClause = andConditions.length > 0 ? { AND: andConditions } : {};

  //   // debug
  //   console.log('🕵️ Final whereClause:', JSON.stringify(whereClause, null, 2));

  //   // run queries
  //   const [data, total] = await Promise.all([
  //     this.prisma.appointment.findMany({
  //       where: whereClause,
  //       skip,
  //       take: limit,
  //       orderBy: { appointmentDate: 'asc' },
  //       include: {
  //         patient: {
  //           include: {
  //             allergies: true,
  //             languages: true,
  //             medicalHistory: true,
  //             TagPatient: true,
  //           },
  //         },
  //         doctor: {
  //           include: {
  //             Specialization: true,
  //             DoctorSlot: true,
  //             DoctorTimeSlot: true,
  //             DoctorCosting: true,
  //           },
  //         },
  //         visitType: true,
  //         hospital: true,
  //         TagPatient: true,
  //         Vitals: true,
  //         consultation: {
  //           include: {
  //             ConsultationCheifComplaint: { include: { chiefComplaint: true } },
  //             ConsultationDiagnosis: { include: { diagnosis: true } },
  //             ConsultationProcedure: { include: { procedure: true } },
  //             ConsultationMedication: true,
  //             ConsultationInvestigation: {
  //               include: {
  //                 InvestigationType: true,
  //                 InvestigationSubType: true,
  //               },
  //             },
  //             ConsultationTreatment: true,
  //             ConsultationFollowUpPlan: true,
  //             ConsultationclinicalNotes: true,
  //           },
  //         },
  //       },
  //     }),
  //     this.prisma.appointment.count({ where: whereClause }),
  //   ]);

  //   return {
  //     data,
  //     total,
  //     page,
  //     limit,
  //     totalPages: Math.ceil(total / limit),
  //   };
  // }
  async searchAppointments(filters: {
    hospitalId?: number;
    DoctorId?: number;
    status?: string;
    visitTypeId?: number;
    TagPatientId?: number;
    GenderName?: string;
    SpecializationId?: number;
    consultationStatus?: boolean | string;
    acuity?: string;
    search?: string;
    appointmentDate?: string;
    appointmentDateFrom?: string;
    appointmentDateTo?: string;
    minage?: number | string;
    maxage?: number | string;
    page?: number | string;
    limit?: number | string;
  }) {
    // --- helpers --------------------------------------------------------------
    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

    // Build UTC Date objects that correspond to IST day boundaries.
    // ✅ Corrected date helper — do not shift IST by offset again
    // const istDayRangeToUtc = (yyyyMmDd: string) => {
    //   if (!yyyyMmDd) return null;

    //   const parts = yyyyMmDd.split('-');
    //   if (parts.length !== 3) return null;

    //   const year = Number(parts[0]);
    //   const month = Number(parts[1]);
    //   const day = Number(parts[2]);

    //   if (
    //     !Number.isInteger(year) ||
    //     !Number.isInteger(month) ||
    //     !Number.isInteger(day)
    //   ) {
    //     return null;
    //   }

    //   // Create IST dates (local constructor, no timezone lies)
    //   const istStart = new Date(year, month - 1, day, 0, 0, 0, 0);
    //   const istEnd = new Date(year, month - 1, day, 23, 59, 59, 999);

    //   // Convert IST → UTC exactly once
    //   const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

    //   const utcStart = new Date(istStart.getTime() - IST_OFFSET_MS);
    //   const utcEnd = new Date(istEnd.getTime() - IST_OFFSET_MS);

    //   return { start: utcStart, end: utcEnd };
    // };

    const parseNumberSafe = (v: any) => {
      if (typeof v === 'number') return Number.isFinite(v) ? v : undefined;
      if (typeof v === 'string' && v.trim() !== '') {
        const n = Number(v);
        return Number.isFinite(n) ? n : undefined;
      }
      return undefined;
    };

    // --- pagination & numeric normalization -----------------------------------
    const page = parseNumberSafe(filters.page) ?? 1;
    const limit = parseNumberSafe(filters.limit) ?? 10;
    const skip = (page - 1) * limit;

    // --- build AND conditions safely ------------------------------------------
    const andConditions: any[] = [];

    // scalars: only add if valid numbers or non-empty strings
    const hospitalId = parseNumberSafe(filters.hospitalId);
    if (hospitalId !== undefined) andConditions.push({ hospitalId });

    const DoctorId = parseNumberSafe(filters.DoctorId);
    if (DoctorId !== undefined) andConditions.push({ DoctorId });

    if (filters.status) andConditions.push({ status: filters.status });

    const visitTypeId = parseNumberSafe(filters.visitTypeId);
    if (visitTypeId !== undefined) andConditions.push({ visitTypeId });

    const TagPatientId = parseNumberSafe(filters.TagPatientId);
    if (TagPatientId !== undefined) andConditions.push({ TagPatientId });

    const SpecializationId = parseNumberSafe(filters.SpecializationId);
    if (SpecializationId !== undefined)
      andConditions.push({ SpecializationId });

    if (filters.acuity)
      andConditions.push({ acuity: String(filters.acuity).toUpperCase() });

    // consultation completion (convert string->bool defensively)
    if (filters.consultationStatus) {
      const value = String(filters.consultationStatus).toUpperCase();

      if (
        [
          ConsultationStatus.NOT_STARTED,
          ConsultationStatus.ONGOING,
          ConsultationStatus.COMPLETED,
          ConsultationStatus.INCOMPLETE,
        ].includes(value as ConsultationStatus)
      ) {
        andConditions.push({
          consultation: {
            is: {
              consultationStatus: value as ConsultationStatus,
            },
          },
        });
      }
    }

    // patient nested filters: gender, age -> dateOfBirth range
    const patientFilter: any = {};
    if (filters.GenderName) patientFilter.gender = filters.GenderName;

    if (
      typeof filters.minage !== 'undefined' ||
      typeof filters.maxage !== 'undefined'
    ) {
      const today = new Date();

      if (typeof filters.minage !== 'undefined') {
        const minageN = parseNumberSafe(filters.minage);
        if (minageN !== undefined) {
          const maxDob = new Date(today);
          maxDob.setFullYear(today.getFullYear() - minageN);
          maxDob.setUTCHours(23, 59, 59, 999);
          patientFilter.dateOfBirth = {
            ...(patientFilter.dateOfBirth || {}),
            lte: maxDob,
          };
        }
      }

      if (typeof filters.maxage !== 'undefined') {
        const maxageN = parseNumberSafe(filters.maxage);
        if (maxageN !== undefined) {
          const minDob = new Date(today);
          minDob.setFullYear(today.getFullYear() - maxageN);
          minDob.setUTCHours(0, 0, 0, 0);
          patientFilter.dateOfBirth = {
            ...(patientFilter.dateOfBirth || {}),
            gte: minDob,
          };
        }
      }
    }

    if (Object.keys(patientFilter).length > 0) {
      andConditions.push({ patient: { is: patientFilter } });
    }

    // Appointment date / date-range filter (IST → UTC safe)
    if (filters.appointmentDate) {
      const range = istDayRangeToUtc(filters.appointmentDate);

      if (range) {
        andConditions.push({
          appointmentDate: {
            gte: range.start,
            lte: range.end,
          },
        });
      }
    } else if (filters.appointmentDateFrom || filters.appointmentDateTo) {
      const dateRange: { gte?: Date; lte?: Date } = {};

      if (filters.appointmentDateFrom) {
        const fromRange = istDayRangeToUtc(filters.appointmentDateFrom);
        if (fromRange) {
          dateRange.gte = fromRange.start;
        }
      }

      if (filters.appointmentDateTo) {
        const toRange = istDayRangeToUtc(filters.appointmentDateTo);
        if (toRange) {
          dateRange.lte = toRange.end;
        }
      }

      if (Object.keys(dateRange).length > 0) {
        andConditions.push({
          appointmentDate: dateRange,
        });
      }
    }

    // search (OR) — only if 3+ chars
    if (filters.search && String(filters.search).trim().length >= 3) {
      const q = String(filters.search).trim();
      andConditions.push({
        OR: [
          { patient: { firstName: { contains: q, mode: 'insensitive' } } },
          { patient: { lastName: { contains: q, mode: 'insensitive' } } },
          { patient: { mobile: { contains: q } } },
          { patient: { Patient_Medical_Record_No: { contains: q } } },
        ],
      });
    }

    // Final where
    const where = andConditions.length > 0 ? { AND: andConditions } : {};

    // debug helpful logs (leave in dev)
    console.log('🕵️ Final whereClause:', JSON.stringify(where, null, 2));
    console.log('🧾 pagination', { page, limit, skip });

    // queries
    // query appointments
    const appointments = await this.prisma.appointment.findMany({
      where,
      skip,
      take: limit,
      orderBy: { appointmentDate: 'asc' },
      include: {
        patient: {
          include: {
            allergies: true,
            languages: true,
            medicalHistory: true,
            TagPatient: true,
          },
        },
        doctor: {
          include: {
            Specialization: true,
            DoctorSlot: true,
            DoctorTimeSlot: true,
            DoctorCosting: true,
          },
        },
        visitType: true,
        hospital: true,
        TagPatients: true,
        Vitals: true,
        consultation: {
          include: {
            ConsultationCheifComplaint: { include: { chiefComplaint: true } },
            ConsultationDiagnosis: { include: { diagnosis: true } },
            ConsultationProcedure: { include: { BillingItemCharge: true } },
            ConsultationMedication: true,
            ConsultationInvestigation: {
              include: {
                BillingItemCharge: true,
                // InvestigationSubType: true,
              },
            },
            ConsultationTreatment: true,
            ConsultationFollowUpPlan: true,
            ConsultationclinicalNotes: true,
          },
        },
      },
    });

    // sort them in memory
    const data = appointments.sort((a, b) => {
      const aCompleted = a.consultation?.consultationStatus ? 1 : 0;
      const bCompleted = b.consultation?.consultationStatus ? 1 : 0;

      if (aCompleted !== bCompleted) {
        return aCompleted - bCompleted; // incomplete first
      }

      return (
        new Date(a.appointmentDate).getTime() -
        new Date(b.appointmentDate).getTime()
      );
    });

    // count in parallel
    const total = await this.prisma.appointment.count({ where });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private calculateAge(dob: Date): number {
    const diff = Date.now() - dob.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }

  async getUpcomingFollowups(params: {
    organizationId: number;
    hospitalId: number;
    specializationId?: number;
    search?: string;
    fromDate?: string;
    toDate?: string;
    page: number;
    limit: number;
  }) {
    const {
      organizationId,
      hospitalId,
      specializationId,
      search,
      fromDate,
      toDate,
      page,
      limit,
    } = params;

    // Default range: today → next 45 days
    const from = fromDate ? new Date(fromDate) : new Date();
    from.setHours(0, 0, 0, 0);

    const to = toDate
      ? new Date(toDate)
      : new Date(new Date(from).setDate(from.getDate() + 45));
    to.setHours(23, 59, 59, 999);

    const followups = await this.prisma.appointment.findMany({
      where: {
        hospitalId,
        NextFollowupDate: {
          not: null,
          gte: from,
          lte: to,
        },
        ...(specializationId && {
          SpecializationId: specializationId,
        }),
        patient: {
          OrganizationId: organizationId,
          ...(search && {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
              { mobile: { contains: search } },
              { Patient_Medical_Record_No: { contains: search } },
            ],
          }),
        },
      },
      select: {
        AppointmentId: true,
        appointmentDate: true,
        NextFollowupDate: true,
        SendWhatsappFollowUpReminder: true,
        SpecializationId: true, 

        patient: {
          select: {
            Prefix: true,
            firstName: true,
            lastName: true,
            Patient_Medical_Record_No: true,
            gender: true,
            mobile: true,
            email: true,
            addressLine1: true,
            city: true,
            area: true,
            dateOfBirth: true,
          },
        },
      },
      orderBy: {
        NextFollowupDate: 'asc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      page,
      limit,
      count: followups.length,
      data: followups.map((row, index) => ({
        sno: (page - 1) * limit + index + 1,
        Prefix: row.patient.Prefix,
        gender: row.patient.gender,
        email: row.patient.email,
        addressLine1: row.patient.addressLine1,
        city: row.patient.city,
        firstName: row.patient.firstName,
        lastName: row.patient.lastName,
        name: `${row.patient.firstName} ${row.patient.lastName}`,
        Patient_Medical_Record_No: row.patient.Patient_Medical_Record_No,
        contact: row.patient.mobile,
        area: row.patient.area,
        age: this.calculateAge(row.patient.dateOfBirth),
        PushNotification: row.SendWhatsappFollowUpReminder,
        appointmentId: row.AppointmentId,
        SpecializationId: row.SpecializationId,
        // followUpDate: row.NextFollowupDate,
        // lastVisit: row.appointmentDate,
        // ✅ IST-correct
        followUpDate: dayjs(row.NextFollowupDate)
          .tz('Asia/Kolkata')
          .format('YYYY-MM-DD HH:mm:ss'),

        lastVisit: dayjs(row.appointmentDate)
          .tz('Asia/Kolkata')
          .format('YYYY-MM-DD HH:mm:ss'),
      })),
    };
  }

  //follow up reminders
  @Cron('0 18 * * *', { timeZone: 'Asia/Kolkata' }) // every minute for testing
  async sendFollowupReminders() {
    const pid = process.pid;
    this.logger.log(`⏰ [PID:${pid}] Running follow-up reminder cron`);

    const IST_OFFSET = 5.5 * 60 * 60 * 1000;

    // ✅ 1️⃣ Get TODAY in IST safely
    const istNow = new Date(
      new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date()),
    );

    // istNow = YYYY-MM-DDT00:00:00 IST
    istNow.setHours(0, 0, 0, 0);

    // ✅ 2️⃣ Tomorrow IST window
    const tomorrowIstStart = new Date(istNow);
    tomorrowIstStart.setDate(istNow.getDate() + 1);

    const tomorrowIstEnd = new Date(tomorrowIstStart);
    tomorrowIstEnd.setHours(23, 59, 59, 999);

    // ✅ 3️⃣ Convert IST → UTC ONCE
    const utcStart = new Date(tomorrowIstStart.getTime() - IST_OFFSET);
    const utcEnd = new Date(tomorrowIstEnd.getTime() - IST_OFFSET);

    this.logger.log(
      `📅 IST Tomorrow: ${tomorrowIstStart.toString()} → ${tomorrowIstEnd.toString()}`,
    );
    this.logger.log(
      `🌍 UTC Window: ${utcStart.toISOString()} → ${utcEnd.toISOString()}`,
    );

    // ✅ 4️⃣ Lock appointments
    const lock = await this.prisma.appointment.updateMany({
      where: {
        NextFollowupDate: {
          gte: utcStart,
          lte: utcEnd,
        },
        SendWhatsappFollowUpReminder: false,
        status: { not: 'CANCELLED' },
        patient: {
          mobile: { gt: '' },
        },
      },
      data: {
        SendWhatsappFollowUpReminder: true,
      },
    });

    if (lock.count === 0) {
      this.logger.log('✅ No follow-up reminders to send');
      return;
    }

    this.logger.log(`🔒 Locked ${lock.count} follow-up appointments`);

    // ✅ 5️⃣ Fetch locked rows
    const followups = await this.prisma.appointment.findMany({
      where: {
        NextFollowupDate: {
          gte: utcStart,
          lte: utcEnd,
        },
        SendWhatsappFollowUpReminder: true,
      },
      include: {
        patient: { select: { firstName: true, lastName: true, mobile: true } },
        doctor: { select: { firstName: true, lastName: true } },
        hospital: { select: { HospitalName: true } },
      },
    });

    // ✅ 6️⃣ Send WhatsApp
    for (const appt of followups) {
      try {
        await this.whatsappService.sendFollowupReminder({
          mobile: appt.patient.mobile!,
          patientName: `${appt.patient.firstName} ${appt.patient.lastName ?? ''}`,
          doctorName: `${appt.doctor.firstName} ${appt.doctor.lastName ?? ''}`,
          followupDate: appt.NextFollowupDate!,
          hospitalName: appt.hospital.HospitalName,
        });

        this.logger.log(
          `✅ Reminder sent (AppointmentId=${appt.AppointmentId})`,
        );
      } catch (err) {
        this.logger.error(
          `❌ Failed (AppointmentId=${appt.AppointmentId})`,
          err,
        );

        await this.prisma.appointment.update({
          where: { AppointmentId: appt.AppointmentId },
          data: { SendWhatsappFollowUpReminder: false },
        });
      }
    }
  }
}
