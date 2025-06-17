import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BulkUpdateDoctorSlotDto } from 'src/manage_hospital/dto/BulkUpdateDoctorSlotDto';
import { CancelSlotDto } from 'src/manage_hospital/dto/CancelSlotDto';
import { CreateDoctorSlotDto } from 'src/manage_hospital/dto/create-doctor-slot.dto';
import { CreateHospitalDto } from 'src/manage_hospital/dto/create_hospital.dto';
import { CreateUserDto } from 'src/manage_hospital/dto/create_user.dto';
import { UpdateDoctorSlotDto } from 'src/manage_hospital/dto/update-doctor-slot.dto';
import { UpdateHospitalDto } from 'src/manage_hospital/dto/update_hospital.dto';
import { ManageHospitalService } from 'src/manage_hospital/manage_hospital.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly ManageHospitalService: ManageHospitalService,
    private readonly userService: UserService,
  ) {}

  // Add hospital
  async CreateHospital(dto: CreateHospitalDto, userId: number) {
    const Createhospital = await this.ManageHospitalService.CreateHospital(
      dto,
      userId,
    );
    return {
      message: 'Hospital has been added',
      return: Createhospital,
    };
  }

  //Get hospital list
  async getHospitals(pageNumber: number, organizationId: number) {
    const GetAllHospital = await this.ManageHospitalService.getAllhospital(
      pageNumber,
      organizationId,
    );
    return {
      message: 'Successfully Fetch',
      return: GetAllHospital,
    };
  }

  //Update hospital list
  async updateHospital(id: number, dto: UpdateHospitalDto, userId: any) {
    const UpdatedHospital = await this.ManageHospitalService.UpdateHospital(
      id,
      dto,
      userId,
    );
    return {
      message: 'Successfully updated',
      return: UpdatedHospital,
    };
  }

  //get organization
  async getOrganization(organizationId: number) {
    const GetOrganization =
      await this.ManageHospitalService.getOrganization(organizationId);
    return {
      message: 'Successfully Fetch',
      return: GetOrganization,
    };
  }

  async createUserWithHospitals(
    dto: CreateUserDto,
    files: {
      profileImagePath: string;
      signaturePath: string;
    },
    createdById: number, // ✅ third argument
  ) {
    dto;
    const user = await this.userService.findByEmail(dto.email);
    if (user) throw new ConflictException('User already exists!');
    const CreateUser = await this.ManageHospitalService.createUserWithHospitals(
      dto,
      files,
      createdById,
    );
    return {
      message: 'User has been added',
      return: CreateUser,
    };
  }
  //UPDATE
  async updateUserWithHospitals(userId: number, dto: CreateUserDto) {
    dto;

    const CreateUser = await this.ManageHospitalService.updateUserWithHospitals(
      userId,
      dto,
    );
    return {
      message: 'Update successfully',
      return: CreateUser,
    };
  }
  //GET
  async getAllUsers(data: {
    page: number;
    limit: number;
    search: string | undefined;
    organizationId: number | undefined;
  }) {
    const getalluser = await this.ManageHospitalService.getAllUsers(data);
    return {
      message: 'Fetch successfully',
      return: getalluser,
    };
  }

  async getUserRole(organizationId: number) {
    const GetUserRole =
      await this.ManageHospitalService.getUserRole(organizationId);
    return {
      message: 'Successfully Fetch',
      return: GetUserRole,
    };
  }

  async UserSpecialization(organizationId: number) {
    const GetUserSpecialization =
      await this.ManageHospitalService.UserSpecialization(organizationId);
    return {
      message: 'Successfully Fetch',
      return: GetUserSpecialization,
    };
  }

  //ACTIVATE/DEACTIVATE
  async deactivateUser(ID: number, deletedById: any) {
    const GetAllHospital = await this.ManageHospitalService.deactivateUser(
      ID,
      deletedById,
    );
    return {
      message: 'USER DEACTIVATE SUCCESSFULLY',
      return: GetAllHospital,
    };
  }

  async activateUser(ID: number) {
    const GetAllHospital = await this.ManageHospitalService.activateUser(ID);
    return {
      message: 'USER ACTIVATED SUCCESSFULLY',
      return: GetAllHospital,
    };
  }

  async createDoctorSlots(dto: CreateDoctorSlotDto, createdById: any) {
    const createDoctorSlots =
      await this.ManageHospitalService.createDoctorSlots(dto, createdById);
    return {
      message: 'Doctor slots have been added',
      return: createDoctorSlots,
    };
  }

  async cancelDoctorSlots(dto: CancelSlotDto, cancelledBy: any) {
    const createDoctorSlots =
      await this.ManageHospitalService.cancelDoctorSlots(dto, cancelledBy);
    return {
      message: 'Doctor slots have been canceled',
      return: createDoctorSlots,
    };
  }

  async updateDoctorSlotsBulk(dto: BulkUpdateDoctorSlotDto, updatedById: any) {
    const createDoctorSlots =
      await this.ManageHospitalService.updateDoctorSlotsBulk(dto, updatedById);
    return {
      message: 'Doctor slots have been updated',
      return: createDoctorSlots,
    };
  }

  async updateDoctorSlot(dto: UpdateDoctorSlotDto, updatedById: any) {
    const createDoctorSlots =
      await this.ManageHospitalService.updateDoctorSlot(dto, updatedById);
    return {
      message: 'Doctor slot have been updated',
      return: createDoctorSlots,
    };
  }
  async getDoctorSlotsByDay({
    userId,
    hospitalId,
    days,
  }: {
    userId: number;
    hospitalId?: number;
    days?: string;
  }) {
    const doctorSlots = await this.ManageHospitalService.getDoctorSlotsByDay({
      userId: Number(userId),
      hospitalId: hospitalId !== undefined ? Number(hospitalId) : undefined,
      day: days !== undefined ? String(days) : undefined,
    });
  
    return {
      message: 'Doctor slots fetched successfully',
      return: doctorSlots,
    };
  }
  
}
