import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { UserService } from 'src/user/user.service';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { JwtService } from '@nestjs/jwt';
// import refreshConfig from './config/refresh.config';
import type { ConfigType } from '@nestjs/config'; // ✅ FIXED
import refreshConfig from './config/refresh.config';
import jwtConfig from './config/jwt.config';
import { UpdateProfileDto } from 'src/user/dto/updateprofile.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private accessTokenConfig: ConfigType<typeof jwtConfig>,
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
  ) {}

  async validateLocalUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found!');

    const isPasswordMatched = await verify(user.passwordHash, password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    return {
      UserId: user.UserId,
      firstName: user.firstName,
      lastName: user.lastName,
      Email: user.email,
      RoleId: user.roleId,
      organizationId: user.organizationId,
    };
  }

  async login(
    UserId: number,
    email: string,
    firstName: string,
    lastName: string,
    roleId: number,
    organizationId: number,
  ) {
    const { accessToken, refreshToken } = await this.generateTokens(
      UserId,
      email,
      organizationId,
      roleId,
    );

    const hashedRT = await hash(refreshToken);
    await this.userService.updateHashedRefreshToken(UserId, hashedRT);

    return {
      UserId: UserId,
      email,
      firstName,
      lastName,
      roleId,
      organizationId,
      accessToken,
      refreshToken,
    };
  }

  async generateTokens(
  userId: number,
  email: string,
  organizationId: number,
  roleId: number,
) {
  const payload: AuthJwtPayload = {
    sub: userId,
    email,
    organizationId,
    roleId,
  };

  // const [accessToken, refreshToken] = await Promise.all([
  //     this.jwtService.signAsync(payload),
  //     this.jwtService.signAsync(payload, this.refreshTokenConfig),
  //   ]);

  const [accessToken, refreshToken] = await Promise.all([
    this.jwtService.signAsync(payload, {
      secret: this.accessTokenConfig.secret,
      expiresIn: this.accessTokenConfig.signOptions?.expiresIn,
    }),
    this.jwtService.signAsync(payload, {
      secret: this.refreshTokenConfig.secret,
      expiresIn: this.refreshTokenConfig.expiresIn,
    }),
  ]);

  return { accessToken, refreshToken };
}


  async validateJwtUser(userId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException('User not found!');

    return user;
  }

  async validateRefreshToken(userId: number, refreshToken: string) {
    console.log('[validateRefreshToken] Called with userId:', userId);

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
    const currentUser = { id: user.UserId };
    return currentUser;
  }
  async refreshToken(
    userId: number,
    email: string,
    organizationId: number,
    roleId: number,
  ) {
    const { accessToken, refreshToken } = await this.generateTokens(
      userId,
      email,
      organizationId,
      roleId,
    );
    const hashedRT = await hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRT);

    return {
      UserId: userId,
      email,
      roleId,
      organizationId,
      accessToken,
      refreshToken,
    };
  }

  async updateProfile(UserId: number, dto: UpdateProfileDto) {
    console.log('userId:', UserId);
    const updatedUser = await this.userService.updateUserProfile(UserId, dto);
    return {
      message: 'Profile updated successfully',
      user: updatedUser,
    };
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException('User not found!');

    const isPasswordMatched = await verify(user.passwordHash, currentPassword);
    if (!isPasswordMatched)
      throw new UnauthorizedException('Current password is incorrect!');

    const newHashedPassword = await hash(newPassword);

    await this.userService.updatePassword(userId, newHashedPassword);
    return { message: 'Password changed successfully' };
  }

  async logout(userId: number) {
    return await this.userService.updateHashedRefreshToken(userId, null);
  }
}
