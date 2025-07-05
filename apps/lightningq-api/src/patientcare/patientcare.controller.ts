import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import * as fs from 'fs';
import { PatientcareService } from './patientcare.service';
import { UpsertPatientDto } from '../manage-patient/dto/upsert-patient.dto';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('patientcare')
export class PatientcareController {
  constructor(
    private readonly patientcareService: PatientcareService,
    private readonly prisma: PrismaService,
  ) {}

  @Patch('upsertPatient')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(__dirname, '..', '..', 'uploads', 'patients');
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const timestamp = Date.now();
          const ext = extname(file.originalname);
          cb(null, `${timestamp}${ext}`); // Temporary name
        },
      }),
    }),
  )
  async upsertPatient(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpsertPatientDto,
    @Req() req: any,
  ) {
    const CreatedBy = Number(req.user?.UserId || 1);

    // ✅ Use patient name from parsed DTO
    const safeFirst = dto.firstName?.replace(/[^a-zA-Z0-9]/g, '') || 'unknown';
    const safeLast = dto.lastName?.replace(/[^a-zA-Z0-9]/g, '') || '';
    const finalName = `${safeFirst}_${safeLast}_${Date.now()}${extname(file.originalname)}`;

    // ✅ Rename the file now
    const oldPath = join(
      __dirname,
      '..',
      '..',
      'uploads',
      'patients',
      file.filename,
    );
    const newPath = join(
      __dirname,
      '..',
      '..',
      'uploads',
      'patients',
      finalName,
    );
    fs.renameSync(oldPath, newPath);

    const imageUrl = `/uploads/patients/${finalName}`;

    return this.patientcareService.upsertPatient(dto, imageUrl, CreatedBy);
  }

  //Get All patient
  @Get('getallpatientdetail')
  async getAllPatients(
    @Query('hospitalId') hospitalId: number,
    @Query('search') search?: string,
    @Query('city') city?: string,
    @Query('tagPatientId') tagPatientId?: number,
    @Query('gender') gender?: string,
    @Query('dobFrom') dobFrom?: string,
    @Query('dobTo') dobTo?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.patientcareService.getPatients({
      hospitalId,
      search,
      city,
      gender,
      tagPatientId,
      dobFrom,
      dobTo,
      page: Number(page),
      limit: Number(limit), // ✅ important
    });
  }

  //autosave
  @Patch('autosavepatient')
  async autosavePatient(
    @Body() dto: UpsertPatientDto,
    @CurrentUser() user: any, // assuming auth middleware
  ) {
    const response = await this.patientcareService.autosavePatient(
      dto,
      user.id,
    );
    return {
      message: 'Patient draft saved successfully',
      data: response,
    };
  }

  //getdraftpatient

  @Get('getdraftpatient')
  async getDraftPatients(@Query('hospitalId') hospitalId: number) {
    return this.patientcareService.getDraftPatients(Number(hospitalId));
  }

  // get tag
  @Get('tagspatient')
  getAllTags() {
    return this.patientcareService.getAllTags();
  }

  //get all  allergies
  @Get('patientallergies')
  getAllAllergies() {
    return this.patientcareService.getAllAllergies();
  }

  //get all language 
  @Get('languages')
  getAllLanguages() {
    return this.patientcareService.getAllLanguages();
  }

  //get pastmedicalhistory 
  @Get('medical-history')
  getAllMedicalHistory() {
    return this.patientcareService.getAllMedicalHistory();
  }
}
