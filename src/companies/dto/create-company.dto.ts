import { IsString, IsEmail, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsCnpj } from '../../common/validators/cnpj.constraint';

export class CreateCompanyDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty({ example: '12.345.678/0001-95' })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.replace(/[^0-9A-Za-z]/g, '').toUpperCase()
      : value,
  )
  @IsCnpj({ message: 'CNPJ inválido' })
  cnpj!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;
}
