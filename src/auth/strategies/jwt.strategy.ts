import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private prisma = new PrismaClient();

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    const authCredential = await this.prisma.authCredential.findUnique({
      where: { userId: payload.sub },
      include: { userProfile: true },
    });

    if (!authCredential) {
      return null;
    }

    return {
      userId: authCredential.userId,
      loginName: authCredential.loginName,
      userProfile: authCredential.userProfile,
    };
  }
}
