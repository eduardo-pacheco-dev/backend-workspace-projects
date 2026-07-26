import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Company } from './company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  async create(dto: CreateCompanyDto): Promise<Company> {
    await this.checkCnpjConflict(dto.cnpj);
    const company = this.companiesRepository.create(dto);
    return this.companiesRepository.save(company);
  }

  async findAll(
    page = 1,
    limit = 10,
    filters?: {
      nome?: string;
      cnpj?: string;
      situacaoCadastral?: string;
    },
  ): Promise<{ data: Company[]; total: number; page: number; limit: number; totalPages: number }> {
    const where: any = {};

    if (filters?.nome) {
      where.name = Like(`%${filters.nome}%`);
    }
    if (filters?.cnpj) {
      where.cnpj = Like(`%${filters.cnpj}%`);
    }
    if (filters?.situacaoCadastral) {
      where.situacaoCadastral = filters.situacaoCadastral;
    }

    const [data, total] = await this.companiesRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Company> {
    const company = await this.companiesRepository.findOneBy({ id });
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }

  async findByCnpj(cnpj: string): Promise<Company> {
    const sanitized = cnpj.replace(/[^0-9A-Za-z]/g, '').toUpperCase();
    const company = await this.companiesRepository.findOneBy({ cnpj: sanitized });
    if (!company) {
      throw new NotFoundException(`Company with CNPJ ${cnpj} not found`);
    }
    return company;
  }

  async update(id: number, dto: UpdateCompanyDto): Promise<Company> {
    await this.findOne(id);
    if (dto.cnpj) {
      await this.checkCnpjConflict(dto.cnpj, id);
    }
    await this.companiesRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const company = await this.findOne(id);
    await this.companiesRepository.remove(company);
  }

  private async checkCnpjConflict(cnpj: string, excludeId?: number): Promise<void> {
    const sanitized = cnpj.replace(/[^0-9A-Za-z]/g, '').toUpperCase();
    const existing = await this.companiesRepository.findOneBy({ cnpj: sanitized });
    if (existing && existing.id !== excludeId) {
      throw new ConflictException(`CNPJ ${cnpj} is already registered`);
    }
  }
}
