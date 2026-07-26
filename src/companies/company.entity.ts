import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Project } from '../projects/project.entity';

export enum CompanySize {
  MEI = 'MEI',
  ME = 'ME',
  EPP = 'EPP',
  LLC = 'LLC',
  CORPORATION = 'CORPORATION',
  EIRELI = 'EIRELI',
}

@Entity()
export class Company {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ description: 'Company legal name' })
  @Column()
  name!: string;

  @ApiProperty({ description: 'Company CNPJ', example: '12.345.678/0001-95' })
  @Column({ unique: true })
  cnpj!: string;

  @ApiPropertyOptional({ description: 'Trade name' })
  @Column({ nullable: true })
  tradeName?: string;

  @ApiPropertyOptional({ description: 'Opening date' })
  @Column({ type: 'date', nullable: true })
  openingDate?: Date;

  @ApiPropertyOptional({ description: 'Company size', enum: CompanySize })
  @Column({ type: 'enum', enum: CompanySize, nullable: true })
  companySize?: CompanySize;

  @ApiPropertyOptional({ description: 'Registration status' })
  @Column({ nullable: true })
  registrationStatus?: string;

  @ApiPropertyOptional({ description: 'Full address' })
  @Column({ nullable: true })
  address?: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @Column({ nullable: true })
  phone?: string;

  @ApiPropertyOptional({ description: 'Email address' })
  @Column({ nullable: true })
  email?: string;

  @ApiPropertyOptional({ description: 'Projects associated with this company', type: () => [Project] })
  @OneToMany(() => Project, (project) => project.company)
  projects?: Project[];
}
