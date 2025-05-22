import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs'; 
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}
 
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    console.log('User from DB:', user);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      console.log('User with roleId:', { ...result, roleId: user.roleId });  // Add this log
      return{ ...result,roleId: user.roleId };
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.id, roleId: user.roleId, };
    console.log('JWT Payload:', payload);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.usersService.create({ ...data, password: hashedPassword });
  }
}