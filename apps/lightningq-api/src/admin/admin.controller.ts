import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Request,
} from '@nestjs/common';
import { CreateHospitalDto } from 'src/manage_hospital/dto/create_hospital.dto';
import { AdminService } from './admin.service';
import { UpdateHospitalDto } from 'src/manage_hospital/dto/update_hospital.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminservice: AdminService) {}

  // Create hospital
  @Post('AddHospital')
  async addHospital(@Request() req, @Body() dto: CreateHospitalDto) {
    try {
      const userId = req.user?.id;
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
    return this.adminservice.getHospitals(pageNumber,organizationId);
  }

  //Update hospital
  @Patch('UpdateHospital/:id')
  async updateHospital(
    @Param('id') id: string,
    @Body() dto: UpdateHospitalDto,
    @Request() req,
  ) {
    const userId = req.user.id; // assumes you're using auth middleware
    return this.adminservice.updateHospital(+id, dto, userId);
  }

    // get allhospital
    @Get('GetOrganization')
    async getorganization(@Request() req) {
      const organizationId = req.user.organizationId;
      return this.adminservice.getOrganization(organizationId);
    }
}
