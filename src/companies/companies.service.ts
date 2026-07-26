import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  create(dto: CreateCompanyDto): Promise<Company> {
    const company = this.companiesRepository.create(dto);
    return this.companiesRepository.save(company);
  }

  findAll(): Promise<Company[]> {
    return this.companiesRepository.find();
  }

  findOne(id: number): Promise<Company | null> {
    return this.companiesRepository.findOneBy({ id });
  }

  async update(id: number, dto: CreateCompanyDto): Promise<Company | null> {
    await this.companiesRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.companiesRepository.delete(id);
  }
}
