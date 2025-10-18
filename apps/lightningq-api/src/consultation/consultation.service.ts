import { Injectable } from '@nestjs/common';
import { VitalsDto } from './dto/vitals.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrUpdateConsultationDto } from './dto/create-update-consultation.dto';
import { CreateInvestigationSubTypeDto } from './dto/createinvestigationtype.dto';
import { CreateDiagnosisDto } from './dto/create-diagnosis.dto';
import { MailerService } from 'src/common/mailer/mailer.service';
import { generateCaseSheetHtml } from 'src/utils/case-sheet-template';
import { generatePdfFromHtml } from 'src/utils/pdf-generator.util';
import { CreateChiefComplaintDto } from './dto/CreateCheifcomplaint.dto';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { ConsultationProcedureDto } from './dto/CreateOrUpdateConsultationDto';

@Injectable()
export class ConsultationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

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
      ConsultationProcedure,
      IsConsultationCompleted,
      IsSentCaseSheet,
    } = dto;

    // ✅ Base scalar-only fields (no relations)
    const baseData = {
      CheifcomplaintNotes,
      followUpDate,
      consultationDatTime: consultationDatTime
        ? new Date(consultationDatTime)
        : undefined,
      consultationEndDateTime: consultationEndDateTime
        ? new Date(consultationEndDateTime)
        : undefined,
      isDraft: isDraft ?? false,
      IsConsultationCompleted: IsConsultationCompleted ?? false,
    };

    let consultationResult;
    let targetId: number | undefined;

    // 🩺 Find existing consultation (by ConsultationId or AppointmentId)
    if (ConsultationId) {
      const existing = await this.prisma.consultation.findUnique({
        where: { ConsultationId },
        select: { ConsultationId: true },
      });
      targetId = existing?.ConsultationId;
    }

    if (!targetId) {
      const existingByAppointment = await this.prisma.consultation.findUnique({
        where: { AppointmentId },
        select: { ConsultationId: true },
      });
      targetId = existingByAppointment?.ConsultationId;
    }

    console.log('🧩 Target consultation ID:', targetId);

    // 🟡 UPDATE EXISTING CONSULTATION
    // 🟡 UPDATE EXISTING CONSULTATION
    if (targetId) {
      consultationResult = await this.prisma.consultation.update({
        where: { ConsultationId: targetId },
        data: {
          ...baseData,
          IsConsultationCompleted: IsConsultationCompleted ?? false, // ✅ Explicit scalar update

          // ✅ Only connect relation (don’t overwrite)
          appointment: { connect: { AppointmentId } },
          updatedBy: { connect: { UserId: userId } },

          // 🔽 Nested relations
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
                  connectOrCreate: {
                    where: { DiagnosisId: d.diagnosisId ?? 0 },
                    create: {
                      DiagnosisName: d.DiagnosisName || 'Unspecified Diagnosis',
                    },
                  },
                },
                DiagnosisRemark: d.DiagnosisRemark ?? '',
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

          ConsultationProcedure: {
            deleteMany: {},
            create:
              (ConsultationProcedure || []).map((p) => ({
                procedure: p.ProcedureId
                  ? { connect: { ProcedureId: p.ProcedureId } }
                  : p.ProcedureName
                    ? { create: { ProcedureName: p.ProcedureName } }
                    : undefined,
                Description: p.Description ?? '',
                ProcedureDateTime: p.ProcedureDateTime
                  ? new Date(p.ProcedureDateTime)
                  : undefined,
              })) || [],
          },
        },
      });

      // ✅ Force sync the Appointment table’s flag
      await this.prisma.appointment.update({
        where: { AppointmentId },
        data: {
          IsConsultationCompleted: IsConsultationCompleted ?? false,
          status: IsConsultationCompleted ? 'COMPLETED' : 'SCHEDULED',
        },
      });

      console.log(
        `✅ Appointment ${AppointmentId} updated — Consultation ${
          IsConsultationCompleted ? 'Completed' : 'Pending'
        }`,
      );
    }

    // 🆕 CREATE NEW CONSULTATION
    else {
      console.log('🆕 Creating new consultation...');

      consultationResult = await this.prisma.$transaction(async (tx) => {
        const result = await tx.consultation.create({
          data: {
            ...baseData,

            // ✅ Relation connects instead of FK scalars
            createdBy: { connect: { UserId: userId } },
            appointment: { connect: { AppointmentId } },

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
                    connectOrCreate: {
                      where: { DiagnosisId: d.diagnosisId ?? 0 },
                      create: {
                        DiagnosisName:
                          d.DiagnosisName || 'Unspecified Diagnosis',
                      },
                    },
                  },
                  DiagnosisRemark: d.DiagnosisRemark ?? '',
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

            ConsultationProcedure: {
              create:
                (ConsultationProcedure || []).map((p) => ({
                  procedure: p.ProcedureId
                    ? { connect: { ProcedureId: p.ProcedureId } }
                    : p.ProcedureName
                      ? { create: { ProcedureName: p.ProcedureName } }
                      : undefined,
                  Description: p.Description ?? '',
                  ProcedureDateTime: p.ProcedureDateTime
                    ? new Date(p.ProcedureDateTime)
                    : undefined,
                  // IsCompleted: p.IsCompleted ?? false,
                  // PerformedBy: p.PerformedBy ?? null,
                  // Remarks: p.Remarks ?? '',
                })) || [],
            },
          },
        });

        // ✅ Link consultation to appointment
        await tx.appointment.update({
          where: { AppointmentId },
          data: {
            consultationId: result.ConsultationId,
            IsConsultationCompleted: IsConsultationCompleted ?? false,
          },
        });

        return result;
      });

      console.log('✅ New consultation created successfully');
    }

    // Optional: send case sheet email
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
              filename: `CaseSheet_${patientName}.pdf`,
              content: pdfBuffer,
              contentType: 'application/pdf',
            },
          ],
        );
      }
    }

    return consultationResult;
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
        ConsultationProcedure: true,
        ConsultationTreatment: true,
        ConsultationFollowUpPlan: true,
        appointment: {
          include: {
            patient: {
              include: {
                allergies: true,
                medicalHistory: true,
                languages: true,
                TagPatient: true,
              },
            },
            doctor: {
              include: {
                Specialization: true,
              },
            },
            Vitals: true,
            visitType: true,
            hospital: true,
          },
        },
      },
    });
  }

  //create cheif complaint
  async addOrUpdateChiefComplaint(dto: CreateChiefComplaintDto) {
    const { ChiefComplaintTagId, ChiefComplainTagName, specializationId } = dto;

    const data = {
      ChiefComplainTagName: ChiefComplainTagName?.trim() ?? '',
      specialization: { connect: { SpecializationId: specializationId } },
    };

    if (ChiefComplaintTagId) {
      return this.prisma.chiefComplaintTag.update({
        where: { ChiefComplaintTagId },
        data,
      });
    }

    return this.prisma.chiefComplaintTag.create({ data });
  }

  async getAllChiefComplaint() {
    return this.prisma.chiefComplaintTag.findMany({
      orderBy: {
        ChiefComplainTagName: 'asc',
      },
      include: {
        specialization: true,
      },
    });
  }

  // Create diagnosis
  async addOrUpdateDiagnosis(dto: CreateDiagnosisDto) {
    const { DiagnosisId, DiagnosisName, icdCode, specializationId } = dto;

    const data = {
      DiagnosisName: DiagnosisName?.trim() ?? '',
      icdCode: icdCode?.trim() || null,
      ...(specializationId && {
        specialization: { connect: { SpecializationId: specializationId } },
      }),
    };

    if (DiagnosisId) {
      // 🔁 Update flow
      return this.prisma.diagnosis.update({
        where: { DiagnosisId },
        data,
      });
    }

    // 🆕 Create flow
    return this.prisma.diagnosis.create({ data });
  }

  // Get all diagnoses
  async getAllDiagnosis() {
    return this.prisma.diagnosis.findMany({
      orderBy: {
        DiagnosisName: 'asc',
      },
      include: {
        specialization: true,
      },
    });
  }

  // Create or find investigation subtype
  async addOrUpdateSubtype(dto: CreateInvestigationSubTypeDto, userId: number) {
    const trimmedName = (dto.InvestigationSubTypename ?? '').trim();

    if (dto.InvestigationSubTypeId) {
      // 🟡 Update flow
      return this.prisma.investigationSubType.update({
        where: { InvestigationSubTypeId: dto.InvestigationSubTypeId },
        data: {
          InvestigationTypeId: dto.InvestigationTypeId,
          InvestigationSubTypename: trimmedName,
        },
      });
    }

    // 🟢 Create flow with check for duplicates
    const existing = await this.prisma.investigationSubType.findFirst({
      where: {
        InvestigationTypeId: dto.InvestigationTypeId,
        InvestigationSubTypename: trimmedName,
      },
    });

    if (existing) return existing;

    return this.prisma.investigationSubType.create({
      data: {
        InvestigationTypeId: dto.InvestigationTypeId,
        InvestigationSubTypename: trimmedName,
      },
    });
  }

  // Get investigation master data
  async getInvestigationMasterData() {
    const types = await this.prisma.investigationType.findMany({
      include: {
        InvestigationSubtypes: true,
      },
    });

    const colorMap: Record<string, string> = {
      // Laboratory: '#7fcdff',
      // Imaging: '#ffc1ea',
      Others: '#66bf9b',
    };

    const consultationInvestigation = types.map((type) => ({
      InvestigationType: type.InvestigationTypeName,
      InvestigationTypeId: type.InvestigationTypeId,
      options: type.InvestigationSubtypes.map((sub) => ({
        subInveatigationType: sub.InvestigationSubTypename,
        value: sub.InvestigationSubTypename.toLowerCase().replace(/\s+/g, '_'),
        // color: colorMap[type.InvestigationTypeName] || '#ccc',
        color: type.InvestigationTypeColorCode || '#ccc',
        InvestigationSubTypeId: sub.InvestigationSubTypeId,
        IsDeleted: sub.IsDeleted,
      })),
    }));

    const investigationTypeData = types.map((type) => ({
      InvestigationTypeId: type.InvestigationTypeId,
      InvestigationType: type.InvestigationTypeName,
    }));

    return {
      consultationInvestigation,
      investigationTypeData,
    };
  }

  async addOrUpdateMedicine(dto: CreateMedicineDto) {
    const {
      MedicineId,
      MedicineName,
      OnlyMedicineName,
      Strength,
      Units,
      MedicineUnitId,
      ScheduleType,
      MedicineTypeName,
      MedicineType,
      HSNCode,
      Instructions,
      GenericName,
      ScheduleTypeId,
      UserId,
      AvailableStock,
      HospitalId,
      pharmacyPrice,
      CategoryId,
      IsFrequent,
    } = dto;

    const data = {
      MedicineName,
      OnlyMedicineName: OnlyMedicineName ?? '',
      Strength: Strength ?? '',
      Units: Units ?? '',
      MedicineUnitId,
      ScheduleType: ScheduleType ?? '',
      MedicineTypeName: MedicineTypeName ?? '',
      MedicineType,
      HSNCode: HSNCode ?? '',
      Instructions: Instructions ?? '',
      GenericName: GenericName ?? '',
      ScheduleTypeId,
      UserId,
      AvailableStock: AvailableStock ?? 0,
      HospitalId,
      pharmacyPrice: pharmacyPrice ?? 0,
      CategoryId,
      IsFrequent: IsFrequent ?? 'N',
    };

    if (MedicineId) {
      // 🔁 Update existing medicine
      return this.prisma.medicine.update({
        where: { MedicineId },
        data,
      });
    }

    // 🆕 Create new medicine
    return this.prisma.medicine.create({ data });
  }

  // Get all medicines
  async getAllMedicine() {
    return this.prisma.medicine.findMany({
      orderBy: {
        MedicineName: 'asc',
      },
      include: {
        ConsultationMedication: true,
      },
    });
  }

  async addOrUpdateProcedure(dto: ConsultationProcedureDto, createdBy: number) {
    if (dto.ProcedureId) {
      // 🔁 Update flow
      return this.prisma.procedure.update({
        where: { ProcedureId: dto.ProcedureId },
        data: {
          ProcedureName: dto.ProcedureName,
          ProcedureCode: dto.ProcedureCode,
          specializationId: dto.specializationId,
          createdBy: createdBy,
        },
      });
    } else {
      // ➕ Create flow
      return this.prisma.procedure.create({
        data: {
          ProcedureName: dto.ProcedureName,
          ProcedureCode: dto.ProcedureCode,
          specializationId: dto.specializationId,
          createdBy,
        },
      });
    }
  }

  async getAllConsultationProcedures() {
    return this.prisma.procedure.findMany({
      orderBy: {
        ProcedureId: 'asc',
      },
      include: {
        specialization: true,
      },
    });
  }

  async getInvestigationType() {
    return this.prisma.investigationType.findMany({
      orderBy: {
        InvestigationTypeId: 'asc',
      },
    });
  }

  async getPatientAppointment(patientId: number) {
    return this.prisma.appointment.findMany({
      where: {
        PatientId: patientId,
      },
      orderBy: {
        appointmentDate: 'desc',
      },
      include: {
        doctor: {
          select: {
            UserId: true,
            firstName: true,
            lastName: true,
            Specialization: true,
          },
        },
        assignedProvider: {
          select: {
            UserId: true,
            firstName: true,
            lastName: true,
          },
        },
        specialization: {
          select: {
            SpecializationName: true,
          },
        },
        visitType: true,
        hospital: true,
        PaymentType: true,
        consultation: true,
        Vitals: true,
      },
    });
  }

  async addupdatemedicalhistory(
    medicalhistory: string,
    MedicalhistoryId?: number,
  ) {
    if (MedicalhistoryId) {
      return this.prisma.medicalHistory.update({
        where: { MedicalHistoryId: MedicalhistoryId },
        data: { MedicalHistoryName: medicalhistory },
      });
    }

    return this.prisma.medicalHistory.create({
      data: { MedicalHistoryName: medicalhistory },
    });
  }

  async getmedicalhistory() {
    return this.prisma.medicalHistory.findMany({
      orderBy: {
        MedicalHistoryId: 'asc',
      },
    });
  }
  //Delete end point
  async deleteMedicine(medicineId: number) {
    // Check if medicine exists before deleting
    const existing = await this.prisma.medicine.findUnique({
      where: { MedicineId: medicineId },
    });

    if (!existing) {
      throw new Error(`Medicine with ID ${medicineId} not found`);
    }

    return this.prisma.medicine.update({
      where: { MedicineId: medicineId },
      data: { IsDeleted: true },
    });
  }

  //Delete cheif complaint
  async deleteChiefComplaint(ChiefComplaintTagId: number) {
    const existing = await this.prisma.chiefComplaintTag.findUnique({
      where: { ChiefComplaintTagId: ChiefComplaintTagId },
    });

    if (!existing) {
      throw new Error(`Medicine with ID ${ChiefComplaintTagId} not found`);
    }

    return this.prisma.chiefComplaintTag.update({
      where: { ChiefComplaintTagId: ChiefComplaintTagId },
      data: { IsDeleted: true },
    });
  }

  async deleteInvestigation(InvestigationsubTypeId: number) {
    const existing = await this.prisma.investigationSubType.findUnique({
      where: { InvestigationSubTypeId: InvestigationsubTypeId },
    });

    if (!existing) {
      throw new Error(
        `InvestigationsubType with ID ${InvestigationsubTypeId} not found`,
      );
    }

    return this.prisma.investigationSubType.update({
      where: { InvestigationSubTypeId: InvestigationsubTypeId },
      data: { IsDeleted: true },
    });
  }

  async deleteDiagonasis(DiagnosisId: number) {
    const existing = await this.prisma.diagnosis.findUnique({
      where: { DiagnosisId: DiagnosisId },
    });

    if (!existing) {
      throw new Error(`Medicine with ID ${DiagnosisId} not found`);
    }

    return this.prisma.diagnosis.update({
      where: { DiagnosisId: DiagnosisId },
      data: { IsDeleted: true },
    });
  }

  async deleteProcedure(ProcedureId: number) {
    const existing = await this.prisma.procedure.findUnique({
      where: { ProcedureId: ProcedureId },
    });

    if (!existing) {
      throw new Error(`Medicine with ID ${ProcedureId} not found`);
    }

    return this.prisma.procedure.update({
      where: { ProcedureId: ProcedureId },
      data: { IsDeleted: true },
    });
  }

  async deleteMedicalHistory(MedicalHistoryId: number) {
    const existing = await this.prisma.medicalHistory.findUnique({
      where: { MedicalHistoryId: MedicalHistoryId },
    });

    if (!existing) {
      throw new Error(`Medicine with ID ${MedicalHistoryId} not found`);
    }

    return this.prisma.medicalHistory.update({
      where: { MedicalHistoryId: MedicalHistoryId },
      data: { IsDeleted: true },
    });
  }
  //Get all diagnosis by specialization ID

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
  async getPatientMedications(patientId: number) {
    const consultations = await this.prisma.consultation.findMany({
      where: {
        appointment: {
          PatientId: patientId,
        },
      },
      include: {
        ConsultationMedication: true,
      },
      orderBy: {
        consultationDatTime: 'desc', // latest first
      },
    });

    if (consultations.length === 0) {
      return { current: [], past: [], history: [] };
    }

    const history = consultations.map((c) => ({
      consultationId: c.ConsultationId,
      date: c.consultationDatTime,
      medications: c.ConsultationMedication.map((m) => ({
        id: m.ConsultationMedicationId,
        name: m.medicationName,
        dosage: m.dosage,
        frequency: m.frequency,
        instructions: m.remarks,
      })),
    }));

    // ✅ Latest consultation meds = current
    const current = history[0]?.medications;

    // ✅ All older consultation meds = past
    const past = history.slice(1).flatMap((h) => h.medications);

    return { current, past, history };
  }
}
