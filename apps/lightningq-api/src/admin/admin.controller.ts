import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CreateHospitalDto } from 'src/manage_hospital/dto/create_hospital.dto';
import { AdminService } from './admin.service';
import { UpdateHospitalDto } from 'src/manage_hospital/dto/update_hospital.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import {
  CreateUserDto,
  UserBranchDto,
  UserOrganizationDto,
} from 'src/manage_hospital/dto/create_user.dto';
import { ParseJsonPipe } from 'src/pipe/parse-json.pipe';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDoctorSlotDto } from 'src/manage_hospital/dto/create-doctor-slot.dto';
import { CancelSlotDto } from 'src/manage_hospital/dto/CancelSlotDto';
import { UpdateDoctorSlotDto } from 'src/manage_hospital/dto/update-doctor-slot.dto';
import { BulkUpdateDoctorSlotDto } from 'src/manage_hospital/dto/BulkUpdateDoctorSlotDto';
import { CreateDoctorCostingDto } from 'src/manage_hospital/dto/create-doctor-costing.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminservice: AdminService,
    private readonly prisma: PrismaService,
  ) {}

  // Create hospital
  @Post('AddHospital')
  async addHospital(@Request() req, @Body() dto: CreateHospitalDto) {
    try {
      const userId = req.user?.UserId;
      if (!userId) {
        throw new Error('User ID is missing from request.');
      }
      return this.adminservice.CreateHospital(dto, userId);
    } catch (error) {
      console.error('Server error:', error);
      throw new InternalServerErrorException('Failed to add hospital');
    }

    // Pass separately
  }

  // get allhospital
  @Get('GetHospitals')
  async getHospitals(@Request() req, @Query('page') page: string = '1') {
    const pageNumber = parseInt(page, 10) || 1;
    const organizationId = req.user.organizationId;
    return this.adminservice.getHospitals(pageNumber, organizationId);
  }

  //Update hospital
  @Patch('UpdateHospital/:id')
  async updateHospital(
    @Param('id') id: string,
    @Body() dto: UpdateHospitalDto,
    @Request() req,
  ) {
    const userId = req.UserId; // assumes you're using auth middleware
    return this.adminservice.updateHospital(+id, dto, userId);
  }

  // get allhospital
  @Get('GetOrganization')
  async getorganization(@Request() req) {
    const organizationId = req.user.organizationId;
    return this.adminservice.getOrganization(organizationId);
  }

  //Add user
  // @Post('AddUser')
  // @UseInterceptors(
  //   AnyFilesInterceptor({
  //     storage: diskStorage({
  //       destination: './uploads/users',
  //       filename: (req, file, cb) => {
  //         const uniqueSuffix =
  //           Date.now() + '-' + Math.round(Math.random() * 1e9);
  //         cb(
  //           null,
  //           `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
  //         );
  //       },
  //     }),
  //   }),
  // )
  // async addUser(
  //   @Request() req,
  //   @UploadedFiles() files: Array<Express.Multer.File>,
  //   @Body('UserBranchesArray', ParseJsonPipe) userBranches: UserBranchDto[],
  //   @Body('UserOrganizationArray', ParseJsonPipe)
  //   userOrgs: UserOrganizationDto[],
  //   @Body() dto: CreateUserDto,
  // ) {
  //   const userId = req.user?.UserId;

  //   // Fix here: replace `body` with `dto`
  //   dto.UserBranchesArray = userBranches;
  //   dto.UserOrganizationArray = userOrgs;

  //   const profileImage = files?.find(
  //     (file) => file.fieldname === 'profileImage',
  //   );
  //   const signature = files?.find((file) => file.fieldname === 'signature');

  //   return this.adminservice.createUserWithHospitals(
  //     dto,
  //     {
  //       profileImagePath: profileImage?.path ?? '',
  //       signaturePath: signature?.path ?? '',
  //     },
  //     userId,
  //   );
  // }

  @Post('AddUser')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dest = join(__dirname, '..', '..', 'uploads', 'users'); // resolves to /apps/api/uploads/users
          cb(null, dest);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const userName = req.body.firstName?.replace(/\s+/g, '_') || 'user'; // fallback to 'user' if firstName not provided

          const cleanedFieldName = file.fieldname.replace(/\s+/g, '_');
          const ext = extname(file.originalname);

          const newFileName = `${cleanedFieldName}-${userName}-${uniqueSuffix}${ext}`;
          cb(null, newFileName);
        },
      }),
    }),
  )
  async addUser(
    @Request() req,
    @UploadedFiles() files: Array<Express.Multer.File>,

    @Body('UserBranchesArray', ParseJsonPipe) userBranches: UserBranchDto[],
    @Body('UserOrganizationArray', ParseJsonPipe)
    userOrgs: UserOrganizationDto[],

    @Body('organizationId', ParseIntPipe) organizationId: number,
    @Body('SpecializationId', ParseIntPipe) specializationId: number,
    @Body('roleId', ParseIntPipe) roleId: number,

    @Body('Prefix') Prefix: string,
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
    @Body('dateOfBirth') dateOfBirth: string,
    @Body('gender') gender: string,
    @Body('mobile') mobile: string,
    @Body('email') email: string,
    @Body('Experience') Experience?: string,
    @Body('Employee_ID') Employee_ID?: string,
    @Body('passwordHash') passwordHash?: string,
  ) {
    const userId = req.user?.UserId;

    const dto: CreateUserDto = {
      Prefix,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      mobile,
      email,
      Experience,
      Employee_ID,
      passwordHash,
      SpecializationId: specializationId,
      organizationId,
      roleId,
      UserBranchesArray: userBranches,
      UserOrganizationArray: userOrgs,
      imageUrl: '', // This will be filled from files below
      SignatureOfUser: '', // This too
    };

    const profileImage = files?.find((f) => f.fieldname === 'imageUrl');
    const signature = files?.find((f) => f.fieldname === 'SignatureOfUser');
    console.log(
      'Received files:',
      files.map((f) => ({ name: f.originalname, field: f.fieldname })),
    );
    console.log('User created with signature:', dto.SignatureOfUser);

    console.log('Uploaded files:', files);
    if (profileImage) dto.imageUrl = `/uploads/users/${profileImage.filename}`;
    if (signature) dto.SignatureOfUser = `/uploads/users/${signature.filename}`;

    return this.adminservice.createUserWithHospitals(
      dto,
      {
        profileImagePath: profileImage
          ? `/uploads/users/${profileImage.filename}`
          : '',
        signaturePath: signature ? `/uploads/users/${signature.filename}` : '',
      },
      userId,
    );
  }

  //UPDATE
  @Patch('UpdateUser/:id')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dest = join(__dirname, '..', '..', 'uploads', 'users');
          cb(null, dest);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const userName = req.body.firstName?.replace(/\s+/g, '_') || 'user';
          const cleanedFieldName = file.fieldname.replace(/\s+/g, '_');
          const ext = extname(file.originalname);
          const newFileName = `${cleanedFieldName}-${userName}-${uniqueSuffix}${ext}`;
          cb(null, newFileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname || file.size === 0) {
          cb(null, false); // ❌ Reject this file
        } else {
          cb(null, true); // ✅ Accept
        }
      },
    }),
  )
  async updateUser(
    @Request() req,
    @Param('id', ParseIntPipe) userId: number,
    @UploadedFiles() files: Array<Express.Multer.File>,

    @Body('UserBranchesArray', ParseJsonPipe) userBranches: UserBranchDto[],
    @Body('UserOrganizationArray', ParseJsonPipe)
    userOrgs: UserOrganizationDto[],

    @Body('organizationId', ParseIntPipe) organizationId: number,
    @Body('SpecializationId', ParseIntPipe) specializationId: number,
    @Body('roleId', ParseIntPipe) roleId: number,

    @Body('Prefix') Prefix: string,
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
    @Body('dateOfBirth') dateOfBirth: string,
    @Body('gender') gender: string,
    @Body('mobile') mobile: string,
    @Body('email') email: string,
    @Body('Experience') Experience?: string,
    @Body('Employee_ID') Employee_ID?: string,
  ) {
    const updatedById = req.user?.UserId;
    const existingUser = await this.prisma.user.findUnique({
      where: { UserId: userId },
    });
    if (!existingUser) throw new NotFoundException('User not found');

    // ✅ Extract image files
    // const profileImage = files?.find((f) => f.fieldname === 'imageUrl');
    // const signature = files?.find((f) => f.fieldname === 'SignatureOfUser');

    const profileImage = files?.find(
      (f) =>
        f.fieldname === 'imageUrl' &&
        f.originalname &&
        f.originalname.trim() !== '',
    );
    const signature = files?.find(
      (f) => f.fieldname === 'SignatureOfUser' && f.size > 0,
    );

    const dto: CreateUserDto = {
      Prefix,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      mobile,
      email,
      Experience,
      Employee_ID,
      SpecializationId: specializationId,
      organizationId,
      roleId,
      UserBranchesArray: userBranches,
      UserOrganizationArray: userOrgs,
      // imageUrl: '',
      // SignatureOfUser: '',
      imageUrl: profileImage
        ? `/uploads/users/${profileImage.filename}`
        : existingUser.imageUrl, // retain old
      SignatureOfUser: signature
        ? `/uploads/users/${signature.filename}`
        : existingUser.SignatureOfUser, // retain old
      updatedById,
    };

    // if (profileImage) dto.imageUrl = `/uploads/users/${profileImage.filename}`;
    // if (signature) dto.SignatureOfUser = `/uploads/users/${signature.filename}`;

    return this.adminservice.updateUserWithHospitals(userId, dto);
  }

  //GET

  @Get('AllUsers')
  async getAllUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('organizationId') organizationId?: number,
  ) {
    return this.adminservice.getAllUsers({
      page: Number(page),
      limit: Number(limit),
      search,
      organizationId: organizationId ? Number(organizationId) : undefined,
    });
  }

  //ACTIVATE/DEACTIVATE

  @Patch('deactivate/:id')
  async deactivateUser(@Param('id') id: number, @Req() req) {
    const deletedById = req.user.UserId; // from JWT
    return this.adminservice.deactivateUser(+id, deletedById);
  }

  @Patch('activate/:id')
  async activateUser(@Param('id') id: number) {
    return this.adminservice.activateUser(+id);
  }

  @Get('getUserRole')
  async UserRole(@Request() req) {
    const organizationId = req.user.organizationId;
    return this.adminservice.getUserRole(organizationId);
  }
  @Get('getUserSpecialization')
  async UserSpecialization(@Request() req) {
    const organizationId = req.user.organizationId;
    return this.adminservice.UserSpecialization(organizationId);
  }

  //Create sots
  @Post('createtimeslot')
  async create(@Body() dto: CreateDoctorSlotDto, @Req() req: any) {
    const createdById = req.user?.UserId || 1; // Replace with real auth
    return this.adminservice.createDoctorSlots(dto, createdById);
  }
  //Update slots
  @Patch('updatetimeslot')
  async updateTimeSlot(@Body() dto: UpdateDoctorSlotDto, @Req() req: any) {
    const updatedById = req.user?.UserId || 1;
    return this.adminservice.updateDoctorSlot(dto, updatedById);
  }

  //bulk update slots
  @Patch('update-timeslots')
  async updateTimeSlots(@Body() dto: BulkUpdateDoctorSlotDto, @Req() req: any) {
    const updatedById = req.user?.UserId || 1;
    return this.adminservice.updateDoctorSlotsBulk(dto, updatedById);
  }

  //cancel slot
  @Patch('cancel-timeslots')
  async cancelTimeSlots(@Body() dto: CancelSlotDto, @Req() req: any) {
    const cancelledBy = req.user?.UserId || 1;
    return this.adminservice.cancelDoctorSlots(dto, cancelledBy);
  }

  //Get all slots
  @Get('getslots')
  async getDoctorSlots(
    @Query('userId') userId: number,
    @Query('hospitalId') hospitalId?: number,
    @Query('day') days?: string,
  ) {
    if (!userId) {
      throw new BadRequestException('userId is required.');
    }

    return this.adminservice.getDoctorSlotsByDay({ userId, hospitalId, days });
  }

  //costing for Doctor

  @Post('AddOrUpdateDoctorCosting')
  async createDoctorCosting(
    @Body() dto: CreateDoctorCostingDto,
    @Req() req: any,
  ) {
    const createdById = req.user?.UserId || 1; // Replace with real auth

    return this.adminservice.createCostingForDoctor(dto, createdById);
  }

  @Get('GetDoctorCosting/:doctorId')
  async getCosting(@Param('doctorId', ParseIntPipe) doctorId: number) {
    return this.adminservice.getByDoctorId(doctorId);
  }
}
