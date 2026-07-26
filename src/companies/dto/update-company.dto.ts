import { IsString, IsEmail, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsCnpj } from '../../common/validators/cnpj.constraint';
import { CompanySize } from '../company.entity';

export class UpdateCompanyDto {
  @ApiPropertyOptional({ description: 'Company legal name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Company CNPJ', example: '12.345.678/0001-95' })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.replace(/[^0-9A-Za-z]/g, '').toUpperCase()
      : value,
  )
  @IsCnpj({ message: 'Invalid CNPJ' })
  cnpj?: string;

  @ApiPropertyOptional({ description: 'Trade name' })
  @IsOptional()
  @IsString()
  nomeFantasia?: string;

  @ApiPropertyOptional({ description: 'Opening date' })
  @IsOptional()
  @IsDateString()
  dataAbertura?: string;

  @ApiPropertyOptional({ description: 'Company size', enum: CompanySize })
  @IsOptional()
  @IsEnum(CompanySize)
  porte?: CompanySize;

  @ApiPropertyOptional({ description: 'Registration status' })
  @IsOptional()
  @IsString()
  situacaoCadastral?: string;

  @ApiPropertyOptional({ description: 'Full address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Email address' })
  @IsOptional()
  @IsEmail()
  email?: string;
}
