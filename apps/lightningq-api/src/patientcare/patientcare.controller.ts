import {
  BadRequestException,
  Body,
  Controller,
  Delete,
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
      // if (!dto.PatientId && !imageUrl) {
      //   throw new BadRequestException(
      //     'Patient image is required for new patient.',
      //   );
      // }

      return this.patientcareService.upsertPatient(dto, imageUrl, CreatedBy);
    } catch (err) {
      console.error('❌ Backend Error:', err);
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
      isConsultationcompleted,
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
      isConsultationcompleted,
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
  async getPatientMedications(@Param('patientId', ParseIntPipe) patientId: number) {
    return this.patientcareService.getPatientMedications(patientId);
  }
}
