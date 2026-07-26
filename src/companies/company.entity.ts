import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum CompanySize {
  MEI = 'MEI',
  ME = 'ME',
  EPP = 'EPP',
  LTDA = 'LTDA',
  SA = 'SA',
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
  nomeFantasia?: string;

  @ApiPropertyOptional({ description: 'Opening date' })
  @Column({ type: 'date', nullable: true })
  dataAbertura?: Date;

  @ApiPropertyOptional({ description: 'Company size', enum: CompanySize })
  @Column({ type: 'enum', enum: CompanySize, nullable: true })
  porte?: CompanySize;

  @ApiPropertyOptional({ description: 'Registration status' })
  @Column({ nullable: true })
  situacaoCadastral?: string;

  @ApiPropertyOptional({ description: 'Full address' })
  @Column({ nullable: true })
  address?: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @Column({ nullable: true })
  phone?: string;

  @ApiPropertyOptional({ description: 'Email address' })
  @Column({ nullable: true })
  email?: string;
}
