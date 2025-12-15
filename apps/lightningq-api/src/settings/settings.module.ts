import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { R2Module } from 'src/r2/r2.module';

@Module({
  imports: [R2Module],   // <-- import module
  providers: [SettingsService, PrismaService],
  controllers: [SettingsController],
})
export class SettingsModule {}

