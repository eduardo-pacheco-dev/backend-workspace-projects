import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Company } from '../companies/company.entity';

@Entity()
export class Project {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ description: 'Project name', example: 'Website Redesign' })
  @Column()
  name!: string;

  @ApiPropertyOptional({ description: 'Project description', example: 'Redesign the company website' })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({ description: 'Company ID', example: 1 })
  @Column()
  companyId!: number;

  @ApiProperty({ description: 'Company that owns this project', type: () => Company })
  @ManyToOne(() => Company, (company) => company.projects)
  @JoinColumn({ name: 'companyId' })
  company!: Company;
}
