import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import refreshConfig from './config/refresh.config';
import { RefreshStrategy } from './strategies/refresh-token.strategy';
import { APP_GUARD } from '@nestjs/core';
import { MailerService } from 'src/common/mailer/mailer.service';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshConfig),

  ],
  exports: [MailerService],

  controllers: [AuthController],
  providers: [AuthService, UserService, PrismaService, LocalStrategy,JwtStrategy,JwtAuthGuard ,RefreshStrategy,MailerService,{
    provide: APP_GUARD,
    useClass: JwtAuthGuard, //@UseGuard(JwtAuthGuard)
  },],
})
export class AuthModule {}
