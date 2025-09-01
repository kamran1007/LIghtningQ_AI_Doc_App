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
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { AuthService, setAuthCookies } from './auth.service';
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
import type { Express, Response } from 'express';
import { ro } from 'date-fns/locale';
import { PassThrough } from 'stream';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const response = await this.authService.login(
      req.user.UserId,
      req.user.Email,
      req.user.firstName,
      req.user.lastName,
      req.user.RoleId,
      req.user.organizationId,
    );

    // 🔹 set refresh token in cookie
    setAuthCookies(res, response.refreshToken);


    console.log('Cookie set for login:', response.refreshToken);

    return {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      user: {
        UserId: response.UserId,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        roleId: response.roleId,
        organizationId: response.organizationId,
      },
    };
  }

  // @UseGuards(JwtAuthGuard)
  @Get('protected')
  getAll(@Request() req) {
    const userData = req.user;

    // find the matching access record
    const matchingAccess =
      Array.isArray(userData?.AdminAccess) && userData.AdminAccess.length > 0
        ? userData.AdminAccess.find(
            (access) => access.roleId === userData.roleId,
          )
        : null;

    // fallback role name
    const roleName =
      matchingAccess?.role?.Rolename || (userData.role?.[0]?.RoleName ?? null);

    return {
      message: 'This is a protected route',
      user: {
        UserId: userData.UserId,
        title: userData.Prefix,
        imageUrl: userData.imageUrl,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        mobile: userData.mobile,
        dateOfBirth: userData.dateOfBirth,
        gender: userData.gender,
        isActive: userData.isActive,
        roleId: userData.roleId,
        RoleName: userData.role.Rolename || null,
        OrganizationId: userData.organizationId,
        AssignHospital: userData.AdminAccess,
        role: roleName || null, // ✅ dynamically picked from AdminAccess

        SpecializationId: userData.SpecializationId,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      },
      include: {
        role: userData.role,
        AdminAccess: userData.AdminAccess,
      },
    };
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refreshToken(@Request() req, @Res() res: Response) {
    const { UserId, email, organizationId, roleId } = req.user;
    console.log('Request work', req.user);
    const { accessToken, refreshToken } = await this.authService.refreshToken(
      UserId,
      email,
      organizationId,
      roleId,
    );

    // 🔹 Set rotated refresh token in cookie
    res.cookie('refresh_token', refreshToken, {
      httpOnly: false,
      secure: false, // dev: false, prod: true
      sameSite: 'lax', // dev: 'lax' is fine for same-origin proxy
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return res.json({ accessToken });
  }

  //update profile
  @Patch('Updateprofile')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Make sure this folder exists
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  updateProfile(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateProfileDto,
  ) {
    if (file) {
      dto.imageUrl = `/uploads/${file.filename}`; // save local path
    }
    return this.authService.updateProfile(user.UserId, dto);
  }
  //change password
  @Patch('changepassword')
  changePassword(@CurrentUser() user: any, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(
      user.UserId,
      dto.currentPassword,
      dto.newPassword,
    );
  }

  // @UseGuards(JwtAuthGuard) // ✅ Use this instead of LocalAuthGuard
  @Post('logout')
  logout(@Request() req) {
    console.log('User in request:', req.user);
    return this.authService.logout(req.user.UserId);
  }
}
