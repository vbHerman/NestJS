// src/users/dto/create-user.dto.ts
import {
  IsString,
  IsOptional,
  IsEmail,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsString()
  loginName: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(2)
  status?: number = 1;
}
