// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, UserProfile } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private prisma = new PrismaClient(); // 实例化 Prisma 客户端

  // 创建用户资料
  async create(createUserDto: CreateUserDto): Promise<UserProfile> {
    return this.prisma.userProfile.create({
      data: createUserDto,
    });
  }

  // 根据用户ID查询用户资料
  async findByUserId(userId: string): Promise<UserProfile | null> {
    return this.prisma.userProfile.findUnique({ where: { userId } });
  }

  // 查询所有用户资料
  async findAll(): Promise<UserProfile[]> {
    return this.prisma.userProfile.findMany();
  }

  // 查询单个用户资料（按 userId）
  async findOne(userId: string): Promise<UserProfile | null> {
    return this.prisma.userProfile.findUnique({ where: { userId } });
  }

  // 更新用户资料
  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserProfile> {
    return this.prisma.userProfile.update({
      where: { userId },
      data: updateUserDto,
    });
  }

  // 删除用户资料
  async remove(userId: string): Promise<UserProfile> {
    return this.prisma.userProfile.delete({ where: { userId } });
  }

  // 微服务方法：获取用户状态
  async getUserStatus(userId: string) {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return { userId: user.userId, status: user.status };
  }
}
