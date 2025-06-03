import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHospitalDto } from './dto/create_hospital.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateHospitalDto } from './dto/update_hospital.dto';

@Injectable()
export class ManageHospitalService {
  constructor(private readonly prisma: PrismaService) {}

  async CreateHospital(dto: CreateHospitalDto, userId: number) {
    // 1. Fetch organization
    const organization = await this.prisma.organization.findUnique({
      where: { id: dto.organizationId },
    });

    if (!organization) {
      throw new Error('Organization not found');
    }
    const hospital = await this.prisma.hospital.create({
      data: {
        ...dto,
        Organizationcode: organization.Organizationcode, // Set manually

        createdById: userId,
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
      where: { id },
    });

    if (!hospital) {
      throw new NotFoundException(`Hospital with ID ${id} not found`);
    }

    const updatedHospital = await this.prisma.hospital.update({
      where: { id },
      data: {
        ...dto,
        updatedById: userId,
        updatedAt: new Date(),
      },
    });

    return {
      message: 'Hospital updated successfully',
      data: updatedHospital,
    };
  }
}
