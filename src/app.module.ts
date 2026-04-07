import { Module } from '@nestjs/common'; // 导入 NestJS 核心的 Module 装饰器
import { AppController } from './app.controller'; // 导入根控制器
import { AppService } from './app.service'; // 导入根服务
import { UsersService } from './users/users.service'; // 导入用户服务
import { UsersController } from './users/users.controller'; // 导入用户控制器
import { UsersModule } from './users/users.module'; // 导入用户子模块
import { AuthModule } from './auth/auth.module'; // 导入认证模块

@Module({
  imports: [UsersModule, AuthModule], // 导入其他模块
  controllers: [AppController, UsersController], // 声明当前模块包含的控制器
  providers: [AppService, UsersService], // 声明当前模块包含的服务
})
export class AppModule {} //将 AppModule 类导出，作为整个应用的根模块
