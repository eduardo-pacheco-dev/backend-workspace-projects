import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Project name',
    example: 'Website Redesign',
  })
  @IsString()
  name!: string;

  @ApiPropertyOptional({
    description: 'Project description',
    example: 'Redesign the company website with modern UI/UX',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class AddCompanyToProjectDto {
  @ApiProperty({
    description: 'Company ID to add to the project',
    example: 1,
  })
  @IsNumber()
  companyId!: number;
}
