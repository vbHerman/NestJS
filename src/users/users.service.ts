// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private prisma = new PrismaClient(); // 实例化 Prisma 客户端

  // 创建用户
  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({ data: createUserDto });
  }

  // 查询所有用户
  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  // 查询单个用户（按 ID）
  async findOne(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  // 更新用户
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  // 删除用户
  async remove(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
