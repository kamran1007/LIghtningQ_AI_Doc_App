import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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
      where: {
        id: userId,
        
      },
    });
  }
  async updateHashedRefreshToken(userId: number ,hashedRT: string  |null) {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRefreshToken : hashedRT
      },
    });
  }
}
