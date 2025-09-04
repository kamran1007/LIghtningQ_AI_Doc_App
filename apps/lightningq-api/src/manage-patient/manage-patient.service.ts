import { Injectable } from '@nestjs/common';
import { UpsertPatientDto } from './dto/upsert-patient.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuickAppointmentDto } from 'src/appointment/dto/create-appointment.dto';

@Injectable()
export class ManagePatientService {
  constructor(private readonly prisma: PrismaService) {}

  private parseArray(value: any): string[] | undefined {
    if (typeof value === 'string' && value.trim() !== '') {
      try {
        return JSON.parse(value);
      } catch (e) {
        console.warn('Invalid JSON array:', value);
        return undefined;
      }
    } else if (Array.isArray(value)) {
      return value;
    }
    return undefined;
  }

  async upsertPatient(
    dto: UpsertPatientDto,
    patientImageUrl: string | undefined,
    CreatedBy: number,
  ) {
    const {
      allergies,
      languages,
      MedicalHistory,
      PatientId,
      hospitalCode,
      HospitalId,
      organizationId,
      ...restData
    }: UpsertPatientDto = dto;

    if (!dto.Prefix) throw new Error('Prefix is required');
    if (!hospitalCode) throw new Error('Hospital code is required');

    if (!PatientId) {
      const existingPatient = await this.prisma.patient.findFirst({
        where: {
          OR: [
            { email: dto.email ?? undefined },
            { mobile: dto?.mobile ?? undefined },
          ],
        },
      });

      if (existingPatient) {
        return {
          success: false,
          message:
            '❌ Patient already exists with the same email or mobile number',
          patientId: existingPatient.PatientId,
        };
      }
    }

    const parsedAllergies = this.parseArray(allergies);
    const parsedLanguages = this.parseArray(languages);
    const parsedMedicalHistory = this.parseArray(MedicalHistory);

    const connectAllergies = parsedAllergies?.map((id) => ({
      AllergyId: Number(id),
    }));
    const connectLanguages = parsedLanguages?.map((id) => ({
      LanguageId: Number(id),
    }));
    const connectHistory = parsedMedicalHistory?.map((id) => ({
      MedicalHistoryId: Number(id),
    }));

    let patient;

    if (PatientId) {
      // ✅ UPDATE
      patient = await this.prisma.patient.update({
        where: { PatientId: Number(PatientId) },
        data: {
          ...restData,
          Prefix: dto.Prefix,
          HospitalId: Number(HospitalId),
          OrganizationId: Number(organizationId),
          profileImageUrl: patientImageUrl ?? dto.profileImageUrl, // ✅ FIX
          UpdatedBy: String(CreatedBy),
          updatedAt: new Date(),
          allergies: connectAllergies ? { set: connectAllergies } : undefined,
          languages: connectLanguages ? { set: connectLanguages } : undefined,
          medicalHistory: connectHistory ? { set: connectHistory } : undefined,
        },
      });
    } else {
      // Get all patients of this hospital (only MRN field for efficiency)
      // Get all MRNs for this hospital
      const patients = await this.prisma.patient.findMany({
        where: { HospitalId: Number(HospitalId) },
        select: { Patient_Medical_Record_No: true },
      });

      let lastNumber = 0;

      for (const p of patients) {
        if (!p.Patient_Medical_Record_No) continue;

        const numericPart = p.Patient_Medical_Record_No.slice(
          hospitalCode.length,
        );

        // ✅ accept only exactly 7 digits starting with 0
        if (!/^0\d{6}$/.test(numericPart)) {
          continue; // skip MXJ1000003 type records
        }

        const parsed = parseInt(numericPart, 10);
        if (parsed > lastNumber) {
          lastNumber = parsed;
        }
      }

      const nextNumber = lastNumber + 1;
      const paddedNumber = String(nextNumber).padStart(7, '0');
      const generatedMRN = `${hospitalCode}${paddedNumber}`;

      console.log('Generated MRN:', generatedMRN);

      const { profileImageUrl: _, ...cleanedRestData } = restData;

      patient = await this.prisma.patient.create({
        data: {
          ...cleanedRestData,
          Prefix: dto.Prefix,
          HospitalId: Number(HospitalId),
          OrganizationId: Number(organizationId),
          profileImageUrl: patientImageUrl ?? dto.profileImageUrl, // ✅ FIX
          Patient_Medical_Record_No: generatedMRN,
          CreatedBy: String(CreatedBy),
          createdAt: new Date(),
          updatedAt: new Date(),
          allergies: connectAllergies?.length
            ? { connect: connectAllergies }
            : undefined,
          languages: connectLanguages?.length
            ? { connect: connectLanguages }
            : undefined,
          medicalHistory: connectHistory?.length
            ? { connect: connectHistory }
            : undefined,
        },
      });
    }

    return patient;
  }

  //Get patient
  async getPatients(filters: {
    organizationId: number;
    hospitalId: number;
    search?: string;
    city?: string;
    gender?: string;
    tagPatientId?: number;
    minAge?: number;
    maxAge?: number;
    page?: number;
    limit?: number;
  }) {
    const {
      organizationId,
      hospitalId,
      search,
      city,
      gender,
      tagPatientId,
      minAge,
      maxAge,
      page = 1,
      limit = 10,
    } = filters;

    const where: any = {
      HospitalId: hospitalId,
      OrganizationId: organizationId,
    };

    // 🔍 Search logic (MRN, Mobile, or full name)
    if (search) {
      where.OR = [
        {
          Patient_Medical_Record_No: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          mobile: {
            contains: search,
          },
        },
        {
          OR: [
            {
              firstName: { contains: search, mode: 'insensitive' },
            },
            {
              lastName: { contains: search, mode: 'insensitive' },
            },
            {
              // Full name match (e.g., "John Doe")
              AND: [
                {
                  firstName: {
                    contains: search.split(' ')[0],
                    mode: 'insensitive',
                  },
                },
                {
                  lastName: {
                    contains: search.split(' ')[1] ?? '',
                    mode: 'insensitive',
                  },
                },
              ],
            },
          ],
        },
      ];
    }

    // 🎯 Filter by city, gender, DOB range
    if (city) where.city = city;
    if (gender) where.gender = gender;

    // Age filter
    if (minAge || maxAge) {
      const today = new Date();

      const dobFrom = maxAge
        ? new Date(
            today.getFullYear() - maxAge,
            today.getMonth(),
            today.getDate(),
          )
        : undefined;

      const dobTo = minAge
        ? new Date(
            today.getFullYear() - minAge,
            today.getMonth(),
            today.getDate(),
          )
        : undefined;

      where.dateOfBirth = {};
      if (dobFrom) where.dateOfBirth.gte = dobFrom;
      if (dobTo) where.dateOfBirth.lte = dobTo;
    }

    // 🏷️ TagPatient relation filter
    if (tagPatientId) {
      where.TagPatient = {
        some: {
          TagPatientId: Number(tagPatientId),
        },
      };
    }

    // 🔄 Get total count for frontend pagination support
    const total = await this.prisma.patient.count({ where });

    const patients = await this.prisma.patient.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        TagPatient: true, // include if you want to return tag info
        allergies: true,
        languages: true,
        medicalHistory: true,
        Appointment: {
          orderBy: {
            appointmentDate: 'asc',
          },
        },
      },
    });

    return {
      total,
      page,
      limit,
      data: patients,
    };
  }

  //Autosave patient
  async autosavePatient(
    dto: UpsertPatientDto,
    CreatedBy: number,
  ): Promise<{ PatientId: number }> {
    const {
      allergies,
      languages,
      MedicalHistory,
      PatientId,
      hospitalCode,
      HospitalId,
      organizationId,
      ...restData
    } = dto;

    if (!dto.Prefix) throw new Error('Prefix is required');
    if (!hospitalCode) throw new Error('Hospital code is required');

    const parsedAllergies = this.parseArray(allergies);
    const parsedLanguages = this.parseArray(languages);
    const parsedMedicalHistory = this.parseArray(MedicalHistory);

    const connectAllergies = parsedAllergies?.map((id) => ({
      AllergyId: Number(id),
    }));
    const connectLanguages = parsedLanguages?.map((id) => ({
      LanguageId: Number(id),
    }));
    const connectHistory = parsedMedicalHistory?.map((id) => ({
      MedicalHistoryId: Number(id),
    }));

    let patient;

    if (!PatientId) {
      // 👉 CREATE DRAFT patient (no MRN)
      patient = await this.prisma.patient.create({
        data: {
          ...restData,
          Prefix: dto.Prefix,
          HospitalId: Number(HospitalId),
          OrganizationId: Number(organizationId),
          Patient_Medical_Record_No: null, // Set to empty string for draft
          CreatedBy: String(CreatedBy),
          createdAt: new Date(),
          updatedAt: new Date(),
          isDraft: true,
          allergies: connectAllergies?.length
            ? { connect: connectAllergies }
            : undefined,
          languages: connectLanguages?.length
            ? { connect: connectLanguages }
            : undefined,
          medicalHistory: connectHistory?.length
            ? { connect: connectHistory }
            : undefined,
        },
      });
    } else {
      // 👉 UPDATE existing draft
      patient = await this.prisma.patient.update({
        where: { PatientId: Number(PatientId) },
        data: {
          ...restData,
          Prefix: dto.Prefix,
          UpdatedBy: String(CreatedBy),
          updatedAt: new Date(),
          isDraft: true,
          allergies: connectAllergies ? { set: connectAllergies } : undefined,
          languages: connectLanguages ? { set: connectLanguages } : undefined,
          medicalHistory: connectHistory ? { set: connectHistory } : undefined,
        },
      });
    }

    return { PatientId: patient.PatientId };
  }

  //draft data
  async getDraftPatients(hospitalId: number) {
    return this.prisma.patient.findMany({
      where: {
        HospitalId: Number(hospitalId),
        isDraft: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  //
  async getAllpatientTags() {
    return this.prisma.tagPatient.findMany({
      orderBy: { TagPatientName: 'asc' },
    });
  }

  async getAllAllergies() {
    return this.prisma.allergy.findMany({
      orderBy: { AllergyName: 'asc' },
    });
  }

  async getAllLanguages() {
    return this.prisma.language.findMany({
      orderBy: { LanguageName: 'asc' },
    });
  }

  async getAllpastMedicalHistory() {
    return this.prisma.medicalHistory.findMany({
      orderBy: { MedicalHistoryName: 'asc' },
    });
  }
  //specialization
  async getAllSpecialization() {
    return this.prisma.specialization.findMany({
      orderBy: { SpecializationId: 'asc' },
    });
  }

  //getAlldoctor
  async getAlldoctoRole() {
    return this.prisma.user.findMany({
      where: {
        roleId: { in: [2, 3] },
        isActive: true,
      },
      include: {
        role: true, // include if you want to return tag info
        Specialization: true,
        DoctorTimeSlot: true,
        DoctorCosting: true,
        DoctorSlot: true,
      },
      orderBy: { UserId: 'asc' },
    });
  }

  async getAllPaymentMode() {
    return this.prisma.paymentType.findMany({
      orderBy: { PaymentTypeName: 'asc' },
    });
  }

  async getAllVisitType() {
    return this.prisma.appointmentType.findMany({
      orderBy: { AppointmentTypeId: 'asc' },
    });
  }

  async getAllTagType() {
    return this.prisma.tagPatient.findMany({
      orderBy: { TagPatientId: 'asc' },
    });
  }
}
