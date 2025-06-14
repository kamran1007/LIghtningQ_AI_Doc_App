import { HttpCode, Injectable, NotFoundException } from '@nestjs/common';
import { CreateHospitalDto } from './dto/create_hospital.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateHospitalDto } from './dto/update_hospital.dto';
import { CreateUserDto, UserBranchDto } from './dto/create_user.dto';
import { Title } from 'generated/prisma';
import { hash } from 'argon2';
import { contains } from 'class-validator';

@Injectable()
export class ManageHospitalService {
  constructor(private readonly prisma: PrismaService) {}

  // async CreateHospital(dto: CreateHospitalDto, userId: number) {
  //   // 1. Fetch organization
  //   const organization = await this.prisma.organization.findUnique({
  //     where: { id: dto.organizationId },
  //   });

  //   if (!organization) {
  //     throw new Error('Organization not found');
  //   }
  //   const hospitalcode = await this.prisma.hospital.findUnique({
  //     where: { hospitalCode: dto.hospitalCode },
  //   });
  //   if(hospitalcode){
  //     throw new Error('Hospital code Must be unique')
  //   }
  //   const hospital = await this.prisma.hospital.create({
  //     data: {
  //       ...dto,
  //       Organizationcode: organization.Organizationcode, // Set manually
  //       createdById: userId,
  //     },
  //   });
  //   return hospital;
  // }
  async CreateHospital(dto: CreateHospitalDto, userId: number) {
    // 1. Fetch organization
    const organization = await this.prisma.organization.findUnique({
      where: { OrganizationId: dto.organizationId },
    });

    if (!organization) {
      // Throw custom error for client-side logging
      throw new Error('Organization not found');
    }

    // Auto-generate hospitalCode if it's empty
    if (!dto.HospitalCode || dto.HospitalCode.trim() === '') {
      const namePart = (dto.HospitalName?.slice(0, 3) || 'XXX').toUpperCase();
      const cityPart = (dto.city?.slice(0, 3) || 'YYY').toUpperCase();
      const contactPart = dto.contactNumber?.slice(-2) || '00';

      let baseCode = `${namePart}${cityPart}${contactPart}`;
      let uniqueCode = baseCode;
      let counter = 1;

      // Keep trying until a unique hospitalCode is found
      while (
        await this.prisma.hospital.findUnique({
          where: { HospitalCode: uniqueCode },
        })
      ) {
        uniqueCode = `${baseCode}${counter}`;
        counter++;
      }

      dto.HospitalCode = uniqueCode;
    }

    // 2. Check uniqueness
    const hospitalWithSameCode = await this.prisma.hospital.findUnique({
      where: { HospitalCode: dto.HospitalCode },
    });

    if (hospitalWithSameCode) {
      throw new Error('Hospital code must be unique');
    }

    // 3. Create hospital
    const hospital = await this.prisma.hospital.create({
      data: {
        HospitalName: dto.HospitalName,
        HospitalCode: dto.HospitalCode,
        ParentHospitalCode: dto.ParentHospitalCode ?? '', // Ensure non-undefined
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
      HttpCode:200,
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
        Employee_ID: dto.Employee_ID ?? '', // ✅ fallback to empty string
        hashedRefreshToken: '',
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
      HttpCode:200,
    }
  }

  //UPDATE
  async updateUserWithHospitals(userId: number, dto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { UserId: userId },
    });
    if (!user) throw new Error('User not found');
  
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
    HospitalId,
  }: {
    page: number;
    limit: number;
    search?: string;
    HospitalId?: number;
  }) {
    const skip = (page - 1) * limit;

    const where: any = {
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { mobile: { contains: search, mode: 'insensitive' } },
          // { HospitalName: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(HospitalId && { HospitalId }),
    };

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          role: true,
          // UserOrganizationArray: true,
          AdminAccess: {
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
}
