import { Injectable } from '@nestjs/common';
import { VitalsDto } from './dto/vitals.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrUpdateConsultationDto } from './dto/create-update-consultation.dto';
import { CreateInvestigationSubTypeDto } from './dto/createinvestigationtype.dto';
import { CreateDiagnosisDto } from './dto/create-diagnosis.dto';
import { MailerService } from 'src/common/mailer/mailer.service';
import { generateCaseSheetHtml } from 'src/utils/case-sheet-template';
import { generatePdfFromHtml } from 'src/utils/pdf-generator.util';

@Injectable()
export class ConsultationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  // async upsertVitals(dto: VitalsDto, user: number) {
  //   const existing = await this.prisma.vitals.findUnique({
  //     where: { AppointmentId: dto.AppointmentId },
  //   });

  //   if (existing) {
  //     // Log to history
  //     // await this.prisma.vitalsHistory.create({
  //     //   data: {
  //     //     VitalsId: existing.VitalsId,
  //     //     AppointmentId: existing.AppointmentId,
  //     //     Systolic: existing.Systolic,
  //     //     Diastolic: existing.Diastolic,
  //     //     Weight: existing.Weight,
  //     //     Temperature: existing.Temperature,
  //     //     HeartRate: existing.HeartRate,
  //     //     OxygenSaturation: existing.OxygenSaturation,
  //     //     Height: existing.Height,
  //     //     BloodGroup: existing.BloodGroup,
  //     //     BMI: existing.BMI,
  //     //     updatedById: user,
  //     //   },
  //     // });

  //     await this.prisma.vitalsHistory.create({
  //       data: {
  //         ...existing,
  //         updatedById: user,
  //         updatedAt: new Date(),
  //       },
  //     });

  //     // Update
  //     return this.prisma.vitals.update({
  //       where: { AppointmentId: dto.AppointmentId },
  //       data: {
  //         ...dto,
  //         createdById: existing.createdById ?? user, // preserve or fallback
  //       },
  //     });
  //   } else {
  //     // Create
  //     return this.prisma.vitals.create({
  //       data: {
  //         ...dto,
  //         createdById: user,
  //       },
  //     });
  //   }
  // }

  async upsertVitals(dto: VitalsDto, user: number) {
    const { AppointmentId, ...vitalsData } = dto;

    const existing = await this.prisma.vitals.findUnique({
      where: { AppointmentId },
    });

    if (existing) {
      const updated = await this.prisma.vitals.update({
        where: { AppointmentId },
        data: {
          ...vitalsData,
          createdById: existing.createdById ?? user,
        },
      });

      await this.prisma.vitalsHistory.create({
        data: {
          VitalsId: updated.VitalsId,
          AppointmentId: updated.AppointmentId,
          Systolic: updated.Systolic,
          Diastolic: updated.Diastolic,
          Weight: updated.Weight,
          Temperature: updated.Temperature,
          HeartRate: updated.HeartRate,
          OxygenSaturation: updated.OxygenSaturation,
          Height: updated.Height,
          BloodGroup: updated.BloodGroup,
          BMI: updated.BMI,
          updatedById: user,
          updatedAt: new Date(),
        },
      });

      return updated;
    } else {
      const created = await this.prisma.vitals.create({
        data: {
          ...vitalsData,
          AppointmentId, // ✅ safe to include here
          createdById: user,
        },
      });

      await this.prisma.vitalsHistory.create({
        data: {
          VitalsId: created.VitalsId,
          AppointmentId: created.AppointmentId,
          Systolic: created.Systolic,
          Diastolic: created.Diastolic,
          Weight: created.Weight,
          Temperature: created.Temperature,
          HeartRate: created.HeartRate,
          OxygenSaturation: created.OxygenSaturation,
          Height: created.Height,
          BloodGroup: created.BloodGroup,
          BMI: created.BMI,
          updatedById: user,
          updatedAt: new Date(),
        },
      });

      return created;
    }
  }

  // Get vitals with history
  async getVitalsWithHistory(appointmentId: number) {
    const current = await this.prisma.vitals.findUnique({
      where: { AppointmentId: appointmentId },
    });

    const history = await this.prisma.vitalsHistory.findMany({
      where: { AppointmentId: appointmentId },
      orderBy: { updatedAt: 'desc' },
    });

    return { current, history };
  }

  // Add or update consultation
  // async addOrUpdateConsultation(
  //   dto: CreateOrUpdateConsultationDto,
  //   userId: number,
  // ) {
  //   const {
  //     ConsultationId,
  //     AppointmentId,
  //     CheifcomplaintNotes,
  //     followUpDate,
  //     isDraft,
  //     consultationDatTime,
  //     consultationEndDateTime,
  //     ConsultationCheifComplaint,
  //     ConsultationDiagnosis,
  //     ConsultationInvestigation,
  //     ConsultationMedication,
  //     ConsultationTreatment,
  //     ConsultationFollowUpPlan,
  //     ConsultationclinicalNotes,
  //   } = dto;

  //   const baseData = {
  //     AppointmentId,
  //     CheifcomplaintNotes,
  //     followUpDate,
  //     isDraft,
  //     consultationDatTime,
  //     consultationEndDateTime,
  //     updatedById: userId,
  //   };

  //   return this.prisma.consultation.upsert({
  //     where: {
  //       ConsultationId: ConsultationId ?? 0,
  //     },
  //     create: {
  //       ...baseData,
  //       createdById: userId,
  //       ConsultationCheifComplaint: {
  //         create:
  //           ConsultationCheifComplaint?.map((item) => ({
  //             chiefComplaint: {
  //               connect: {
  //                 ChiefComplaintTagId: item.ChiefComplaintTagId,
  //                 // ChiefComplainTagName: item.ChiefComplainTagName,
  //               },
  //             },
  //           })) || [],
  //       },

  //       ConsultationDiagnosis: {
  //         create:
  //           ConsultationDiagnosis?.map((d) => ({
  //             diagnosis: {
  //               connect: { DiagnosisId: d.diagnosisId },
  //             },
  //             DiagnosisRemark: d.DiagnosisRemark,
  //           })) || [],
  //       },
  //       ConsultationInvestigation: {
  //         create:
  //           ConsultationInvestigation?.map((inv) => ({
  //             InvestigationType: {
  //               connect: { InvestigationTypeId: inv.InvestigationTypeId },
  //             },
  //             InvestigationSubType: {
  //               connect: {
  //                 InvestigationSubTypeId: inv.InvestigationSubTypeId,
  //               },
  //             },
  //             ConsultationInvestigatRemark:
  //               inv.ConsultationInvestigatRemark ?? '',
  //           })) || [],
  //       },
  //       ConsultationMedication: {
  //         create:
  //           ConsultationMedication?.map((med) => ({
  //             medicationName: med.medicationName ?? '',
  //             dosage: med.dosage ?? '',
  //             frequency: med.frequency ?? '',
  //             duration: med.duration ?? '',
  //             remarks: med.remarks ?? '',
  //           })) || [],
  //       },
  //       ConsultationTreatment: {
  //         create:
  //           ConsultationTreatment?.map((treat) => ({
  //             source: treat.source ?? 'TYPED', // Default value fallback
  //             treatmentText: treat.treatmentText ?? '',
  //           })) || [],
  //       },
  //       ConsultationFollowUpPlan: ConsultationFollowUpPlan
  //         ? {
  //             create: {
  //               followUpText: ConsultationFollowUpPlan.followUpText,
  //               duration: ConsultationFollowUpPlan.duration,
  //               unit: ConsultationFollowUpPlan.unit,
  //               nextDate: ConsultationFollowUpPlan.nextDate,
  //             },
  //           }
  //         : undefined,
  //       ConsultationclinicalNotes: {
  //         create:
  //           ConsultationclinicalNotes?.map((note) => ({
  //             content: note.content ?? '',
  //           })) || [],
  //       },
  //     },
  //     // Update logic

  //     update: {
  //       ...baseData,
  //       ConsultationCheifComplaint: {
  //         deleteMany: {},
  //         create:
  //           ConsultationCheifComplaint?.map((item) => ({
  //             chiefComplaint: {
  //               connect: { ChiefComplaintTagId: item.ChiefComplaintTagId },
  //             },
  //           })) || [],
  //       },
  //       ConsultationDiagnosis: {
  //         deleteMany: {},
  //         create:
  //           ConsultationDiagnosis?.map((d) => ({
  //             diagnosis: {
  //               connect: { DiagnosisId: d.diagnosisId },
  //             },
  //             DiagnosisRemark: d.DiagnosisRemark,
  //           })) || [],
  //       },
  //       ConsultationInvestigation: {
  //         deleteMany: {},
  //         create:
  //           ConsultationInvestigation?.map((inv) => ({
  //             InvestigationType: {
  //               connect: { InvestigationTypeId: inv.InvestigationTypeId },
  //             },
  //             InvestigationSubType: {
  //               connect: {
  //                 InvestigationSubTypeId: inv.InvestigationSubTypeId,
  //               },
  //             },
  //             ConsultationInvestigatRemark:
  //               inv.ConsultationInvestigatRemark ?? '',
  //           })) || [],
  //       },
  //       ConsultationMedication: {
  //         create:
  //           ConsultationMedication?.map((med) => ({
  //             medicationName: med.medicationName ?? '',
  //             dosage: med.dosage ?? '',
  //             frequency: med.frequency ?? '',
  //             duration: med.duration ?? '',
  //             remarks: med.remarks ?? '',
  //           })) || [],
  //       },
  //       ConsultationTreatment: {
  //         create:
  //           ConsultationTreatment?.map((treat) => ({
  //             source: treat.source ?? 'TYPED', // Default value fallback
  //             treatmentText: treat.treatmentText ?? '',
  //           })) || [],
  //       },
  //       ConsultationFollowUpPlan: ConsultationFollowUpPlan
  //         ? {
  //             create: {
  //               followUpText: ConsultationFollowUpPlan.followUpText,
  //               duration: ConsultationFollowUpPlan.duration,
  //               unit: ConsultationFollowUpPlan.unit,
  //               nextDate: ConsultationFollowUpPlan.nextDate,
  //             },
  //           }
  //         : undefined,
  //       ConsultationclinicalNotes: {
  //         create:
  //           ConsultationclinicalNotes?.map((note) => ({
  //             content: note.content ?? '',
  //           })) || [],
  //       },
  //     },
  //   });
  // }
  async addOrUpdateConsultation(
    dto: CreateOrUpdateConsultationDto,
    userId: number,
  ) {
    const {
      ConsultationId,
      AppointmentId,
      CheifcomplaintNotes,
      followUpDate,
      consultationDatTime,
      consultationEndDateTime,
      isDraft,
      ConsultationclinicalNotes,
      ConsultationCheifComplaint,
      ConsultationDiagnosis,
      ConsultationMedication,
      ConsultationInvestigation,
      ConsultationTreatment,
      ConsultationFollowUpPlan,
    } = dto;

    const baseData = {
      AppointmentId,
      CheifcomplaintNotes,
      followUpDate,
      consultationDatTime: consultationDatTime
        ? new Date(consultationDatTime)
        : undefined,
      consultationEndDateTime: consultationEndDateTime
        ? new Date(consultationEndDateTime)
        : undefined,
      isDraft: isDraft ?? false,
      updatedById: userId,
    };

    let consultationResult;

    if (ConsultationId) {
      // Update flow
      consultationResult = await this.prisma.consultation.update({
        where: { ConsultationId },
        data: {
          ...baseData,
          ConsultationCheifComplaint: {
            deleteMany: {},
            create:
              ConsultationCheifComplaint?.map((item) => ({
                chiefComplaint: {
                  connect: { ChiefComplaintTagId: item.ChiefComplaintTagId },
                },
              })) || [],
          },
          ConsultationDiagnosis: {
            deleteMany: {},
            create:
              ConsultationDiagnosis?.map((d) => ({
                diagnosis: {
                  connect: { DiagnosisId: d.diagnosisId },
                },
                DiagnosisRemark: d.DiagnosisRemark,
              })) || [],
          },
          ConsultationInvestigation: {
            deleteMany: {},
            create:
              ConsultationInvestigation?.map((inv) => ({
                InvestigationType: {
                  connect: { InvestigationTypeId: inv.InvestigationTypeId },
                },
                InvestigationSubType: {
                  connect: {
                    InvestigationSubTypeId: inv.InvestigationSubTypeId,
                  },
                },
                ConsultationInvestigatRemark:
                  inv.ConsultationInvestigatRemark ?? '',
              })) || [],
          },
          ConsultationMedication: {
            deleteMany: {},
            create:
              ConsultationMedication?.map((med) => ({
                medicationName: med.medicationName ?? '',
                dosage: med.dosage ?? '',
                frequency: med.frequency ?? '',
                duration: med.duration ?? '',
                remarks: med.remarks ?? '',
              })) || [],
          },
          ConsultationTreatment: {
            deleteMany: {},
            create:
              ConsultationTreatment?.map((treat) => ({
                source: treat.source ?? 'TYPED',
                treatmentText: treat.treatmentText ?? '',
              })) || [],
          },
          ConsultationFollowUpPlan: ConsultationFollowUpPlan
            ? {
                deleteMany: {},
                create: {
                  followUpText: ConsultationFollowUpPlan.followUpText,
                  duration: ConsultationFollowUpPlan.duration,
                  unit: ConsultationFollowUpPlan.unit,
                  nextDate: ConsultationFollowUpPlan.nextDate,
                },
              }
            : undefined,
          ConsultationclinicalNotes: {
            deleteMany: {},
            create:
              ConsultationclinicalNotes?.map((note) => ({
                content: note.content ?? '',
              })) || [],
          },
        },
      });
    } else {
      // Create flow
      consultationResult = await this.prisma.consultation.create({
        data: {
          ...baseData,
          createdById: userId,
          ConsultationCheifComplaint: {
            create:
              ConsultationCheifComplaint?.map((item) => ({
                chiefComplaint: {
                  connect: { ChiefComplaintTagId: item.ChiefComplaintTagId },
                },
              })) || [],
          },
          ConsultationDiagnosis: {
            create:
              ConsultationDiagnosis?.map((d) => ({
                diagnosis: {
                  connect: { DiagnosisId: d.diagnosisId },
                },
                DiagnosisRemark: d.DiagnosisRemark,
              })) || [],
          },
          ConsultationInvestigation: {
            create:
              ConsultationInvestigation?.map((inv) => ({
                InvestigationType: {
                  connect: { InvestigationTypeId: inv.InvestigationTypeId },
                },
                InvestigationSubType: {
                  connect: {
                    InvestigationSubTypeId: inv.InvestigationSubTypeId,
                  },
                },
                ConsultationInvestigatRemark:
                  inv.ConsultationInvestigatRemark ?? '',
              })) || [],
          },
          ConsultationMedication: {
            create:
              ConsultationMedication?.map((med) => ({
                medicationName: med.medicationName ?? '',
                dosage: med.dosage ?? '',
                frequency: med.frequency ?? '',
                duration: med.duration ?? '',
                remarks: med.remarks ?? '',
              })) || [],
          },
          ConsultationTreatment: {
            create:
              ConsultationTreatment?.map((treat) => ({
                source: treat.source ?? 'TYPED',
                treatmentText: treat.treatmentText ?? '',
              })) || [],
          },
          ConsultationFollowUpPlan: ConsultationFollowUpPlan
            ? {
                create: {
                  followUpText: ConsultationFollowUpPlan.followUpText,
                  duration: ConsultationFollowUpPlan.duration,
                  unit: ConsultationFollowUpPlan.unit,
                  nextDate: ConsultationFollowUpPlan.nextDate,
                },
              }
            : undefined,
          ConsultationclinicalNotes: {
            create:
              ConsultationclinicalNotes?.map((note) => ({
                content: note.content ?? '',
              })) || [],
          },
        },
      });
    }

    // ✅ Now safely run case sheet logic after DB op
    if (dto.IsSentCaseSheet) {
      const appointment = await this.prisma.appointment.findUnique({
        where: { AppointmentId },
        include: {
          patient: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
              dateOfBirth: true,
              Patient_Medical_Record_No: true,
              mobile: true,
              gender: true,
            },
          },
          hospital: {
            select: {
              HospitalName: true,
              address: true,
              email: true,
              contactNumber: true,
              HospitalCode: true,
            },
          },
          doctor: {
            select: { firstName: true, lastName: true, email: true },
          },
          Vitals: true,
        },
      });

      const consultationFull = await this.prisma.consultation.findUnique({
        where: { ConsultationId: consultationResult.ConsultationId },
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
      });

      if (appointment?.patient?.email) {
        const patientName = `${appointment.patient.firstName} ${appointment.patient.lastName}`;
        const html = generateCaseSheetHtml(
          patientName,
          AppointmentId,
          consultationFull, // <-- the result from Prisma
          appointment, // <-- full appointment info with patient, doctor, hospital
        );

        const pdfBuffer = await generatePdfFromHtml(html);
        await this.mailerService.sendMailWithAttachment(
          appointment.patient.email,
          `Consultation Case Sheet - Appointment #${AppointmentId}`,
          `<p>Dear ${patientName},</p><p>Find attached your consultation summary.</p>`,
          [
            {
              filename: `CaseSheet_${AppointmentId}.pdf`,
              content: pdfBuffer,
              contentType: 'application/pdf',
            },
          ],
        );
      }
    }

    return consultationResult;
  }

  // Create or find investigation subtype
  async createOrFindSubtype(dto: CreateInvestigationSubTypeDto, user: number) {
    const existing = await this.prisma.investigationSubType.findFirst({
      where: {
        InvestigationTypeId: dto.InvestigationTypeId,
        InvestigationSubTypename: (dto.InvestigationSubTypename ?? '').trim(),
      },
    });

    if (existing) return existing;

    return this.prisma.investigationSubType.create({
      data: {
        InvestigationTypeId: dto.InvestigationTypeId,
        InvestigationSubTypename: (dto.InvestigationSubTypename ?? '').trim(),
      },
    });
  }

  // Get consultation by appointment ID
  async getpatientConsultationconsultationByAppointmentId(
    appointmentId: number,
  ) {
    return this.prisma.consultation.findUnique({
      where: { AppointmentId: appointmentId },
      include: {
        ConsultationCheifComplaint: {
          include: {
            chiefComplaint: true,
          },
        },
        ConsultationclinicalNotes: true,
        ConsultationDiagnosis: {
          include: {
            diagnosis: true,
          },
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
        appointment: {
          include: {
            patient: true,
            doctor: true,
          },
        },
      },
    });
  }
  async createDiagnosis(dto: CreateDiagnosisDto) {
    const { DiagnosisName, icdCode, specializationId } = dto;

    return this.prisma.diagnosis.create({
      data: {
        DiagnosisName: DiagnosisName ?? '',
        icdCode, // This is optional, can be null
        specialization: specializationId
          ? { connect: { SpecializationId: specializationId } }
          : undefined,
      },
    });
  }
  async getAllDiagnosis() {
    return this.prisma.diagnosis.findMany({
      orderBy: {
        DiagnosisName: 'asc',
      },
    });
  }

  // async getDiagnosesBySpecialization(specializationId: number) {
  //   return this.prisma.diagnosis.findMany({
  //     where: {
  //       specializationId,
  //     },
  //     orderBy: {
  //       DiagnosisName: 'asc',
  //     },
  //   });
  // }
}
