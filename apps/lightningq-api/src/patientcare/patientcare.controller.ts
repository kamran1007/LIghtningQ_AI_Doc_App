import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
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
import multer, { diskStorage } from 'multer';
import path, { extname, join } from 'path';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuickAppointmentDto } from 'src/appointment/dto/create-appointment.dto';
import { UpdateAppointmentDto } from 'src/appointment/dto/update-appointment.dto';
import { VitalsDto } from 'src/consultation/dto/vitals.dto';
import { CreateOrUpdateConsultationDto } from 'src/consultation/dto/create-update-consultation.dto';
import { CreateInvestigationSubTypeDto } from 'src/consultation/dto/createinvestigationtype.dto';
import { CreateDiagnosisDto } from 'src/consultation/dto/create-diagnosis.dto';
import { CreateChiefComplaintDto } from 'src/consultation/dto/CreateCheifcomplaint.dto';
import { CreateMedicineDto } from 'src/consultation/dto/create-medicine.dto';
import { ConsultationProcedureDto } from 'src/consultation/dto/CreateOrUpdateConsultationDto';
import { ConsultationActionDto } from 'src/appointment/dto/consultation-action.dto';
import { AppointmentService } from 'src/appointment/appointment.service';
import { R2Service } from 'src/r2/r2.service';
@Controller('patientcare')
export class PatientcareController {
  constructor(
    private readonly patientcareService: PatientcareService,
    private readonly prisma: PrismaService,
    private ManageAppointment: AppointmentService,
    private readonly  r2Service : R2Service
  ) {}

  @Patch('upsertPatient')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
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

      let imageUrl = dto.profileImageUrl;

      const safeFirst =
        dto.firstName?.replace(/[^a-zA-Z0-9]/g, '') || 'unknown';
      const safeLast = dto.lastName?.replace(/[^a-zA-Z0-9]/g, '') || '';
      const userFolder = `${safeFirst}_${safeLast}_${dto.PatientId || 'new'}`;

      // ------------------------------
      // 1️⃣ FILE UPLOAD (multipart)
      // ------------------------------
      if (file) {
        console.log('📸 Uploading file to R2:', file.originalname);

        imageUrl = await this.r2Service.uploadFile(
          file,
          'patients',
          userFolder,
        );
      }

      // ------------------------------
      // 2️⃣ BASE64 → R2
      // ------------------------------
      else if (dto.profileImageUrl?.startsWith('data:image')) {
        console.log('📸 Base64 image detected');

        const base64Data = dto.profileImageUrl.split(',')[1];
        if (!base64Data) throw new BadRequestException('Invalid base64 format');

        const buffer = Buffer.from(base64Data, 'base64');

        const fakeFile: Express.Multer.File = {
          buffer,
          originalname: `${Date.now()}.jpg`,
          mimetype: 'image/jpeg',
          fieldname: 'file',
          size: buffer.length,

          // ✔️ REQUIRED string placeholders
          destination: '',
          filename: '',
          path: '',

          encoding: '7bit',
          stream: undefined as any,
        };

        imageUrl = await this.r2Service.uploadFile(
          fakeFile,
          'patients',
          userFolder,
        );
      }

      // ------------------------------
      // 3️⃣ Save in DB
      // ------------------------------
      return this.patientcareService.upsertPatient(dto, imageUrl, CreatedBy);
    } catch (err) {
      console.error('❌ Patient Upload Error:', err);
      throw new InternalServerErrorException(err);
    }
  }

  //Get All patient
  @Get('getallpatientdetail')
  async getAllPatients(
    @Query('organizationId') organizationId: number,
    @Query('hospitalId') hospitalId: number,
    @Query('search') search?: string,
    @Query('city') city?: string,
    @Query('tagPatientId') tagPatientId?: number,
    @Query('gender') gender?: string,
    @Query('minAge') minAge?: string,
    @Query('maxAge') maxAge?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.patientcareService.getPatients({
      organizationId: Number(organizationId),
      hospitalId,
      search,
      city,
      gender,
      tagPatientId: tagPatientId ? Number(tagPatientId) : undefined,
      minAge: minAge ? Number(minAge) : undefined,
      maxAge: maxAge ? Number(maxAge) : undefined,
      page: Number(page),
      limit: Number(limit),
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
  getAlldoctorrole(@Req() req: any) {
    return this.patientcareService.getAlldoctoRole(req);
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
      TagPatientId,
      gender, // lowercase
      GenderName, // uppercase
      SpecializationId,
      consultationStatus,
      acuity,
      search,
      appointmentDate,
      appointmentDateFrom,
      appointmentDateTo,
      minAge, // camelCase
      maxAge,
      minage, // lowercase
      maxage,
      page = 1,
      limit = 10,
    } = query;

    return this.patientcareService.searchAppointments({
      hospitalId: Number(hospitalId),
      DoctorId: Number(DoctorId),
      status,
      visitTypeId: Number(visitTypeId),
      TagPatientId: Number(TagPatientId),
      GenderName: gender || GenderName, // normalize
      SpecializationId: Number(SpecializationId),
      consultationStatus,
      acuity,
      search,
      appointmentDate,
      appointmentDateFrom,
      appointmentDateTo,
      minage: Number(minAge || minage), // normalize
      maxage: Number(maxAge || maxage), // normalize
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

  @Get('Patientappointmentcasesheet/:appointmentId')
  async getConsultationByAppointmentId(
    @Param('appointmentId', ParseIntPipe) appointmentId: number,
  ) {
    return this.patientcareService.getConsultationByAppointmentId(
      appointmentId,
    );
  }

  // create cheif complaint
  @Patch('addupdatechiefcomplaint')
  async createChiefComplaint(@Body() dto: CreateChiefComplaintDto) {
    return this.patientcareService.createChiefComplaint(dto);
  }

  @Get('Getchiefcomplaint')
  async getAllChiefComplaint() {
    return this.patientcareService.getAllChiefComplaint();
  }

  //add investigation
  @Patch('addupdateInvestigationSubType')
  async addOrUpdateInvestigationSubType(
    @Body() dto: CreateInvestigationSubTypeDto,
    @CurrentUser() @Req() req: any,
  ) {
    const userId = Number(req.user?.UserId || 1);
    return this.patientcareService.addOrUpdateSubtype(dto, userId);
  }

  // get all investigation
  @Get('GetInvestigationMasterData')
  async getInvestigationMasterData() {
    return this.patientcareService.getInvestigationMasterData();
  }

  // add  all diagnosis
  @Patch('addupdatediagnosis')
  async addOrUpdateDiagnosis(@Body() dto: CreateDiagnosisDto) {
    console.log('Received DTO:', dto); // 👈 Add this line

    return this.patientcareService.addOrUpdateDiagnosis(dto);
  }

  // get all diagnosis
  @Get('getAllDiagnosis')
  getAllDiagnosis() {
    return this.patientcareService.getAllDiagnosis();
  }

  //create medicine
  @Patch('addupdateMedicine')
  async addOrUpdateMedicine(@Body() dto: CreateMedicineDto) {
    return this.patientcareService.addOrUpdateMedicine(dto);
  }

  // get all medicine
  @Get('getAllMedicine')
  getAllMedicine() {
    return this.patientcareService.getAllMedicine();
  }

  //Get All Patient Appointment
  @Get('getPatientAppointment/:patientId')
  async getAppointmentsForPatient(
    @Param('patientId', ParseIntPipe) patientId: number,
  ) {
    return this.patientcareService.getPatientAppointment(patientId);
  }

  //add procedure
  @Patch('addupdateprocedure')
  async addOrUpdateProcedure(
    @Body() dto: ConsultationProcedureDto,
    @CurrentUser() @Req() req: any,
  ) {
    const userId = Number(req.user?.UserId || 1);
    console.log('Received Body:', dto);

    return this.patientcareService.addOrUpdateProcedure(dto, userId);
  }
  @Get('getmedicalhistory')
  getmedicalhistory() {
    return this.patientcareService.getmedicalhistory();
  }
  //get procedure
  @Get('getprocedure')
  async getProcedures() {
    return this.patientcareService.getAllConsultationProcedures();
  }

  @Get('getInvestigationType')
  async getInvestigationType() {
    return this.patientcareService.getInvestigationType();
  }

  @Patch('addupdatemedicalhistory')
  async addupdatemedicalhistory(
    @Body() body: { MedicalHistoryName: string },
    @Query('MedicalhistoryId') MedicalhistoryId?: number, // Or however you're passing it
  ) {
    console.log('Received Body:', body);
    return this.patientcareService.addupdatemedicalhistory(
      body.MedicalHistoryName,
      MedicalhistoryId,
    );
  }

  // get all diagnosis by specialization id
  // @Get('specialization/:specializationId')
  // async getBySpecialization(
  //   @Param('specializationId', ParseIntPipe) specializationId: number,
  // ) {
  //   return this.diagnosisService.getDiagnosesBySpecialization(specializationId);
  // }

  //Delete End point
  //Medication
  @Patch('deleteMedicine/:MedicineId')
  async deleteMedicine(@Param('MedicineId') MedicineId: number) {
    return this.patientcareService.deleteMedicine(Number(MedicineId));
  }

  // cheif complaint
  @Patch('deleteChiefComplaintTag/:ChiefComplaintTagId')
  async deleteChiefComplaint(
    @Param('ChiefComplaintTagId') ChiefComplaintTagId: number,
  ) {
    return this.patientcareService.deleteChiefComplaint(
      Number(ChiefComplaintTagId),
    );
  }

  //Investigation
  @Patch('deleteInvestigationsubType/:InvestigationsubTypeId')
  async deleteInvestigation(
    @Param('InvestigationsubTypeId') InvestigationsubTypeId: number,
  ) {
    return this.patientcareService.deleteInvestigation(
      Number(InvestigationsubTypeId),
    );
  }

  //Diagonasis
  @Patch('deleteDiagonasis/:DiagnosisId')
  async deleteDiagonasis(@Param('DiagnosisId') DiagnosisId: number) {
    return this.patientcareService.deleteDiagonasis(Number(DiagnosisId));
  }

  //PROCEDURE
  @Patch('deleteprocedure/:ProcedureId')
  async deleteProcedure(@Param('ProcedureId') ProcedureId: number) {
    return this.patientcareService.deleteProcedure(Number(ProcedureId));
  }

  //deletemedical history
  @Patch('deleteMedicalHistory/:MedicalHistoryId')
  async deletemedicalhistory(
    @Param('MedicalHistoryId') MedicalHistoryId: number,
  ) {
    return this.patientcareService.deletemedicalhistory(
      Number(MedicalHistoryId),
    );
  }

  @Get('getPatientMedications/:patientId')
  async getPatientMedications(
    @Param('patientId', ParseIntPipe) patientId: number,
  ) {
    return this.patientcareService.getPatientMedications(patientId);
  }

  @Post(':id/start')
  async startConsultation(
    @Param('id') id: string,
    @Body() body: ConsultationActionDto,
  ) {
    const appointmentId = Number(id);
    if (isNaN(appointmentId)) {
      throw new HttpException('Invalid Appointment ID', HttpStatus.BAD_REQUEST);
    }

    const result = await this.ManageAppointment.startConsultation(
      appointmentId,
      Number(body.userId),
    );

    return {
      message: 'Consultation started',
      status: 'success',
      appointment: result,
    };
  }

  // 👉 COMPLETE consultation
  @Post(':appointmentId/complete')
  async completeConsultation(
    @Param('appointmentId') appointmentId: string,
    @Body('consultationId') consultationId: string,
    @Req() req,
  ) {
    if (isNaN(Number(appointmentId))) {
      throw new HttpException('Invalid Appointment ID', HttpStatus.BAD_REQUEST);
    }

    if (isNaN(Number(consultationId))) {
      throw new HttpException(
        'Invalid Consultation ID',
        HttpStatus.BAD_REQUEST,
      );
    }

    const userId = req.user?.UserId;

    return this.ManageAppointment.completeConsultation(
      Number(appointmentId),
      Number(consultationId),
      Number(userId),
    );
  }

  // 👉 MARK INCOMPLETE
  @Post(':appointmentId/incomplete')
  async markIncomplete(
    @Param('appointmentId') appointmentId: number,
    @Body('consultationId') consultationId: number,
    @Req() req,
  ) {
    const userId = req.user?.UserId;

    return this.ManageAppointment.markIncomplete(
      appointmentId,
      consultationId,
      userId,
    );
  }
}
