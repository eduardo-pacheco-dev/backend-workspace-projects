import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ description: 'User first name' })
  @Column()
  firstName!: string;

  @ApiProperty({ description: 'User last name' })
  @Column()
  lastName!: string;

  @ApiProperty({ description: 'User email address' })
  @Column({ unique: true })
  email!: string;

  @ApiProperty({ description: 'Hashed password' })
  @Column({ select: false })
  password!: string;

  @ApiProperty({ description: 'Email confirmed' })
  @Column({ default: false })
  emailConfirmed!: boolean;

  @ApiPropertyOptional({ description: 'Phone number' })
  @Column({ nullable: true })
  phone?: string;

  @ApiPropertyOptional({ description: 'Associated company ID' })
  @Column({ nullable: true })
  companyId?: number;

  @Column({ nullable: true, select: false })
  resetCode?: string;

  @Column({ type: 'timestamp', nullable: true, select: false })
  resetCodeExpires?: Date;

  @Column({ nullable: true, select: false })
  confirmationToken?: string;
}
