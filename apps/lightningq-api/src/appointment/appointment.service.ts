import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QuickAppointmentDto } from './dto/create-appointment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BloodGroup, AcuityLevel, $Enums, GenderType } from 'generated/prisma';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { MailerService } from 'src/common/mailer/mailer.service';
import { createEvent } from 'ics';
import { STATUS_CODES } from 'http';
// import { subMinutes, addMilliseconds } from 'date-fns';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  async BookAppointment(dto: QuickAppointmentDto, CreatedBy: number) {
    let patient;

    if (dto.PatientId) {
      // 🟢 Existing patient
      patient = await this.prisma.patient.findUnique({
        where: { PatientId: dto.PatientId },
      });

      if (!patient) {
        throw new Error('Patient not found with provided PatientId');
      }
    } else {
      // 🆕 New patient: generate MRN
      const hospitalCode = dto.hospitalId
        ? `H${String(dto.hospitalId).padStart(3, '0')}`
        : 'H001';

      const lastPatient = await this.prisma.patient.findFirst({
        where: {
          Patient_Medical_Record_No: {
            startsWith: hospitalCode,
          },
        },
        orderBy: { PatientId: 'desc' },
      });

      const nextNumber = lastPatient?.Patient_Medical_Record_No
        ? parseInt(
            lastPatient.Patient_Medical_Record_No.replace(hospitalCode, ''),
          ) + 1
        : 1;

      const paddedNumber = String(nextNumber).padStart(6, '0');
      const generatedMRN = `${hospitalCode}${paddedNumber}`;

      if (generatedMRN.length !== 10) {
        throw new Error(
          'Generated Patient_Medical_Record_No must be 10 digits',
        );
      }

      // 🏥 Create new patient with MRN
      patient = await this.prisma.patient.create({
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

    // Combine date + time
    const appointmentDate = new Date(
      `${dto.appointmentDate}T${dto.appointmentTime}:00`,
    );

    if (
      dto.DoctorId === undefined ||
      dto.visitTypeId === undefined ||
      dto.paymentTypeId === undefined
    ) {
      throw new Error('DoctorId, visitTypeId, and paymentTypeId are required.');
    }

    const paymentHistory = await this.prisma.paymentHistory.create({
      data: {
        TransactionId: Date.now(), // or use a proper transaction service
        Transaction_DateTime: new Date(),
        paymentTypePaymentTypeId: dto.paymentTypeId, // ensure this exists
        AppointmentChargesPaid: parseFloat(dto.AppointmentCharges || '0'),
        isAmountPaid: dto.isAmountPaid ?? true,
      },
    });

    // 🛑 Prevent duplicate scheduled appointment
    const existingAppointment = await this.prisma.appointment.findFirst({
      where: {
        PatientId: patient.PatientId,
        DoctorId: dto.DoctorId,
        appointmentDate: {
          gte: new Date(dto.appointmentDate + 'T00:00:00'),
          lt: new Date(dto.appointmentDate + 'T23:59:59'),
        },
        status: 'SCHEDULED',
      },
    });

    if (existingAppointment) {
      throw new HttpException(
        {
          status: 'failure',
          message:
            ' Appointment already exists for this patient with this doctor. Please reschedule instead.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    let appointment;
    try {
      appointment = await this.prisma.appointment.create({
        data: {
          PatientId: patient.PatientId,
          DoctorId: dto.DoctorId,
          hospitalId: dto.hospitalId,
          visitTypeId: dto.visitTypeId,
          paymentTypeId: dto.paymentTypeId,
          paymentHistoryId: paymentHistory.PaymentHistoryId,
          TagPatientId: dto.TagPatientId,
          appointmentDate,
          reason: dto.reason,
          age: dto.age,
          createdBy: CreatedBy,
          sendWhatsappMessage: dto.sendWhatsappMessage,
          sendSmsMessage: dto.sendSmsMessage,
          sendEmailMessage: dto.sendEmailMessage,
          acuity: (dto.acuity as AcuityLevel) ?? 'MODERATE',
        },
      });
    } catch (err) {
      console.error('🔥 Prisma Appointment Creation Error:', err);
      throw new Error('Failed to create appointment in DB');
    }

    // ✅ Fetch appointment with relations: doctor and hospital
    const appointmentWithDetails = await this.prisma.appointment.findUnique({
      where: {
        AppointmentId: appointment.AppointmentId,
      },
      include: {
        doctor: true,
        hospital: true,
        visitType: true,
      },
    });

    if (!dto.appointmentDate) {
      throw new Error('appointmentDay is required to create a DoctorSlot.');
    }

    const slotDate = new Date(dto.appointmentDate ?? ''); // ✅ "2025-07-17"

    const slotDayOfWeek = slotDate
      .toLocaleString('en-US', { weekday: 'long' })
      .toUpperCase(); // "THURSDAY"

    const doctorTimeSlot = await this.prisma.doctorTimeSlot.findFirst({
      where: {
        DoctorId: dto.DoctorId,
        HospitalId: dto.hospitalId,
        DoctorTimeSlotId: dto.DoctorTimeSlotId,
        // DayOfWeek: {
        //   equals: slotDayOfWeek, // matches exact day name: "THURSDAY"
        //   mode: 'insensitive',
        // },
      },
    });

    if (!doctorTimeSlot) {
      throw new Error(`No time slot found for doctor on ${slotDayOfWeek}`);
    }

    // 🟢 Create DoctorSlot
    await this.prisma.doctorSlot.create({
      data: {
        doctorId: dto.DoctorId!,
        hospitalId: dto.hospitalId,
        DoctorTimeSlotId: doctorTimeSlot.DoctorTimeSlotId,
        slotDate,
        slotTime: dto.appointmentTime!, // ensure not undefined
        dayOfWeek: slotDayOfWeek,
        isBooked: true,
        appointmentId: appointment.AppointmentId,
      },
    });

    await this.sendAllNotificationsForAppointment(
      appointment.AppointmentId,
      patient.email,
      appointment,
      patient,
      appointmentWithDetails,
      appointment.sendEmailMessage,
      appointment.sendSmsMessage,
      appointment.sendWhatsappMessage,
    );

    return {
      message: 'Quick appointment booked successfully',
      appointment,
      patient,
      STATUS_CODES: 200,
    };
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
      <div style="background-color: #007BFF; color: white; padding: 20px 30px;">
        <h2 style="margin: 0;">Your ${appointmentWithDetails?.visitType?.AppointmentTypeName ?? 'Follow Up'} Appointment has been ${appointment?.status} ?? 'confirmed'</h2>
      </div>
      <div style="padding: 30px;">
        <p>Dear <strong>${patient?.firstName} ${patient?.lastName}</strong>,</p>
        <p>This is a confirmation email for your appointment with <strong>Dr. ${doctorFullName}</strong> on <strong>${appointmentDate}</strong> at <strong>${appointmentTime}</strong>.</p>

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
        `Appointment ${appointment?.status}? 'Confirmed': ${appointmentDate} ${appointmentTime}`,
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
        email: 'contact@lightningq.in',
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
      },
    });
    console.log(appointmentWithDetails);
    await this.sendAllNotificationsForAppointment(
      appointment.AppointmentId,
      appointmentWithDetails?.patient?.email ?? '',
      appointment,
      appointmentWithDetails?.patient,
      appointmentWithDetails,
      appointment.sendEmailMessage,
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
      STATUS_CODES: 200,
    };
  }

  //searchAppointments
  async searchAppointments(filters: {
    hospitalId?: number;
    DoctorId?: number;
    status?: string;
    visitTypeId?: number;
    acuity?: string;
    search?: string;
    appointmentDate?: string;
    appointmentDateFrom?: string;
    appointmentDateTo?: string;
    page?: number;
    limit?: number;
  }) {
    const whereClause: any = {
      ...(filters.hospitalId && { hospitalId: filters.hospitalId }),
      ...(filters.DoctorId && { DoctorId: filters.DoctorId }),
      ...(filters.status && { status: filters.status }),
      ...(filters.visitTypeId && { visitTypeId: filters.visitTypeId }),
      ...(filters.acuity && { acuity: filters.acuity }),
    };

    if (filters.search && filters.search.length >= 3) {
      whereClause.OR = [
        {
          patient: {
            firstName: { contains: filters.search, mode: 'insensitive' },
          },
        },
        {
          patient: {
            lastName: { contains: filters.search, mode: 'insensitive' },
          },
        },
        {
          patient: {
            mobile: { contains: filters.search },
          },
        },
        {
          patient: {
            Patient_Medical_Record_No: {
              contains: filters.search,
            },
          },
        },
      ];
    }

    // ✅ Date filtering logic
    // ✅ Date filtering logic
    if (filters.appointmentDate) {
      const istDateString = filters.appointmentDate;

      const startIST = new Date(`${istDateString}T00:00:00+05:30`);
      const endIST = new Date(`${istDateString}T23:59:59+05:30`);

      const startUTC = new Date(startIST.toISOString());
      const endUTC = new Date(endIST.toISOString());

      whereClause.appointmentDate = {
        gte: startUTC,
        lte: endUTC,
      };

      console.log('📆 IST date:', filters.appointmentDate);
      console.log('🕒 UTC range (finalized):', {
        from: startUTC.toISOString(),
        to: endUTC.toISOString(),
      });
    } else if (filters.appointmentDateFrom || filters.appointmentDateTo) {
      whereClause.appointmentDate = {};

      if (filters.appointmentDateFrom) {
        const from = new Date(filters.appointmentDateFrom);
        from.setUTCHours(0, 0, 0, 0);
        whereClause.appointmentDate.gte = from;
      }

      if (filters.appointmentDateTo) {
        const to = new Date(filters.appointmentDateTo);
        to.setUTCHours(23, 59, 59, 999);
        whereClause.appointmentDate.lte = to;
      }
    }

    console.log('📅 Filtering appointments between:');
    // console.log("   Start:", startDate.toISOString());
    // console.log("   End  :", endDate.toISOString());

    // Also log a few DB appointmentDates for reference
    const allAppts = await this.prisma.appointment.findMany({
      select: { appointmentDate: true },
      orderBy: { appointmentDate: 'desc' },
      take: 10,
    });
    console.log(
      '🗂 Recent DB Dates:',
      allAppts.map((a) => a.appointmentDate.toISOString()),
    );

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.appointment.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { appointmentDate: 'asc' },
        include: {
          patient: {
            include:{
              allergies: true,
              languages: true,
              medicalHistory: true,
              TagPatient: true,
            }

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
          TagPatient: true,
          Vitals: true,
          consultation: {
            include: {
              ConsultationCheifComplaint: {
                include: { chiefComplaint: true },
              },
              ConsultationDiagnosis: {
                include: { diagnosis: true },
              },
              ConsultationMedication: true,
              ConsultationInvestigation: {
                include: {
                  InvestigationType: true,
                  InvestigationSubType: true,
                },
              },
              ConsultationTreatment: true,
              ConsultationFollowUpPlan: true,
              ConsultationclinicalNotes: true,
            },
          },
        },
      }),
      this.prisma.appointment.count({ where: whereClause }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
