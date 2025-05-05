import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('x-access-token'),
      ignoreExpiration: false,
      secretOrKey: '12364783782738273',
    });
  }

  async validate(payload: any) {
    console.log('Decoded JWT Payload:', payload);
    return { userId: payload.sub, email: payload.username, roleId: payload.roleId };
  }
}
