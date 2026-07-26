import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ description: 'User full name' })
  @Column()
  name!: string;

  @ApiProperty({ description: 'User email address' })
  @Column({ unique: true })
  email!: string;

  @ApiProperty({ description: 'Hashed password' })
  @Column({ select: false })
  password!: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @Column({ nullable: true })
  phone?: string;

  @ApiPropertyOptional({ description: 'Associated company ID' })
  @Column({ nullable: true })
  companyId?: number;

  @Column({ nullable: true, select: false })
  resetToken?: string;

  @Column({ type: 'timestamp', nullable: true, select: false })
  resetTokenExpires?: Date;
}
