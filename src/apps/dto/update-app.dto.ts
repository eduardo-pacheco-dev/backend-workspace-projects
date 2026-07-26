import { IsString, IsBoolean, IsOptional, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAppDto {
  @ApiPropertyOptional({ description: 'App name', example: 'Companies' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiPropertyOptional({ description: 'App description', example: 'Company management module' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Whether the app is enabled', example: true })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}
