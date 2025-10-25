import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule], // 👈 ensure PrismaService is available
  providers: [WhatsappService],
  exports: [WhatsappService]
})
export class WhatsappModule {}
