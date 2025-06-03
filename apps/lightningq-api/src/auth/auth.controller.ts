import {
  Controller,
  Post,
  Request,
  UseGuards,
  Req,
  Get,
  Patch,
  Body,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { Public } from './decorator/public.decorator';
import { ChangePasswordDto } from 'src/user/dto/changepassword.dto';
import { UpdateProfileDto } from 'src/user/dto/updateprofile.dto';
import { CurrentUser } from './decorator/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import type { Express } from 'express'; // ✅ Add this


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    // console.log('AuthController: req.user =', req.user);
    // return this.authService.login(req.user.Id, req.user.Email, req.user.Name);
    const resopnse = await this.authService.login(
      req.user.Id,
      req.user.Email,
      req.user.firstName,
      req.user.lastName,
      req.user.RoleId, // Assuming Role is part of the user object
      req.user.organizationId
    );
    console.log('AuthController: resopnse =', resopnse);
    return resopnse;
  }
  // @UseGuards(JwtAuthGuard)
  @Get('protected')
  getAll(@Request() req) {
    const userData = req.user;
    return {
      message: 'This is a protected route',
      user: {
        id: userData.id,
        title: userData.title,
        imageUrl: userData.imageUrl,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        mobile: userData.mobile,
        dateOfBirth: userData.dateOfBirth,
        gender: userData.gender,
        isActive: userData.isActive,
        roleId: userData.roleId,
      },
    };
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refreshToken(@Request() req) {
    const { id, email, organizationId, roleId } = req.user;
  return this.authService.refreshToken(id, email, organizationId, roleId);
  }
  //update profile
  @Patch('Updateprofile')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', // Make sure this folder exists
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  updateProfile(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateProfileDto,
  ) {
    if (file) {
      dto.imageUrl = `/uploads/${file.filename}`; // save local path
    }
    return this.authService.updateProfile(user.id, dto);
  }
  //change password
  @Patch('changepassword')
  changePassword(
    @CurrentUser() user: any,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(
      user.id,
      dto.currentPassword,
      dto.newPassword,
    );
  }

  // @UseGuards(JwtAuthGuard) // ✅ Use this instead of LocalAuthGuard
  @Post('logout')
  logout(@Request() req) {
    console.log('User in request:', req.user);
    return this.authService.logout(req.user.id);
  }
}


