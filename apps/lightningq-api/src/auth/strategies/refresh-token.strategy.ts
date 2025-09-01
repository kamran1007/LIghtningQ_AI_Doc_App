// import { Inject, Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
// import jwtConfig from '../config/jwt.config';
// import type { ConfigType } from '@nestjs/config';
// import type { AuthJwtPayload } from '../types/auth-jwtPayload';
// import { AuthService } from '../auth.service';
// import refreshConfig from '../config/refresh.config';
// import { Request } from 'express';

// @Injectable()
// export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
//   constructor(
//     @Inject(refreshConfig.KEY)
//     private refreshTokenConfig: ConfigType<typeof refreshConfig>,
//     private authService: AuthService,
//   ) {
//     const secret = refreshTokenConfig.secret;
//     if (!secret) {
//       throw new Error('Refresh token secret is not defined in configuration');
//     }

//     const options: StrategyOptionsWithRequest = {
//       jwtFromRequest: ExtractJwt.fromBodyField('refresh'),
//       secretOrKey: secret, // ✅ Now it's guaranteed to be defined
//       ignoreExpiration: false,
//       passReqToCallback: true,
//     };

//     super(options);
//   }

//   validate(req: Request, payload: AuthJwtPayload) {
//     const userId = payload.sub;
//     const refreshToken = req.body.refresh;

//     return this.authService.validateRefreshToken(userId,refreshToken);
//   }
// }


import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import refreshConfig from '../config/refresh.config';
import type { ConfigType } from '@nestjs/config';
import type { AuthJwtPayload } from '../types/auth-jwtPayload';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor(
    @Inject(refreshConfig.KEY) private readonly refreshTokenConfig: ConfigType<typeof refreshConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies?.['refresh_token'], // ✅ HTTP-only cookie
      ]),
      secretOrKey: refreshTokenConfig.secret,
      passReqToCallback: true,
    } as StrategyOptionsWithRequest); // <-- Cast here
  }

  async validate(req: Request, payload: AuthJwtPayload) {
    const refreshToken = req.cookies['refresh_token'];
    const userId = payload.sub;
    return this.authService.validateRefreshToken(userId, refreshToken);
  }
}
