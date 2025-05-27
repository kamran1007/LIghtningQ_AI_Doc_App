import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProfileDto } from './dto/updateprofile.dto';
import { Surname } from 'generated/prisma';

@Injectable()
export class UserService {
  // updateHashedRefreshToken(userId: number, hashedRT: string) {
  //   throw new Error('Method not implemented.');
  // }
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
  async findOne(userId: number) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        settings: true,
        auditLogs: true,
        loginSessions: true,
        AdminAccess: true,
      },
    });
  }
  async updateHashedRefreshToken(userId: number, hashedRT: string | null) {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRefreshToken: hashedRT,
      },
    });
  }

  // Update user
  async updateUserProfile(userId: number, dto: UpdateProfileDto) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...dto,
        surname: dto.surname as Surname, // Cast string to enum

        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      },
      select: {
        id: true,
        firstName: true,
        surname: true,
        lastName: true,
        gender: true,
        email: true,
        mobile: true,
        dateOfBirth: true,
        imageUrl: true,
        roleId: true,
      },
    });
  }

  //change password
  async updatePassword(userId: number, newHashedPassword: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newHashedPassword,
      },
    });
  }
}
