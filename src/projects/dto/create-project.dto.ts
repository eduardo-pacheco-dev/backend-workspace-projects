import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ description: 'Project name', example: 'Website Redesign' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'Project description', example: 'Redesign the company website' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Company ID', example: 1 })
  @IsNumber()
  companyId!: number;
}
