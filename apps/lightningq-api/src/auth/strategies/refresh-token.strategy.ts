import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import jwtConfig from '../config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import type { AuthJwtPayload } from '../types/auth-jwtPayload';
import { AuthService } from '../auth.service';
import refreshConfig from '../config/refresh.config';
import { Request } from 'express';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor(
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
    private authService: AuthService,
  ) {
    const secret = refreshTokenConfig.secret;
    if (!secret) {
      throw new Error('Refresh token secret is not defined in configuration');
    }

    const options: StrategyOptionsWithRequest = {
      jwtFromRequest: ExtractJwt.fromBodyField('refresh'),
      secretOrKey: secret, // ✅ Now it's guaranteed to be defined
      ignoreExpiration: false,
      passReqToCallback: true,
    };

    super(options);
  }

  validate(req: Request, payload: AuthJwtPayload) {
    const userId = payload.sub;
    const refreshToken = req.body.refresh;

    return this.authService.validateRefreshToken(userId,refreshToken);
  }
}
