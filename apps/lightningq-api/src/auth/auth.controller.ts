import { Controller, Post, Request, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { Public } from './decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    console.log('AuthController: req.user =', req.user);
    // return this.authService.login(req.user.Id, req.user.Email, req.user.Name);
    const resopnse = await this.authService.login(
      req.user.Id,
      req.user.Email,
      req.user.Name,
      req.user.Role,
    ); 
    console.log('AuthController: resopnse =', resopnse); 
    return resopnse;
  }
  // @UseGuards(JwtAuthGuard)
  @Get('protected')
  getAll(@Request() req) {
    console.log('AuthController: req.user of protected =', req.user);
    return {
      messege: `Now you can access this protected API. this is your user ID: ${req.user.id}`,
    };
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user.id, req.user.name);
  }
  // @UseGuards(JwtAuthGuard) // ✅ Use this instead of LocalAuthGuard
  @Post('logout')
  logout(@Request() req) {
    console.log('User in request:', req.user);
    return this.authService.logout(req.user.id);
  }
}
