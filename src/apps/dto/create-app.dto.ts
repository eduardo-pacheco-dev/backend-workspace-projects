import { IsString, IsBoolean, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppDto {
  @ApiProperty({ description: 'App name', example: 'Companies' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ description: 'Unique slug identifier', example: 'companies' })
  @IsString()
  @MinLength(2)
  slug!: string;

  @ApiPropertyOptional({ description: 'App description', example: 'Company management module' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Whether the app is enabled', example: true })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}
