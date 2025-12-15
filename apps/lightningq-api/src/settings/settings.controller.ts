import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UpsertPrintSettingDto } from './dto/upsert-print-setting.dto';
import { SettingsService } from './settings.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { ParseJsonPipe } from 'src/pipe/parse-json.pipe';

@Controller('settings')
export class SettingsController {
  constructor(private readonly printService: SettingsService) {}

  @Post('upsertPrintData')
  @UseInterceptors(AnyFilesInterceptor({ storage: multer.memoryStorage() }))
  async upsertPrintData(
    @UploadedFiles() rawFiles: Array<Express.Multer.File>,
    @Body('globalLogos', ParseJsonPipe) globalLogos,
    @Body('Printdetails', ParseJsonPipe) Printdetails,
    @Body() dto: any,
  ) {
    // Convert files array → grouped structure
    const files = rawFiles.reduce((acc, file) => {
      acc[file.fieldname] = acc[file.fieldname] || [];
      acc[file.fieldname].push(file);
      return acc;
    }, {});

    // ----------------------------
    // 🔥 FIX NUMERIC FIELD TYPES
    // ----------------------------
    dto.parentOrganizationId = Number(dto.parentOrganizationId);
    dto.hospitalId = Number(dto.hospitalId);
    dto.userId = Number(dto.userId);
    if (dto.language) dto.language = Number(dto.language);
    if (dto.type) dto.type = dto.type === 'true' ? true : false;

    // Add parsed JSON fields
    dto.globalLogos = globalLogos;
    dto.Printdetails = Printdetails;

    return this.printService.upsertPrintSettings(dto, files);
  }

  @Get('GetprintSetting')
  async getPrintSettings(
    @Query('userId') userId: number,
    @Query('hospitalId') hospitalId: number,
    @Query('organizationId') organizationId: number,
  ) {
    return this.printService.getPrintSettings(
      Number(userId),
      Number(hospitalId),
      Number(organizationId),
    );
  }
}
