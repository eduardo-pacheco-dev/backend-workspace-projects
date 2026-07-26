import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CompanySize } from '../company.entity';

export class ResponseCompanyDto {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  id!: number;

  @ApiProperty({ description: 'Company legal name', example: 'Acme Technology Ltda' })
  name!: string;

  @ApiProperty({ description: 'Company CNPJ', example: '12.345.678/0001-95' })
  cnpj!: string;

  @ApiPropertyOptional({ description: 'Trade name', example: 'Acme Tech' })
  nomeFantasia?: string;

  @ApiPropertyOptional({ description: 'Opening date', example: '2020-01-15' })
  dataAbertura?: Date;

  @ApiPropertyOptional({ description: 'Company size', enum: CompanySize, example: CompanySize.LTDA })
  porte?: CompanySize;

  @ApiPropertyOptional({ description: 'Registration status', example: 'Active' })
  situacaoCadastral?: string;

  @ApiPropertyOptional({ description: 'Full address', example: '123 Main Street, Suite 100, São Paulo, SP' })
  address?: string;

  @ApiPropertyOptional({ description: 'Phone number', example: '+55 11 99999-1234' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Email address', example: 'contact@acmetech.com.br' })
  email?: string;
}

export class PaginatedCompaniesDto {
  @ApiProperty({ description: 'List of companies', type: [ResponseCompanyDto] })
  data!: ResponseCompanyDto[];

  @ApiProperty({ description: 'Total number of companies' })
  total!: number;

  @ApiProperty({ description: 'Current page' })
  page!: number;

  @ApiProperty({ description: 'Items per page' })
  limit!: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages!: number;
}
