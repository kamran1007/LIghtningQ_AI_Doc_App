import { Controller, Post, Request, UseGuards, Req} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard.spec';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Public()
  @UseGuards(LocalAuthGuard)
  @Post('Login')
  
  login(@Request() req) {
    console.log('req', req);
    return req.user;
  }
}
