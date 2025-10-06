import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateStoreDto {
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
  ownerId: string;
}

export class UpdateStoreDto {
  @IsOptional()
  @IsString()
  @MinLength(20)
  @MaxLength(60)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(400)
  address?: string;
}

export class FilterStoreDto {
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
  @IsString()
  sortBy?: 'name' | 'email' | 'address' | 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}
