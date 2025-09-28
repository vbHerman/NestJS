// src/users/dto/update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// PartialType 会将 CreateUserDto 的所有字段转为可选
export class UpdateUserDto extends PartialType(CreateUserDto) {}
