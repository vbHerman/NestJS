import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // 1. 参数校验（使用class-validator）
    // 2. 调用本地策略验证用户
    const user = await this.authService.validateUser(loginDto);
    // 3. 生成JWT
    return this.authService.login(user);
  }
}