import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
  IsOptional,
  Matches,
} from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @MinLength(20)
  @MaxLength(60)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(400)
  address: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message:
      'Password must contain at least one uppercase letter and one special character',
  })
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}

export class FilterUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  sortBy?: 'name' | 'email' | 'address' | 'role' | 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}
