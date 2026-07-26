import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class AppFeature {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ description: 'App name', example: 'Companies' })
  @Column()
  name!: string;

  @ApiProperty({ description: 'Unique slug identifier', example: 'companies' })
  @Column({ unique: true })
  slug!: string;

  @ApiPropertyOptional({ description: 'App description', example: 'Company management module' })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({ description: 'Whether the app is enabled', example: true })
  @Column({ default: true })
  isEnabled!: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn()
  updatedAt!: Date;
}
