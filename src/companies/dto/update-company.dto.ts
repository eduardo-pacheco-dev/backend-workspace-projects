import { IsString, IsEmail, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsCnpj } from '../../common/validators/cnpj.constraint';
import { CompanySize } from '../company.entity';

export class UpdateCompanyDto {
  @ApiPropertyOptional({ description: 'Company legal name', example: 'Acme Technology Ltda' })
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

  @ApiPropertyOptional({ description: 'Trade name', example: 'Acme Tech' })
  @IsOptional()
  @IsString()
  nomeFantasia?: string;

  @ApiPropertyOptional({ description: 'Opening date', example: '2020-01-15' })
  @IsOptional()
  @IsDateString()
  dataAbertura?: string;

  @ApiPropertyOptional({ description: 'Company size', enum: CompanySize, example: CompanySize.LTDA })
  @IsOptional()
  @IsEnum(CompanySize)
  porte?: CompanySize;

  @ApiPropertyOptional({ description: 'Registration status', example: 'Active' })
  @IsOptional()
  @IsString()
  situacaoCadastral?: string;

  @ApiPropertyOptional({ description: 'Full address', example: '123 Main Street, Suite 100, São Paulo, SP' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Phone number', example: '+55 11 99999-1234' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Email address', example: 'contact@acmetech.com.br' })
  @IsOptional()
  @IsEmail()
  email?: string;
}
