import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponseAppDto {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  id!: number;

  @ApiProperty({ description: 'App name', example: 'Companies' })
  name!: string;

  @ApiProperty({ description: 'Unique slug identifier', example: 'companies' })
  slug!: string;

  @ApiPropertyOptional({ description: 'App description', example: 'Company management module' })
  description?: string;

  @ApiProperty({ description: 'Whether the app is enabled', example: true })
  isEnabled!: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;
}
