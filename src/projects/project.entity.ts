import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../companies/company.entity';

@Entity()
export class Project {
  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Project name',
    example: 'Website Redesign',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Project description',
    example: 'Redesign the company website with modern UI/UX',
    required: false,
    nullable: true,
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    description: 'Companies associated with this project',
    type: () => [Company],
  })
  @ManyToMany(() => Company)
  @JoinTable()
  companies: Company[];
}
