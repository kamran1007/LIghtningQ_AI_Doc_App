import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProfileDto } from './dto/updateprofile.dto';
import { Title } from 'generated/prisma';

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
  async findOne(UserId: number) {
    const updatedUser = await this.prisma.user.findUnique({
      where: { UserId },
      include: {
        AdminAccess: {
          include: {
            hospital: true,
            role: true,
          },
        },
      },
    });
    return updatedUser;
  }
  async updateHashedRefreshToken(UserId: number, hashedRT: string | null) {
    return await this.prisma.user.update({
      where: {
        UserId: UserId,
      },
      data: {
        // hashedRefreshToken: hashedRT,  hashedRefreshToken String? // <== add the `?` to make it nullable -- > prisma
        hashedRefreshToken: hashedRT === null ? undefined : hashedRT
      },
    });
  }
  
  // Update user
  async updateUserProfile(UserId: number, dto: UpdateProfileDto) {
    return await this.prisma.user.update({
      where: { UserId: UserId },
      data: {
        ...dto,
        Prefix: dto.title  as Title, // Cast string to enum

        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      },
      select: {
        UserId: true,
        firstName: true,
        Prefix: true,
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
  async updatePassword(UserId: number, newHashedPassword: string) {
    return await this.prisma.user.update({
      where: { UserId: UserId },
      data: {
        passwordHash: newHashedPassword,
      },
    });
  }
}
