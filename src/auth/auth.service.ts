import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private prisma = new PrismaClient();

  constructor(
    private jwtService: JwtService,
    @Inject('USER_SERVICE') private client: ClientProxy,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<any> {
    const { loginName, password } = loginDto;
    const authCredential = await this.prisma.authCredential.findUnique({
      where: { loginName },
      include: { userProfile: true },
    });

    if (!authCredential) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    if (authCredential.isLocked) {
      throw new UnauthorizedException('账户已被锁定');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      authCredential.passwordHash,
    );
    if (!isPasswordValid) {
      // 增加失败计数
      await this.prisma.authCredential.update({
        where: { userId: authCredential.userId },
        data: { loginFailCount: { increment: 1 } },
      });
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 使用微服务校验用户状态
    const userStatus = await this.client
      .send({ cmd: 'get_user_status' }, { userId: authCredential.userId })
      .toPromise();
    if (userStatus.status !== 1) {
      throw new UnauthorizedException('用户已被禁用');
    }

    // 重置失败计数
    await this.prisma.authCredential.update({
      where: { userId: authCredential.userId },
      data: {
        loginFailCount: 0,
        lastLoginTime: new Date(),
      },
    });

    return {
      userId: authCredential.userId,
      loginName: authCredential.loginName,
      userProfile: authCredential.userProfile,
    };
  }

  async login(user: any) {
    const payload = { sub: user.userId, loginName: user.loginName };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '2h' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user_info: { userId: user.userId, loginName: user.loginName },
    };
  }
}
