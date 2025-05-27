import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { UserService } from 'src/user/user.service';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { JwtService } from '@nestjs/jwt';
// import refreshConfig from './config/refresh.config';
import type { ConfigType } from '@nestjs/config'; // ✅ FIXED
import refreshConfig from './config/refresh.config';
import { UpdateProfileDto } from 'src/user/dto/updateprofile.dto';

@Injectable()
export class AuthService {
  
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
  ) {}

  async validateLocalUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    // console.log('user',user);

    if (!user) throw new UnauthorizedException('User not found!');
    const isPasswordMatched = await verify(user.passwordHash, password);
    if (!isPasswordMatched)
      throw new UnauthorizedException('Invalid Credentials!');

    return { Id: user.id, firstName: user.firstName,lastName: user.lastName, Email: user.email ,Role: user.roleId};
  }

  async login(userId: number,Email: string, firstName: string, lastName: string,RoleID: number) {
    const { accessToken ,refreshToken} = await this.generateTokens(userId);
    const hashedRT = await hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId ,hashedRT);
    return {
      id: userId,
      Email: Email,
      Name: firstName,
      lastName: lastName,
      RoleID: RoleID, 
      accessToken,
      refreshToken,
    };
  }

  async generateTokens(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };
    const [accessToken,refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
  async validateJwtUser(userId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException('User not found!');
    const currentUser = { id: user.id, name: user, email: user.email , roleId: user.roleId};
    return currentUser;
  }

  async validateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException('User not found!');

    if (!user.hashedRefreshToken) {
      throw new UnauthorizedException('No refresh token set for user!');
    }
    const refreshTokenMatched = await verify(
      user.hashedRefreshToken,
      refreshToken,
    );

    if (!refreshTokenMatched)
      throw new UnauthorizedException('Invalid Refresh Token!');
    const currentUser = { id: user.id };
    return currentUser;
  }
  async refreshToken(userId: number, name: string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRT = await hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId,hashedRT);
    return {
      id: userId,
      name: name,
      accessToken,
      refreshToken,
    };
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    console.log('userId:', userId);
    const updatedUser = await this.userService.updateUserProfile(userId, dto);
    return {
      message: 'Profile updated successfully',
      user: updatedUser,
    };
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException('User not found!');
  
    const isPasswordMatched = await verify(user.passwordHash, currentPassword);
    if (!isPasswordMatched) throw new UnauthorizedException('Current password is incorrect!');
  
    const newHashedPassword = await hash(newPassword);
  
    await this.userService.updatePassword(userId, newHashedPassword);
    return { message: 'Password changed successfully' };
  }


  async logout(userId: number) {
    return await this.userService.updateHashedRefreshToken(userId, null);
  }
}
                                                                                   