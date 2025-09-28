// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController], // 注册控制器
  providers: [UsersService], // 注册服务
})
export class UsersModule {}
