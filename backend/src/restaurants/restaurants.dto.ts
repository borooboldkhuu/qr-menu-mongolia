import { IsString, IsOptional, IsUrl, MinLength } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  @MinLength(2, { message: 'Рестораны нэр оруулна уу' })
  name: string;

  @IsString()
  @MinLength(3, { message: 'Slug оруулна уу' })
  slug: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Зөв URL оруулна уу' })
  facebookUrl?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Зөв URL оруулна уу' })
  instagramUrl?: string;
}

export class UpdateRestaurantDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsUrl()
  facebookUrl?: string;

  @IsOptional()
  @IsUrl()
  instagramUrl?: string;

  @IsOptional()
  @IsString()
  theme?: string;

  @IsOptional()
  @IsString()
  primaryColor?: string;
}
