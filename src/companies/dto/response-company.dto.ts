import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CompanySize } from '../company.entity';

export class ResponseCompanyDto {
  @ApiProperty({ description: 'Unique identifier' })
  id!: number;

  @ApiProperty({ description: 'Company legal name' })
  name!: string;

  @ApiProperty({ description: 'Company CNPJ', example: '12.345.678/0001-95' })
  cnpj!: string;

  @ApiPropertyOptional({ description: 'Trade name' })
  nomeFantasia?: string;

  @ApiPropertyOptional({ description: 'Opening date' })
  dataAbertura?: Date;

  @ApiPropertyOptional({ description: 'Company size', enum: CompanySize })
  porte?: CompanySize;

  @ApiPropertyOptional({ description: 'Registration status' })
  situacaoCadastral?: string;

  @ApiPropertyOptional({ description: 'Full address' })
  address?: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Email address' })
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
