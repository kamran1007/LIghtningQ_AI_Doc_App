import {
  ForbiddenException,
  HttpCode,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateHospitalDto } from './dto/create_hospital.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateHospitalDto } from './dto/update_hospital.dto';
import { CreateUserDto, UserBranchDto } from './dto/create_user.dto';
import { Title } from 'generated/prisma';
import { hash } from 'argon2';
import { contains } from 'class-validator';
import { CreateDoctorSlotDto } from './dto/create-doctor-slot.dto';
import { CancelSlotDto } from './dto/CancelSlotDto';
import { UpdateDoctorSlotDto } from './dto/update-doctor-slot.dto';
import { BulkUpdateDoctorSlotDto } from './dto/BulkUpdateDoctorSlotDto';
import { CreateDoctorCostingDto } from './dto/create-doctor-costing.dto';
import { AddUpdateTimeSlotDto } from './dto/AddUpdateTimeSlot.dto';
import { AddUpdateAccessRightDto } from './dto/AddUpdateAccessRight.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ManageHospitalService {
  constructor(private readonly prisma: PrismaService) {}

  async CreateHospital(dto: CreateHospitalDto, userId: number) {
    const organization = await this.prisma.organization.findUnique({
      where: { OrganizationId: dto.organizationId },
    });

    if (!organization) {
      throw new Error('Organization not found');
    }

    // Auto-generate hospitalCode if not provided
    if (!dto.HospitalCode || dto.HospitalCode.trim() === '') {
      dto.HospitalCode = await generateHospitalCode(
        dto.HospitalName,
        this.prisma,
      );
    }

    // Ensure uniqueness again (extra safety)
    const hospitalWithSameCode = await this.prisma.hospital.findUnique({
      where: { HospitalCode: dto.HospitalCode },
    });
    if (hospitalWithSameCode) {
      throw new Error('Hospital code must be unique');
    }

    const hospital = await this.prisma.hospital.create({
      data: {
        HospitalName: dto.HospitalName,
        HospitalCode: dto.HospitalCode,
        ParentHospitalCode: dto.ParentHospitalCode ?? '',
        Organizationcode: organization.Organizationcode,
        SpecializationType: dto.SpecializationType,
        address: dto.address,
        city: dto.city,
        state: dto.state,
        country: dto.country,
        postalCode: dto.postalCode,
        contactNumber: dto.contactNumber,
        email: dto.email,
        website: dto.website ?? '',
        logoUrl: dto.logoUrl ?? '',
        latitude: dto.latitude,
        longitude: dto.longitude,
        level: dto.level,
        status: dto.status ?? 'ACTIVE',
        isActive: dto.isActive ?? true,
        parentHospitalId: dto.parentHospitalId,
        organizationId: dto.organizationId,
        createdById: userId,
        updatedById: userId,
        deletedById: dto.deletedById,
      },
    });

    return hospital;
  }

  async getAllhospital(page: number, organizationId: number) {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const [hospitals, total] = await this.prisma.$transaction([
      this.prisma.hospital.findMany({
        where: {
          deletedAt: null,
          organizationId: organizationId, // ✅ Restrict to user's org
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      this.prisma.hospital.count({
        where: {
          deletedAt: null,
          organizationId: organizationId, // ✅ Restrict to user's org
        },
      }),
    ]);

    return {
      data: hospitals,
      pagination: {
        currentPage: page,
        pageSize,
        totalRecords: total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async UpdateHospital(id: number, dto: UpdateHospitalDto, userId: any) {
    const hospital = await this.prisma.hospital.findUnique({
      where: { HospitalId: id },
    });

    if (!hospital) {
      throw new NotFoundException(`Hospital with ID ${id} not found`);
    }

    const updatedHospital = await this.prisma.hospital.update({
      where: { HospitalId: id },
      data: {
        ...dto,
        updatedById: userId,
        updatedAt: new Date(),
      },
    });

    return {
      message: 'Hospital updated successfully',
      HttpCode: 200,
      data: updatedHospital,
    };
  }

  async getOrganization(organizationId: number) {
    const [hospitals] = await this.prisma.$transaction([
      this.prisma.organization.findMany({
        where: {
          OrganizationId: organizationId, // ✅ Restrict to user's org
        },
      }),
    ]);

    return {
      data: hospitals,
    };
  }

  //Add user to the organization and adding user
  async createUserWithHospitals(
    dto: CreateUserDto,
    files: { profileImagePath?: string; signaturePath?: string },
    createdById: number,
  ) {
    // 0. Check for mobile/email duplicates
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ mobile: dto.mobile }, { email: dto.email }],
      },
    });

    if (existingUser) {
      throw new Error(`User with this mobile or email already exists.`);
    }
    // 1. ✅ Create the user
    if (!dto.passwordHash) {
      throw new Error('Password is required');
    }
    console.log('Uploaded files:', files);

    const hashedPassword = await hash(dto.passwordHash); //password hash
    const user = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        mobile: dto.mobile,
        organizationId: dto.organizationId,
        imageUrl: files.profileImagePath ?? '',
        SignatureOfUser: files.signaturePath ?? '',
        createdById,
        passwordHash: hashedPassword, // Placeholder — make sure to hash properly
        dateOfBirth: new Date(dto.dateOfBirth),
        roleId: dto.roleId,
        SpecializationId: dto.SpecializationId ?? 0,
        gender: dto.gender,
        Prefix: dto.Prefix as any as Title,
        Experience: dto.Experience ?? '', // ✅ fallback to empty string
        Employee_ID: dto.Employee_ID || null, // ✅ fallback to empty string
        refreshToken: '',
      },
      include: {
        AdminAccess: {
          include: {
            hospital: true,
            role: true,
          },
        },
      },
    });

    // 2. ✅ Validate and assign hospitals

    if (dto.UserBranchesArray && dto.UserBranchesArray.length > 0) {
      console.log('UserBranchesArray from DTO:', dto.UserBranchesArray);

      const hospitalAccessData = dto.UserBranchesArray.map((branch) => ({
        UserId: user.UserId,
        hospitalId: branch.HospitalId,
        roleId: branch.RoleId,
        // ActiveInd: branch.ActiveInd,
        // DeleteInd: branch.DeleteInd,
        createdById,
      }));
      console.log('Mapped hospitalAccessData:', hospitalAccessData);

      if (hospitalAccessData.length > 0) {
        await this.prisma.userHospitalAccess.createMany({
          data: hospitalAccessData,
        });
      }
    }

    // if (dto.HospitalIds && dto.HospitalIds.length > 0) {
    //   // 🔍 Validate hospitals belong to the same organization
    //   const hospitals = await this.prisma.hospital.findMany({
    //     where: {
    //       HospitalId: { in: dto.HospitalIds },
    //       organizationId: dto.organizationId,
    //     },
    //   });

    //   if (hospitals.length !== dto.HospitalIds.length) {
    //     throw new Error(
    //       'One or more hospitals do not belong to the specified organization.',
    //     );
    //   }

    //   // 3. ✅ Assign hospital access with role
    //   await this.prisma.userHospitalAccess.createMany({
    //     data: dto.HospitalIds.map((hospitalId) => ({
    //       UserId: user.UserId,
    //       hospitalId: hospitalId,
    //       roleId: dto.roleId,
    //     })),
    //   });
    // }
    // ✅ Fetch updated user with AdminAccess
    const updatedUser = await this.prisma.user.findUnique({
      where: { UserId: user.UserId },
      include: {
        AdminAccess: {
          include: {
            hospital: true,
            role: true,
          },
        },
      },
    });

    return {
      updatedUser,
      message: 'User Created successfully',
      HttpCode: 200,
    };
  }

  //UPDATE
  async updateUserWithHospitals(userId: number, dto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { UserId: userId },
    });
    if (!user) throw new Error('User not found');

    // 👇 Check if Employee_ID is already taken by another user
    if (dto.Employee_ID) {
      const existingEmployee = await this.prisma.user.findFirst({
        where: {
          Employee_ID: dto.Employee_ID,
          NOT: { UserId: userId }, // exclude current user
        },
      });

      if (existingEmployee) {
        return {
          message: 'Employee Id Already Been Assigned',
          HttpCode: 400,
        };
      }
    }

    await this.prisma.user.update({
      where: { UserId: userId },
      data: {
        Prefix: dto.Prefix as Title,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        mobile: dto.mobile,
        dateOfBirth: new Date(dto.dateOfBirth),
        gender: dto.gender,
        organizationId: dto.organizationId,
        SpecializationId: dto.SpecializationId ?? undefined,
        roleId: dto.roleId,
        imageUrl: dto.imageUrl || undefined,
        SignatureOfUser: dto.SignatureOfUser || undefined,
        Experience: dto.Experience ?? '',
        Employee_ID: dto.Employee_ID ?? '',
        updatedById: dto.updatedById,
      },
    });

    await this.prisma.userHospitalAccess.deleteMany({
      where: { UserId: userId },
    });

    const hospitalAccessMap = new Map<string, any>();
    dto.UserBranchesArray.forEach((branch) => {
      const key = `${userId}-${branch.HospitalId}`;
      if (!hospitalAccessMap.has(key)) {
        hospitalAccessMap.set(key, {
          UserId: userId,
          hospitalId: branch.HospitalId,
          roleId: branch.RoleId,
          createdById: dto.updatedById,
        });
      }
    });

    const hospitalAccessData = Array.from(hospitalAccessMap.values());

    if (hospitalAccessData.length > 0) {
      await this.prisma.userHospitalAccess.createMany({
        data: hospitalAccessData,
      });
    }

    return {
      message: 'User updated successfully',
      HttpCode: 200,
      user: await this.prisma.user.findUnique({
        where: { UserId: userId },
        include: {
          AdminAccess: {
            include: {
              hospital: true,
              role: true,
            },
          },
        },
      }),
    };
  }

  //GET
  async getAllUsers({
    page,
    limit,
    search,
    hospitalId,
    roleId,
    organizationId,
  }: {
    page: number;
    limit: number;
    search?: string;
    hospitalId?: number; // ✅ now consistent
    roleId?: number;
    organizationId: number;
  }) {
    const skip = (page - 1) * limit;

    const where: any = {
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { mobile: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(organizationId && { organizationId }),

      // Case 1: filter only by roleId (directly on user)
      ...(roleId && !hospitalId && { roleId }),

      // Case 2: filter by hospitalId + roleId inside AdminAccess
      ...(hospitalId && {
        AdminAccess: {
          some: {
            hospitalId,
            ...(roleId && { roleId }),
          },
        },
      }),
    };

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          role: true,
          AdminAccess: {
            where: hospitalId ? { hospitalId } : undefined,
            include: {
              hospital: true,
              role: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      message: 'Users fetched successfully',
      return: {
        total,
        page,
        limit,
        data: users,
      },
    };
  }

  //Get Role
  async getUserRole(org: number) {
    const [Role] = await this.prisma.$transaction([
      this.prisma.role.findMany(),
    ]);

    return {
      data: Role,
    };
  }
  //get specialization
  async UserSpecialization(org: number) {
    const [Specialization] = await this.prisma.$transaction([
      this.prisma.specialization.findMany(),
    ]);

    return {
      data: Specialization,
    };
  }
  //ACTIVATE/DEACTIVATE
  async deactivateUser(userId: number, deletedById: number) {
    return await this.prisma.user.update({
      where: { UserId: userId },
      data: {
        isActive: false,
        deletedAt: new Date(),
        deletedById,
      },
    });
  }

  async activateUser(userId: number) {
    return await this.prisma.user.update({
      where: { UserId: userId },
      data: {
        isActive: true,
        deletedAt: null,
        deletedById: null,
      },
    });
  }
  //AddUpdate Doctor Slot
  // async addUpdateTimeSlot(dto: AddUpdateTimeSlotDto, userId: number) {
  //   if (!dto.userId || !dto.timeSlots || dto.timeSlots.length === 0) {
  //     throw new Error('userId and timeSlots are required.');
  //   }

  //   const affectedHospitals: number[] = dto.timeSlots
  //     .map((s) => s.hospitalId)
  //     .filter((id): id is number => typeof id === 'number');

  //   // Step 1: Archive
  //   const existingSlots = await this.prisma.doctorTimeSlot.findMany({
  //     where: {
  //       DoctorId: dto.userId,
  //       HospitalId: { in: affectedHospitals },
  //       isDeleted: false,
  //     },
  //   });

  //   if (existingSlots.length > 0) {
  //     const historyData = existingSlots.map((slot) => ({
  //       DoctorTimeSlotId: slot.DoctorTimeSlotId,
  //       userId: slot.DoctorId, // ✅ explicitly mapped
  //       HospitalId: slot.HospitalId,
  //       DayOfWeek: slot.DayOfWeek,
  //       Morning_From: slot.Morning_From,
  //       Morning_To: slot.Morning_To,
  //       Evening_From: slot.Evening_From,
  //       Evening_To: slot.Evening_To,
  //       consult_Time_InMin: slot.consult_Time_InMin,
  //       Accept_Appointment_Selected_Date: slot.Accept_Appointment_Selected_Date,
  //       is_DND: slot.is_DND,
  //       is_SlotCancelled: slot.is_SlotCancelled,
  //       isPermanentCancelled: slot.isPermanentCancelled,
  //       DNDremarks: slot.DNDremarks,
  //       Slot_cancellation_remarks: slot.Slot_cancellation_remarks,
  //       isDeleted: slot.isDeleted,
  //       isAvailable: slot.isAvailable,
  //       isBooked: slot.isBooked,
  //       isConfirmed: slot.isConfirmed,
  //       isRejected: slot.isRejected,
  //       createdAt: slot.createdAt,
  //       updatedAt: slot.updatedAt,
  //       changedBy: userId,
  //       changedAt: new Date(),
  //       isSlotChanged: slot.isSlotChanged,
  //       isActive: slot.isActive,
  //       createdBy: slot.createdBy,
  //     }));

  //     await this.prisma.doctorTimeSlotHistory.createMany({
  //       data: historyData,
  //     });
  //   }

  //   // Step 2: Delete old
  //   await this.prisma.doctorTimeSlot.deleteMany({
  //     where: {
  //       DoctorId: dto.userId,
  //       HospitalId: { in: affectedHospitals },
  //       isDeleted: false,
  //     },
  //   });

  //   // Step 3: Insert new
  //   const now = new Date();
  //   const newSlotData = dto.timeSlots.map((slot) => ({
  //     DoctorId: dto.userId!,
  //     HospitalId: slot.hospitalId!,
  //     DayOfWeek: slot.DayOfWeek!,
  //     Morning_From: slot.Morning_From ?? null,
  //     Morning_To: slot.Morning_To ?? null,
  //     Evening_From: slot.Evening_From ?? null,
  //     Evening_To: slot.Evening_To ?? null,
  //     consult_Time_InMin: slot.consult_Time_InMin ?? 15,
  //     Accept_Appointment_Selected_Date:
  //       dto.Accept_Appointment_Selected_Date ?? true,
  //     DNDremarks: slot.DNDremarks ?? null,
  //     Slot_cancellation_remarks: slot.Slot_cancellation_remarks ?? null,
  //     is_DND: slot.is_DND ?? false,
  //     is_SlotCancelled: slot.is_SlotCancelled ?? false,
  //     isPermanentCancelled: slot.isPermanentCancelled ?? false,
  //     isDeleted: slot.isDeleted ?? false,
  //     isSlotChanged: slot.isSlotChanged ?? false,
  //     isActive: true,
  //     isAvailable: true,
  //     isBooked: false,
  //     isConfirmed: false,
  //     isRejected: false,
  //     createdBy: userId,
  //     createdAt: now,
  //     updatedAt: now,
  //   }));

  //   const inserted = await this.prisma.doctorTimeSlot.createMany({
  //     data: newSlotData,
  //   });

  //   return {
  //     message: 'Time slots replaced with history logging.',
  //     count: inserted.count,
  //     HttpCode: 201,
  //   };
  // }
  async addUpdateTimeSlot(dto: AddUpdateTimeSlotDto, userId: number) {
    if (!dto.userId || !dto.timeSlots || dto.timeSlots.length === 0) {
      throw new Error('userId and timeSlots are required.');
    }

    const affectedHospitals: number[] = dto.timeSlots
      .map((s) => s.hospitalId)
      .filter((id): id is number => typeof id === 'number');

    // Step 1: Fetch existing slots
    const existingSlots = await this.prisma.doctorTimeSlot.findMany({
      where: {
        DoctorId: dto.userId,
        HospitalId: { in: affectedHospitals },
        isDeleted: false,
      },
    });

    // Step 2: Archive existing before change
    if (existingSlots.length > 0) {
      const historyData = existingSlots.map((slot) => ({
        DoctorTimeSlotId: slot.DoctorTimeSlotId,
        userId: slot.DoctorId,
        HospitalId: slot.HospitalId,
        DayOfWeek: slot.DayOfWeek,
        Morning_From: slot.Morning_From,
        Morning_To: slot.Morning_To,
        Evening_From: slot.Evening_From,
        Evening_To: slot.Evening_To,
        consult_Time_InMin: slot.consult_Time_InMin,
        Accept_Appointment_Selected_Date: slot.Accept_Appointment_Selected_Date,
        is_DND: slot.is_DND,
        is_SlotCancelled: slot.is_SlotCancelled,
        isPermanentCancelled: slot.isPermanentCancelled,
        DNDremarks: slot.DNDremarks,
        Slot_cancellation_remarks: slot.Slot_cancellation_remarks,
        isDeleted: slot.isDeleted,
        isAvailable: slot.isAvailable,
        isBooked: slot.isBooked,
        isConfirmed: slot.isConfirmed,
        isRejected: slot.isRejected,
        createdAt: slot.createdAt,
        updatedAt: slot.updatedAt,
        changedBy: userId,
        changedAt: new Date(),
        isSlotChanged: slot.isSlotChanged,
        isActive: slot.isActive,
        createdBy: slot.createdBy,
      }));

      await this.prisma.doctorTimeSlotHistory.createMany({ data: historyData });
    }

    const now = new Date();
    const results: { updated: number; inserted: number; cancelled: number } = {
      updated: 0,
      inserted: 0,
      cancelled: 0,
    };

    // Step 3: Process incoming slots
    for (const slot of dto.timeSlots) {
      const existing = existingSlots.find(
        (s) =>
          s.HospitalId === slot.hospitalId &&
          s.DayOfWeek === slot.DayOfWeek &&
          !s.isDeleted,
      );

      if (existing) {
        // Update existing slot
        await this.prisma.doctorTimeSlot.update({
          where: { DoctorTimeSlotId: existing.DoctorTimeSlotId },
          data: {
            Morning_From: slot.Morning_From ?? null,
            Morning_To: slot.Morning_To ?? null,
            Evening_From: slot.Evening_From ?? null,
            Evening_To: slot.Evening_To ?? null,
            consult_Time_InMin: slot.consult_Time_InMin ?? 15,
            Accept_Appointment_Selected_Date:
              dto.Accept_Appointment_Selected_Date ?? true,
            DNDremarks: slot.DNDremarks ?? null,
            Slot_cancellation_remarks: slot.Slot_cancellation_remarks ?? null,
            is_DND:
              typeof slot.is_DND === 'boolean' ? slot.is_DND : existing.is_DND,
            is_SlotCancelled:
              typeof slot.is_SlotCancelled === 'boolean'
                ? slot.is_SlotCancelled
                : existing.is_SlotCancelled,
            isPermanentCancelled:
              typeof slot.isPermanentCancelled === 'boolean'
                ? slot.isPermanentCancelled
                : existing.isPermanentCancelled,
            isSlotChanged:
              typeof slot.isSlotChanged === 'boolean'
                ? slot.isSlotChanged
                : existing.isSlotChanged,
            updatedAt: now,
          },
        });
        results.updated++;
      } else {
        // Insert new slot
        await this.prisma.doctorTimeSlot.create({
          data: {
            DoctorId: dto.userId!,
            HospitalId: slot.hospitalId!,
            DayOfWeek: slot.DayOfWeek!,
            Morning_From: slot.Morning_From ?? null,
            Morning_To: slot.Morning_To ?? null,
            Evening_From: slot.Evening_From ?? null,
            Evening_To: slot.Evening_To ?? null,
            consult_Time_InMin: slot.consult_Time_InMin ?? 15,
            Accept_Appointment_Selected_Date:
              dto.Accept_Appointment_Selected_Date ?? true,
            DNDremarks: slot.DNDremarks ?? null,
            Slot_cancellation_remarks: slot.Slot_cancellation_remarks ?? null,
            is_DND: slot.is_DND ?? false,
            is_SlotCancelled: slot.is_SlotCancelled ?? false,
            isPermanentCancelled: slot.isPermanentCancelled ?? false,
            isDeleted: false,
            isSlotChanged: slot.isSlotChanged ?? false,
            isActive: true,
            isAvailable: true,
            isBooked: false,
            isConfirmed: false,
            isRejected: false,
            createdBy: userId,
            createdAt: now,
            updatedAt: now,
          },
        });
        results.inserted++;
      }
    }

    // Step 4: Mark removed slots as cancelled (soft delete / slot cancelled)
    const incomingKeys = dto.timeSlots
      .filter((s) => !s.isDeleted)
      .map((s) => `${s.hospitalId}_${s.DayOfWeek}`);

    const removed = existingSlots.filter(
      (s) => !incomingKeys.includes(`${s.HospitalId}_${s.DayOfWeek}`),
    );

    // if (removed.length > 0) {
    //   await this.prisma.doctorTimeSlot.updateMany({
    //     where: {
    //       DoctorTimeSlotId: { in: removed.map((r) => r.DoctorTimeSlotId) },
    //     },
    //     data: {
    //       is_SlotCancelled: true,
    //       Slot_cancellation_remarks: 'Cancelled by system update',
    //       updatedAt: now,
    //     },
    //   });
    //   results.cancelled = removed.length;
    // }

    for (const slot of dto.timeSlots) {
      if (slot.isDeleted) {
        await this.prisma.doctorTimeSlot.updateMany({
          where: {
            DoctorId: dto.userId,
            HospitalId: slot.hospitalId,
            DayOfWeek: slot.DayOfWeek,
          },
          data: {
            isDeleted: true,
            is_SlotCancelled: true,
            Slot_cancellation_remarks: 'Deleted by user',
            updatedAt: now,
          },
        });
      }
    }

    return {
      message: 'Time slots synced with history logging.',
      stats: results,
      HttpCode: 201,
    };
  }

  // Create Doctor Slot
  async createDoctorSlots(dto: CreateDoctorSlotDto, createdById: number) {
    if (
      !dto.userId ||
      // !dto.hospitalId ||
      !Array.isArray(dto.timeSlots) ||
      dto.timeSlots.length === 0
    ) {
      throw new Error(
        'Invalid input: userId, hospitalId, and timeSlots are required.',
      );
    }

    // 🔍 Check if user is mapped to hospital
    const access = await this.prisma.userHospitalAccess.findFirst({
      where: {
        UserId: dto.userId,
        // hospitalId: dto.hospitalId,
      },
    });

    if (!access) {
      throw new Error('User is not mapped to this hospital.');
    }

    // 🧱 Create valid slot data
    const now = new Date();

    const slotData = dto.timeSlots.map((slot) => ({
      DoctorId: dto.userId as number, // ensure number, not undefined
      // HospitalId: dto.hospitalId as number, // ensure number, not undefined
      DayOfWeek: slot.DayOfWeek || '',
      HospitalId: slot.hospitalId as number, // ensure number, not undefined
      Morning_From: slot.Morning_From ?? null,
      Morning_To: slot.Morning_To ?? null,
      Evening_From: slot.Evening_From ?? null,
      Evening_To: slot.Evening_To ?? null,

      consult_Time_InMin: slot.consult_Time_InMin || 15,
      Accept_Appointment_Selected_Date: slot.Accept_Appointment_Selected_Date,

      DNDremarks: slot.DNDremarks ?? null,
      Slot_cancellation_remarks: slot.Slot_cancellation_remarks ?? null,
      createdBy: createdById,

      is_DND: false,
      is_SlotCancelled: false,
      isSlotChanged: false,
      isActive: true,
      isDeleted: false,
      isAvailable: true,
      isBooked: false,
      isConfirmed: false,
      isRejected: false,

      createdAt: now,
      updatedAt: now,
    }));

    const created = await this.prisma.doctorTimeSlot.createMany({
      data: slotData,
    });

    return {
      message: 'Time slots added successfully.',
      count: created.count,
      HttpCode: 201,
    };
  }
  // Update Doctor Slot
  async updateDoctorSlot(dto: UpdateDoctorSlotDto, updatedById: number) {
    // 1️⃣ Fetch the slot with extra validation
    const slot = await this.prisma.doctorTimeSlot.findFirst({
      where: {
        DoctorTimeSlotId: dto.DoctorTimeSlotId,
        DoctorId: dto.userId, // validate userId
        HospitalId: dto.HospitalId, // validate hospitalId
        isDeleted: false, // optional: skip deleted slots
      },
    });

    if (!slot || slot === undefined || slot === null) {
      throw new Error(
        'Time slot not found or does not belong to the specified user/hospital.',
      );
    }

    // 2️⃣ Update slot
    const updatedSlot = await this.prisma.doctorTimeSlot.update({
      where: { DoctorTimeSlotId: dto.DoctorTimeSlotId },
      data: {
        DayOfWeek: dto.DayOfWeek,
        Morning_From: dto.Morning_From,
        Morning_To: dto.Morning_To,
        Evening_From: dto.Evening_From,
        Evening_To: dto.Evening_To,
        consult_Time_InMin: dto.consult_Time_InMin,
        Accept_Appointment_Selected_Date: dto.Accept_Appointment_Selected_Date,
        DNDremarks: dto.DNDremarks,
        Slot_cancellation_remarks: dto.Slot_cancellation_remarks,
        updatedAt: new Date(),
      },
    });

    return {
      message: 'Time slot updated successfully.',
      data: updatedSlot,
      HttpCode: 200,
    };
  }
  // Update Doctor Slots in Bulk
  async updateDoctorSlotsBulk(
    dto: BulkUpdateDoctorSlotDto,
    updatedById: number,
  ) {
    const now = new Date();
    const results: { DoctorTimeSlotId: number | undefined; status: string }[] =
      [];

    for (const slot of dto.slots || []) {
      const existing = await this.prisma.doctorTimeSlot.findFirst({
        where: {
          DoctorTimeSlotId: slot.DoctorTimeSlotId,
          DoctorId: dto.userId,
          // HospitalId: dto.hospitalId,
          isDeleted: false,
        },
      });

      if (!existing) {
        results.push({
          DoctorTimeSlotId: slot.DoctorTimeSlotId,
          status: 'Not Found',
        });
        continue;
      }
      const { DoctorTimeSlotId, hospitalId, ...rest } = slot;

      const updated = await this.prisma.doctorTimeSlot.update({
        where: { DoctorTimeSlotId },
        data: {
          ...rest,
          Hospital: {
            connect: {
              HospitalId: hospitalId, // 🔁 use actual PK field name from your schema
            },
          },
          updatedAt: now,
        },
      });

      results.push({
        DoctorTimeSlotId: updated.DoctorTimeSlotId,
        status: 'Updated',
      });
    }

    return {
      message: 'Bulk time slots updated.',
      result: results,
      HttpCode: 200,
    };
  }

  //cancelDoctorSlots
  async cancelDoctorSlots(dto: CancelSlotDto, cancelledBy: number) {
    const now = new Date();

    const updated = await this.prisma.doctorTimeSlot.updateMany({
      where: {
        DoctorTimeSlotId: { in: dto.DoctorTimeSlotId },
        isDeleted: false,
      },
      data: {
        is_SlotCancelled: true,
        Slot_cancellation_remarks:
          dto.cancellationRemarks || 'Cancelled by user',
        updatedAt: now,
      },
    });

    return {
      message: `Successfully cancelled ${updated.count} time slot(s).`,
      HttpCode: 200,
    };
  }

  // Get Doctor Slots by Day
  // async getDoctorSlotsByDay(
  //   userId: number,
  //   hospitalId: number,
  //   days: string,
  //   {}: {
  //     userId: number;
  //     hospitalId: number;
  //     days: string;
  //   },
  // ) {
  //   if (!userId || !hospitalId || !days) {
  //     throw new Error('userId, hospitalId, and day are required.');
  //   }

  //   // Validate access
  //   const access = await this.prisma.userHospitalAccess.findFirst({
  //     where: {
  //       UserId: userId,
  //       hospitalId: hospitalId,
  //     },
  //   });

  //   if (!access) {
  //     throw new Error('User is not mapped to this hospital.');
  //   }

  //   // Fetch slots
  //   const slots = await this.prisma.doctorTimeSlot.findMany({
  //     where: {
  //       userId,
  //       HospitalId: hospitalId,
  //       DayOfWeek: days,
  //       isDeleted: false,
  //     },
  //     orderBy: {
  //       createdAt: 'desc',
  //     },
  //   });

  //   return {
  //     message: `Slots for ${days}`,
  //     count: slots.length,
  //     slots,
  //   };
  // }

  //  async getDoctorSlotsByDay({
  //     userId,
  //     hospitalId,
  //     day,
  //   }: {
  //     userId: number;
  //     hospitalId?: number;
  //     day?: string;
  //   }) {
  //     const whereClause: any = {
  //       userId,
  //       isDeleted: false,
  //     };

  //     if (hospitalId) {
  //       whereClause.HospitalId = hospitalId;
  //     }

  //     if (day) {
  //       whereClause.DayOfWeek = day;
  //     }

  //     // Optional access check
  //     if (hospitalId) {
  //       const access = await this.prisma.userHospitalAccess.findFirst({
  //         where: {
  //           UserId: userId,
  //           hospitalId,
  //         },
  //       });

  //       if (!access) {
  //         throw new ForbiddenException('User is not mapped to this hospital.');
  //       }
  //     }

  //     const slots = await this.prisma.doctorTimeSlot.findMany({
  //       where: whereClause,
  //       orderBy: {
  //         createdAt: 'desc',
  //       },
  //     });

  //     return {
  //       message: `Slots fetched successfully.`,
  //       count: slots.length,
  //       slots,
  //     };
  //   }

  async getDoctorSlotsByDay({
    userId,
    hospitalId,
    day,
  }: {
    userId: number;
    hospitalId?: number;
    day?: string;
  }) {
    const whereClause: any = {
      DoctorId: userId,
      isDeleted: false,
    };

    if (hospitalId) {
      whereClause.HospitalId = hospitalId;
    }

    if (day) {
      whereClause.DayOfWeek = day;
    }

    // ✅ Access check
    if (hospitalId) {
      const access = await this.prisma.userHospitalAccess.findFirst({
        where: { UserId: userId, hospitalId },
      });
      if (!access) {
        throw new ForbiddenException('User is not mapped to this hospital.');
      }
    }

    const slots = await this.prisma.doctorTimeSlot.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    // 🕒 Logic: Only reset if the cancelled day was *yesterday*
    const now = new Date();
    const todayIndex = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Map day names to numbers
    const dayIndexMap: Record<string, number> = {
      SUNDAY: 0,
      MONDAY: 1,
      TUESDAY: 2,
      WEDNESDAY: 3,
      THURSDAY: 4,
      FRIDAY: 5,
      SATURDAY: 6,
    };

    // ✅ Determine "yesterday" index properly
    const yesterdayIndex = (todayIndex - 1 + 7) % 7;

    const slotsToReset: number[] = [];

    const adjustedSlots = slots.map((slot) => {
      const slotDay = slot.DayOfWeek?.toUpperCase();
      const slotDayIndex = dayIndexMap[slotDay ?? ''];

      if (typeof slotDayIndex !== 'number') return slot;

      // 🔒 Keep permanent cancellations
      if (slot.is_SlotCancelled && slot.isPermanentCancelled) {
        return slot;
      }

      // 🧠 Reset only if the cancelled day was *yesterday*
      if (slot.is_SlotCancelled && !slot.isPermanentCancelled) {
        const shouldReset = slotDayIndex === yesterdayIndex;
        if (shouldReset) {
          slotsToReset.push(slot.DoctorTimeSlotId);
          return {
            ...slot,
            is_SlotCancelled: false,
            Slot_cancellation_remarks: '',
          };
        }
      }

      return slot;
    });

    // ✅ Persist the reset in DB if any
    if (slotsToReset.length > 0) {
      await this.prisma.doctorTimeSlot.updateMany({
        where: { DoctorTimeSlotId: { in: slotsToReset } },
        data: {
          is_SlotCancelled: false,
          Slot_cancellation_remarks: '',
          updatedAt: new Date(),
        },
      });

      console.log(
        `✅ Auto-reset ${slotsToReset.length} slots cancelled yesterday (${Object.keys(dayIndexMap).find((k) => dayIndexMap[k] === yesterdayIndex)}).`,
      );
    }

    return {
      message: `Slots fetched successfully.`,
      count: adjustedSlots.length,
      slots: adjustedSlots,
    };
  }

  // ✅ Scheduled midnight reset (backup to inline reset)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async resetTemporaryCancellations() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayDay = yesterday
      .toLocaleString('en-US', { weekday: 'long' })
      .toUpperCase();

    await this.prisma.doctorTimeSlot.updateMany({
      where: {
        is_SlotCancelled: true,
        isPermanentCancelled: false,
        DayOfWeek: yesterdayDay, // ✅ reset only yesterday's day
      },
      data: {
        is_SlotCancelled: false,
        Slot_cancellation_remarks: '',
        updatedAt: new Date(),
      },
    });

    console.log(`✅ Reset temporary cancellations for ${yesterdayDay}`);
  }

  async createOrUpdateDoctorCosting(
    dto: CreateDoctorCostingDto,
    userId: number,
  ) {
    const {
      doctorId,
      hospitalIds = [],
      CreatedById = userId,
      insuranceApplicable,
      walkInFee,
      discount = 0,
      tax = 0,
      commission = 0,
      ...restCostingFields
    } = dto;

    if (typeof doctorId !== 'number') {
      throw new Error('doctorId is required and must be a number.');
    }

    if (typeof walkInFee !== 'number') {
      throw new Error('walkInFee is required and must be a number.');
    }

    if (typeof insuranceApplicable !== 'boolean') {
      throw new Error('insuranceApplicable is required and must be a boolean.');
    }

    // Apply core logic for calculation (can be refactored into a utility)
    const computeAmountDetails = (baseFee: number) => {
      const discountedFee = baseFee - (baseFee * discount) / 100;
      const taxAmount = (discountedFee * tax) / 100;
      const totalFee = discountedFee + taxAmount;
      const commissionAmount = (discountedFee * commission) / 100;
      const doctorPayout = discountedFee - commissionAmount;

      return {
        discountedFee,
        taxAmount,
        totalFee,
        commissionAmount,
        doctorPayout,
      };
    };
    // Step 1: Delete existing entries for doctor + hospitals
    await this.prisma.doctorCosting.deleteMany({
      where: {
        doctorId,
        hospitalId: { in: hospitalIds },
      },
    });

    // Prepare entries for each hospital
    const entries = hospitalIds.map((hospitalId) => {
      const {
        discountedFee,
        taxAmount,
        totalFee,
        commissionAmount,
        doctorPayout,
      } = computeAmountDetails(walkInFee);

      return {
        doctorId,
        hospitalId,
        walkInFee,
        teleConsultFee: restCostingFields.teleConsultFee,
        fastTrackFee: restCostingFields.fastTrackFee,
        homeVisitFee: restCostingFields.homeVisitFee,
        emergencyFee: restCostingFields.emergencyFee,
        procedureFee: restCostingFields.procedureFee,
        freeFollowupCount: restCostingFields.freeFollowupCount,
        followupValidityDays: restCostingFields.followupValidityDays,
        tax,
        discount,
        commission,
        insuranceApplicable,
        // Optional: You can store these derived values in separate fields if needed
        discountedFee,
        totalFee,
        doctorPayout,
      };
    });

    const saved = await this.prisma.doctorCosting.createMany({
      data: entries,
      skipDuplicates: true,
    });

    return {
      message: 'Doctor costing added successfully.',
      count: saved.count,
      data: entries,
    };
  }

  // Apply discount, tax, and commission to all fee types (walk-in, teleconsultation, and fast-track), here's a complete, clean approach.
  // const applyCharges = (fee: number = 0) => {
  //   const discounted = fee - (fee * discount) / 100;
  //   const taxAmount = (discounted * tax) / 100;
  //   const commissionAmount = (discounted * commission) / 100;
  //   const totalFee = discounted + taxAmount;
  //   const doctorPayout = discounted - commissionAmount;

  //   return {
  //     originalFee: fee,
  //     discountedFee: parseFloat(discounted.toFixed(2)),
  //     taxAmount: parseFloat(taxAmount.toFixed(2)),
  //     commissionAmount: parseFloat(commissionAmount.toFixed(2)),
  //     totalFee: parseFloat(totalFee.toFixed(2)),
  //     doctorPayout: parseFloat(doctorPayout.toFixed(2)),
  //   };
  // };

  // const entries = hospitalIds.map((hospitalId) => {
  //   const walkIn = applyCharges(walkInFee);
  //   const tele = applyCharges(restCostingFields.teleConsultFee);
  //   const fastTrack = applyCharges(restCostingFields.fastTrackFee);

  //   return {
  //     doctorId,
  //     hospitalId,
  //     walkInFee: walkIn.originalFee,
  //     teleConsultFee: tele.originalFee,
  //     fastTrackFee: fastTrack.originalFee,
  //     homeVisitFee: restCostingFields.homeVisitFee,
  //     emergencyFee: restCostingFields.emergencyFee,
  //     procedureFee: restCostingFields.procedureFee,
  //     freeFollowupCount: restCostingFields.freeFollowupCount,
  //     followupValidityDays: restCostingFields.followupValidityDays,
  //     tax,
  //     discount,
  //     commission,
  //     insuranceApplicable,

  //     // Optional: Save breakdowns
  //     walkInDiscounted: walkIn.discountedFee,
  //     walkInTax: walkIn.taxAmount,
  //     walkInTotal: walkIn.totalFee,
  //     walkInPayout: walkIn.doctorPayout,

  //     teleDiscounted: tele.discountedFee,
  //     teleTax: tele.taxAmount,
  //     teleTotal: tele.totalFee,
  //     telePayout: tele.doctorPayout,

  //     fastTrackDiscounted: fastTrack.discountedFee,
  //     fastTrackTax: fastTrack.taxAmount,
  //     fastTrackTotal: fastTrack.totalFee,
  //     fastTrackPayout: fastTrack.doctorPayout,
  //   };
  // });
  //

  // Get Doctor Costing by ID
  async getDoctorCostingById(doctorId: number) {
    const data = await this.prisma.doctorCosting.findMany({
      where: { doctorId },
      include: { hospital: false },
    });

    return { doctorId, costings: data };
  }

  // admin.service.ts
  async AddUpdateAccessRight(dto: AddUpdateAccessRightDto) {
    if (!dto.Modules?.length) {
      throw new Error('Modules cannot be empty');
    }

    for (const module of dto.Modules) {
      const upsertedModule = await this.prisma.module.upsert({
        where: { ModuleId: module.ModuleId || -1 },
        update: { ModuleName: module.ModuleName ?? '' },
        create: {
          ModuleName: module.ModuleName ?? '',
          IsActive: module.IsActive ?? true,
        },
      });

      for (const sub of module.SubModules ?? []) {
        const upsertedSubModule = await this.prisma.subModule.upsert({
          where: { SubModuleId: sub.SubModuleId || -1 },
          update: {
            SubModuleName: sub.SubModuleName ?? '',
            ModuleId: upsertedModule.ModuleId,
          },
          create: {
            SubModuleName: sub.SubModuleName ?? '',
            IsActive: sub.IsActive ?? true,
            ModuleId: upsertedModule.ModuleId,
          },
        });

        for (const perm of sub.Permissions ?? []) {
          const permission = await this.prisma.permission.upsert({
            where: { PermissionId: perm.PermissionId || -1 },
            update: {
              CanView: perm.CanView ?? false,
              CanCreate: perm.CanCreate ?? false,
              CanUpdate: perm.CanUpdate ?? false,
              CanDelete: perm.CanDelete ?? false,
              CanAI_Assist: perm.CanAI_Assist ?? false,
              IsActive: sub.IsActive ?? true,
            },
            create: {
              SubModuleId: upsertedSubModule.SubModuleId,
              CanView: perm.CanView ?? false,
              CanCreate: perm.CanCreate ?? false,
              CanUpdate: perm.CanUpdate ?? false,
              CanDelete: perm.CanDelete ?? false,
              CanAI_Assist: perm.CanAI_Assist ?? false,
              IsActive: sub.IsActive ?? true,
            },
          });

          for (const rp of perm.RolePermissions ?? []) {
            await this.prisma.rolePermission.upsert({
              where: { RolePermissionId: rp.RolePermissionId || -1 },
              update: {
                RoleId: rp.RoleId,
                UserId: rp.UserId,
                HospitalId: rp.HospitalId,
                OrganizationId: rp.OrganizationId,
                PermissionId: permission.PermissionId,
              },
              create: {
                RoleId: rp.RoleId,
                UserId: rp.UserId,
                HospitalId: rp.HospitalId,
                OrganizationId: rp.OrganizationId,
                PermissionId: permission.PermissionId,
              },
            });
          }
        }
      }
    }

    return { success: true };
  }

  // admin.service.ts
  async getAccessRights(filters: {
    RoleId: number;
    UserId: number;
    HospitalId: number;
    OrganizationId: number;
  }) {
    const { RoleId, UserId, HospitalId, OrganizationId } = filters;

    // 1️⃣ Fetch all role permissions with required joins
    const rolePerms = await this.prisma.rolePermission.findMany({
      where: {
        RoleId,
        UserId,
        HospitalId,
        OrganizationId,
      },
      include: {
        Permission: {
          include: {
            SubModule: {
              include: {
                Module: true,
              },
            },
            RolePermissions: true,
          },
        },
      },
    });

    if (!rolePerms.length) return [];

    // 2️⃣ Group into Modules -> SubModules -> Permissions
    const moduleMap = new Map<number, any>();

    for (const rp of rolePerms) {
      const perm = rp.Permission;
      if (!perm?.SubModule) continue;

      const sub = perm.SubModule;
      const mod = sub.Module;

      // --- Find or create module entry
      if (!moduleMap.has(mod.ModuleId)) {
        moduleMap.set(mod.ModuleId, {
          ModuleId: mod.ModuleId,
          ModuleName: mod.ModuleName,
          enabled: false,
          Submodules: [],
        });
      }

      const moduleEntry = moduleMap.get(mod.ModuleId);

      // --- Find or create submodule entry
      let subEntry = moduleEntry.Submodules.find(
        (s: any) => s.SubModuleId === sub.SubModuleId,
      );

      if (!subEntry) {
        subEntry = {
          SubModuleId: sub.SubModuleId,
          SubModuleName: sub.SubModuleName,
          enabled: false,
          Permissions: [],
        };
        moduleEntry.Submodules.push(subEntry);
      }

      // --- Find or create permission entry
      let permEntry = subEntry.Permissions.find(
        (p: any) => p.PermissionId === perm.PermissionId,
      );

      if (!permEntry) {
        permEntry = {
          PermissionId: perm.PermissionId,
          CanView: !!perm.CanView,
          CanCreate: !!perm.CanCreate,
          CanUpdate: !!perm.CanUpdate,
          CanDelete: !!perm.CanDelete,
          CanAI_Assist: !!perm.CanAI_Assist,
          RolePermissions: [],
        };
        subEntry.Permissions.push(permEntry);
      }

      // --- Merge unique RolePermissions (avoid duplicate RolePermissionId)
      const existing = permEntry.RolePermissions.find(
        (r) => r.RolePermissionId === rp.RolePermissionId,
      );
      if (!existing) {
        permEntry.RolePermissions.push({
          RolePermissionId: rp.RolePermissionId,
          RoleId: rp.RoleId,
          UserId: rp.UserId,
          HospitalId: rp.HospitalId,
          OrganizationId: rp.OrganizationId,
        });
      }

      // --- Update enable flags dynamically
      const isEnabled =
        perm.CanView ||
        perm.CanCreate ||
        perm.CanUpdate ||
        perm.CanDelete ||
        perm.CanAI_Assist;

      if (isEnabled) {
        subEntry.enabled = true;
        moduleEntry.enabled = true;
      }
    }

    // 3️⃣ Return final structured, deduplicated list
    return Array.from(moduleMap.values());
  }

  async getAllModules() {
    const modules = await this.prisma.module.findMany({
      // where: { IsActive: true },
      include: {
        SubModules: {
          // where: { IsActive: true },
          // No need to include Permissions anymore since you don't want real ones
        },
      },
    });

    const defaultPermission = {
      PermissionId: 0,
      CanView: false,
      CanCreate: false,
      CanUpdate: false,
      CanDelete: false,
      CanAI_Assist: false,
    };

    const normalizedModules = modules.map((mod) => ({
      ModuleId: mod.ModuleId,
      ModuleName: mod.ModuleName,
      enabled: false, // initialize
      SubModules: mod.SubModules.map((sub) => ({
        SubModuleId: sub.SubModuleId,
        SubModuleName: sub.SubModuleName,
        enabled: false, // initialize
        Permissions: [defaultPermission], // always initialize with this
      })),
    }));

    return normalizedModules;
  }
}
// Helper: Generate 3-char hospital code
async function generateHospitalCode(
  hospitalName: string,
  prisma: any,
): Promise<string> {
  const firstChar = (hospitalName?.trim()[0] || 'X').toUpperCase();

  // Retry until we find a unique code
  let uniqueCode: string = '';
  let isUnique = false;

  while (!isUnique) {
    // Generate 2 random chars
    const randomChars = Array.from({ length: 2 }, () =>
      String.fromCharCode(65 + Math.floor(Math.random() * 26)),
    ).join('');

    uniqueCode = firstChar + randomChars;

    // Check DB for duplicates
    const existing = await prisma.hospital.findUnique({
      where: { HospitalCode: uniqueCode },
    });

    if (!existing) {
      isUnique = true;
    }
  }

  return uniqueCode;
}
