// import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
// import { hash, verify } from 'argon2';
// import { UserService } from 'src/user/user.service';
// import { AuthJwtPayload } from './types/auth-jwtPayload';
// import { JwtService } from '@nestjs/jwt';
// // import refreshConfig from './config/refresh.config';
// import type { ConfigType } from '@nestjs/config'; // ✅ FIXED
// import refreshConfig from './config/refresh.config';
// import jwtConfig from './config/jwt.config';
// import { UpdateProfileDto } from 'src/user/dto/updateprofile.dto';

// @Injectable()
// export class AuthService {
//   constructor(
//     private readonly userService: UserService,
//     private readonly jwtService: JwtService,
//     @Inject(jwtConfig.KEY)
//     private accessTokenConfig: ConfigType<typeof jwtConfig>,
//     @Inject(refreshConfig.KEY)
//     private refreshTokenConfig: ConfigType<typeof refreshConfig>,
//   ) {}

//   async validateLocalUser(email: string, password: string) {
//     const user = await this.userService.findByEmail(email);
//     if (!user) throw new UnauthorizedException('User not found!');

//     const isPasswordMatched = await verify(user.passwordHash, password);
//     if (!isPasswordMatched) {
//       throw new UnauthorizedException('Invalid credentials!');
//     }

//     return {
//       UserId: user.UserId,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       Email: user.email,
//       RoleId: user.roleId,
//       organizationId: user.organizationId,
//     };
//   }

//   async login(
//     userId: number,
//     email: string,
//     firstName: string,
//     lastName: string,
//     roleId: number,
//     organizationId: number,
//   ) {
//     const { accessToken, refreshToken } = await this.generateTokens(
//       userId,
//       email,
//       organizationId,
//       roleId,
//     );
//     const hashedRT = await hash(refreshToken);
//     console.log('hashed refresh token', hashedRT);
//     const updatedUser = await this.userService.updateHashedRefreshToken(
//       userId,
//       hashedRT,
//     );
//     console.log('Updated user with hashed RT:', updatedUser);
//     return {
//       UserId: userId,
//       email,
//       firstName,
//       lastName,
//       roleId,
//       organizationId,
//       accessToken,
//       refreshToken,
//     };
//   }

//   async generateTokens(
//     userId: number,
//     email: string,
//     organizationId: number,
//     roleId: number,
//   ) {
//     const payload: AuthJwtPayload = {
//       sub: userId,
//       email,
//       organizationId,
//       roleId,
//     };

//     // const [accessToken, refreshToken] = await Promise.all([
//     //     this.jwtService.signAsync(payload),
//     //     this.jwtService.signAsync(payload, this.refreshTokenConfig),
//     //   ]);

//     const [accessToken, refreshToken] = await Promise.all([
//       this.jwtService.signAsync(payload, {
//         secret: this.accessTokenConfig.secret,
//         expiresIn: this.accessTokenConfig.signOptions?.expiresIn,
//       }),
//       this.jwtService.signAsync(payload, {
//         secret: this.refreshTokenConfig.secret,
//         expiresIn: this.refreshTokenConfig.expiresIn,
//       }),
//     ]);

//     return { accessToken, refreshToken };
//   }

//   async validateJwtUser(userId: number) {
//     const user = await this.userService.findOne(userId);
//     if (!user) throw new UnauthorizedException('User not found!');

//     return user;
//   }

//   async validateRefreshToken(userId: number, refreshToken: string) {
//   const user = await this.userService.findOne(userId);
//   if (!user?.refreshToken) {
//     throw new UnauthorizedException('No refresh token stored!');
//   }

//   // Make sure both are strings
//   if (typeof refreshToken !== 'string') {
//     throw new UnauthorizedException('Invalid refresh token format!');
//   }

//   const isValid = await verify(user?.refreshToken, refreshToken);
//   if (!isValid) throw new UnauthorizedException('Invalid refresh token!');

//   return { id: user.UserId };
// }

//   async refreshToken(
//     userId: number,
//     email: string,
//     organizationId: number,
//     roleId: number,
//   ) {
//     const { accessToken, refreshToken } = await this.generateTokens(
//       userId,
//       email,
//       organizationId,
//       roleId,
//     );
//     const hashedRT = await hash(refreshToken);
//     console.log('hashed refresh token', hashedRT);

//     const updatedUser = await this.userService.updateHashedRefreshToken(
//       userId,
//       hashedRT,
//     );
//     console.log('Updated user with hashed RT:', updatedUser);

//     return {
//       UserId: userId,
//       email,
//       roleId,
//       organizationId,
//       accessToken,
//       refreshToken,
//     };
//   }

//   async updateProfile(UserId: number, dto: UpdateProfileDto) {
//     console.log('userId:', UserId);
//     const updatedUser = await this.userService.updateUserProfile(UserId, dto);
//     return {
//       message: 'Profile updated successfully',
//       user: updatedUser,
//     };
//   }

//   async changePassword(
//     userId: number,
//     currentPassword: string,
//     newPassword: string,
//   ) {
//     const user = await this.userService.findOne(userId);
//     if (!user) throw new UnauthorizedException('User not found!');

//     // Ensure passwordHash is defined
//     if (!user.passwordHash) {
//       throw new UnauthorizedException('User does not have a password set!');
//     }

//     const isPasswordMatched = await verify(user.passwordHash, currentPassword);
//     if (!isPasswordMatched)
//       throw new UnauthorizedException('Current password is incorrect!');

//     const newHashedPassword = await hash(newPassword);
//     await this.userService.updatePassword(userId, newHashedPassword);

//     return { message: 'Password changed successfully' };
//   }

//   async logout(userId: number) {
//     return await this.userService.updateHashedRefreshToken(userId, null);
//   }
// }

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { UserService } from 'src/user/user.service';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { JwtService } from '@nestjs/jwt';
import type { ConfigType } from '@nestjs/config';
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
    if (!user.passwordHash)
      throw new UnauthorizedException('Invalid credentials!');

    const isPasswordMatched = await verify(user.passwordHash, password);
    if (!isPasswordMatched)
      throw new UnauthorizedException('Invalid credentials!');

    return {
      UserId: user.UserId,
      firstName: user.firstName,
      lastName: user.lastName,
      Email: user.email,
      RoleId: user.roleId,
      organizationId: user.organizationId,
    };
  }

  async generateTokens(userId: number, email: string, orgId: number, roleId: number) {
    const payload = { sub: userId, email, organizationId: orgId, roleId };

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

  async login(
    userId: number,
    email: string,
    firstName: string,
    lastName: string,
    roleId: number,
    organizationId: number,
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
      firstName,
      lastName,
      roleId,
      organizationId,
      accessToken,
      refreshToken,
    };
  }

  async validateJwtUser(userId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException('User not found!');
    return user;
  }

  // 🔒 THIS is the correct way to validate a hashed refresh token
  async validateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.userService.findOne(userId);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('No stored refresh token');
    }

    const isValid = await verify(user.refreshToken, refreshToken);
    if (!isValid) throw new UnauthorizedException('Invalid refresh token');

    // 🔑 make sure we pass UserId correctly
    const hashedRT = await hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRT);

    return { UserId: userId }; // <-- not `{ id: userId }`
  }

  // ♻️ Rotation: issue new pair and overwrite DB with new hash
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
    const updatedUser = await this.userService.updateUserProfile(UserId, dto);
    return { message: 'Profile updated successfully', user: updatedUser };
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException('User not found!');
    if (!user.passwordHash)
      throw new UnauthorizedException('User does not have a password set!');

    const ok = await verify(user.passwordHash, currentPassword);
    if (!ok) throw new UnauthorizedException('Current password is incorrect!');

    const newHash = await hash(newPassword);
    await this.userService.updatePassword(userId, newHash);
    return { message: 'Password changed successfully' };
  }

  async logout(userId: number) {
    // revoke by clearing hash
    return this.userService.updateHashedRefreshToken(userId, null);
  }
}


import { Response } from "express";

export const setAuthCookies = (res: Response, token: string) => {
  const isProd = process.env.NODE_ENV === "production";

  res.cookie("refresh_token", token, {
    httpOnly: true,
    secure: isProd,                // ✅ HTTPS only in prod
    sameSite: isProd ? "none" : "lax", // ✅ Safe on localhost
    path: "/",                     // ✅ send on all routes
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};