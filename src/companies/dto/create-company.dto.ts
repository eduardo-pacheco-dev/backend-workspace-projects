import { IsString, IsEmail, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsCnpj } from '../../common/validators/cnpj.constraint';
import { CompanySize } from '../company.entity';

export class CreateCompanyDto {
  @ApiProperty({ description: 'Company legal name', example: 'Acme Technology Ltda' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Company CNPJ', example: '12.345.678/0001-95' })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.replace(/[^0-9A-Za-z]/g, '').toUpperCase()
      : value,
  )
  @IsCnpj({ message: 'Invalid CNPJ' })
  cnpj!: string;

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
