import { Injectable, UnauthorizedException } from '@nestjs/common';
import { verify } from 'argon2';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  
  constructor(private readonly userService: UserService) {}


  // login(id: any, name: any, role: any) {
  //   throw new Error('Method not implemented.');
  // }

  async validateLocalUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    // console.log('user',user);

    if (!user) throw new UnauthorizedException('User not found!');
    const isPasswordMatched = await verify(user.passwordHash, password);
    if (!isPasswordMatched)
      throw new UnauthorizedException('Invalid Credentials!');

    return { Id: user.id, Name: user.name , Email: user.email };
  }
}

