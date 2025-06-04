import { Injectable } from '@nestjs/common';
import { CreateHospitalDto } from 'src/manage_hospital/dto/create_hospital.dto';
import { UpdateHospitalDto } from 'src/manage_hospital/dto/update_hospital.dto';
import { ManageHospitalService } from 'src/manage_hospital/manage_hospital.service';

@Injectable()
export class AdminService {
  constructor(private readonly ManageHospitalService: ManageHospitalService) {}

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
  async getHospitals(pageNumber: number,organizationId: number) {
    const GetAllHospital =
      await this.ManageHospitalService.getAllhospital(pageNumber,organizationId);
    return {
      message: 'Successfully Fetch',
      return: GetAllHospital,
    };
  }

  //Update hospital list
  async updateHospital(id: number, dto: UpdateHospitalDto, userId: any) {
    const UpdatedHospital = await this.ManageHospitalService.UpdateHospital(id, dto, userId)
    return{
      message: 'Successfully updated',
      return:  UpdatedHospital
    }
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
}
