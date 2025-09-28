// src/users/dto/create-user.dto.ts
import { IsString, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsIn(['male', 'female', 'other'])
  sex?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  photo?: string;
}
