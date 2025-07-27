import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
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
import { QuickAppointmentDto } from 'src/appointment/dto/create-appointment.dto';
import { UpdateAppointmentDto } from 'src/appointment/dto/update-appointment.dto';
import { VitalsDto } from 'src/consultation/dto/vitals.dto';
import { CreateOrUpdateConsultationDto } from 'src/consultation/dto/create-update-consultation.dto';
import { CreateInvestigationSubTypeDto } from 'src/consultation/dto/createinvestigationtype.dto';
import { CreateDiagnosisDto } from 'src/consultation/dto/create-diagnosis.dto';
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
    try {
      console.log('Incoming DTO:', dto);

      const CreatedBy = Number(req.user?.UserId || 1);

      const safeFirst =
        dto.firstName?.replace(/[^a-zA-Z0-9]/g, '') || 'unknown';
      const safeLast = dto.lastName?.replace(/[^a-zA-Z0-9]/g, '') || '';

      let imageUrl: string | undefined = dto.profileImageUrl;

      // ✅ FIX: If file exists (multipart upload), assign image URL from file
      if (file) {
        console.log('📸 File received:', file.originalname, file.size);
        imageUrl = `/uploads/patients/${file.filename}`;
      }

      // ✅ Fallback: base64 image conversion if no file but base64 provided
      else if (dto.profileImageUrl?.startsWith('data:image')) {
        const base64String = dto.profileImageUrl;
        const base64Data = base64String.split(',')[1];

        if (!base64Data) {
          throw new BadRequestException('Invalid base64 image data.');
        }

        const buffer = Buffer.from(base64Data, 'base64');
        const finalName = `${safeFirst}_${safeLast}_${Date.now()}.jpg`;
        const imagePath = join(
          __dirname,
          '..',
          '..',
          'uploads',
          'patients',
          finalName,
        );

        fs.writeFileSync(imagePath, buffer);
        imageUrl = `/uploads/patients/${finalName}`;
      }

      // ✅ Final guard (this now will NOT trigger incorrectly)
      if (!dto.PatientId && !imageUrl) {
        throw new BadRequestException(
          'Patient image is required for new patient.',
        );
      }

      return this.patientcareService.upsertPatient(dto, imageUrl, CreatedBy);
    } catch (err) {
      console.error('❌ Backend Error:', err);
      throw new InternalServerErrorException(err);
    }
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
  //specialization
  @Get('getallSpecialization')
  getAllSpecialization() {
    return this.patientcareService.getAllSpecialization();
  }

  @Get('getAlldoctoRole')
  getAlldoctorrole() {
    return this.patientcareService.getAlldoctoRole();
  }
  //fetchpaymenttype
  @Get('getAllPaymentMode')
  getAllPaymentMode() {
    return this.patientcareService.getAllPaymentMode();
  }

  //fetchvisittype
  @Get('getAllVisitType')
  getAllVisitType() {
    return this.patientcareService.getAllVisitType();
  }

  //tagpatient
  @Get('getAllTagType')
  getAllTagType() {
    return this.patientcareService.getAllTagType();
  }

  //

  //book Appointment
  @Post('quickbookappointment')
  async quickbookappointment(
    @Body() dto: QuickAppointmentDto,
    @Req() req: any,
  ) {
    const CreatedBy = Number(req.user?.UserId || 1);

    return this.patientcareService.createAppointment(dto, CreatedBy);
  }

  //rescheduleAppointment

  @Patch('updateappointment')
  async updateAppointment(@Body() dto: UpdateAppointmentDto, @Req() req: any) {
    const UpdatedBy = Number(req.user?.UserId || 1);
    return this.patientcareService.updateAppointment(dto, UpdatedBy);
  }

  //searchappointment
  @Get('searchappointment')
  async searchAppointments(@Query() query: any) {
    const {
      hospitalId,
      DoctorId,
      status,
      visitTypeId,
      acuity,
      search,
      appointmentDate, // ✅ single date
      appointmentDateFrom,
      appointmentDateTo,
      page = 1,
      limit = 10,
    } = query;

    if (search && search.length < 3) {
      throw new BadRequestException(
        'Search term must be at least 3 characters',
      );
    }

    return this.patientcareService.searchAppointments({
      hospitalId: Number(hospitalId),
      DoctorId: Number(DoctorId),
      status,
      visitTypeId: Number(visitTypeId),
      acuity,
      search,
      appointmentDate,
      appointmentDateFrom,
      appointmentDateTo,
      page: Number(page),
      limit: Number(limit),
    });
  }

  // vitals
  @Patch('addUpdatepatientvitals')
  async upsertVitals(@Body() dto: VitalsDto, @CurrentUser() @Req() req: any) {
    const CreatedBy = Number(req.user?.UserId || 1);
    return this.patientcareService.upsertVitals(dto, CreatedBy);
  }
  // get all vitals
  @Get('getvitals/:appointmentId')
  getVitalsWithHistory(
    @Param('appointmentId', ParseIntPipe) appointmentId: number,
  ) {
    return this.patientcareService.getVitalsWithHistory(appointmentId);
  }

  //add update consultation
  @Post('addupdateconsultation')
  async addOrUpdateConsultation(
    @Body() dto: CreateOrUpdateConsultationDto,
    @CurrentUser() @Req() req: any,
  ) {
    const CreatedBy = Number(req.user?.UserId || 1);

    return this.patientcareService.addOrUpdateConsultation(dto, CreatedBy);
  }

  //add investigation
  @Post('CreateInvestigationSubType')
  async createSubtype(
    @Body() dto: CreateInvestigationSubTypeDto,
    @CurrentUser() @Req() req: any,
  ) {
    const CreatedBy = Number(req.user?.UserId || 1);

    return this.patientcareService.createOrFindSubtype(dto, CreatedBy);
  }

  @Get('Patientappointmentcasesheet/:appointmentId')
  async getConsultationByAppointmentId(
    @Param('appointmentId', ParseIntPipe) appointmentId: number,
  ) {
    return this.patientcareService.getConsultationByAppointmentId(
      appointmentId,
    );
  }

  // add  all diagnosis
  @Post('adddiagnosis')
  async addDiagnosis(@Body() dto: CreateDiagnosisDto) {
    return this.patientcareService.createDiagnosis(dto);
  }

  // get all diagnosis
  @Get('getAllDiagnosis')
  getAllDiagnosis() {
    return this.patientcareService.getAllDiagnosis();
  }


  // get all diagnosis by specialization id
  // @Get('specialization/:specializationId')
  // async getBySpecialization(
  //   @Param('specializationId', ParseIntPipe) specializationId: number,
  // ) {
  //   return this.diagnosisService.getDiagnosesBySpecialization(specializationId);
  // }
}

