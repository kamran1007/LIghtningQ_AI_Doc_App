import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateHospitalDto } from 'src/manage_hospital/dto/create_hospital.dto';
import { CreateUserDto } from 'src/manage_hospital/dto/create_user.dto';
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
      signaturePath: string | undefined;
    },
    createdById: number, // ✅ third argument
  ) {dto
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
  async updateUserWithHospitals(
    userId: number,
    dto: CreateUserDto,

  ) {dto

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
  async getAllUsers(data: { page: number; limit: number; search: string | undefined; organizationId: number | undefined; }) {
    const getalluser = await this.ManageHospitalService.getAllUsers(data);
    return {
      message : 'Fetch successfully',
      return : getalluser,
    }
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
    const GetAllHospital = await this.ManageHospitalService.activateUser(
      ID,
    );
    return {
      message: 'USER ACTIVATED SUCCESSFULLY',
      return: GetAllHospital,
    };
  }

}
