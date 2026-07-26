import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { Company } from '../companies/company.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  async create(companyId: number, dto: CreateProjectDto): Promise<Project> {
    const company = await this.companiesRepository.findOneBy({ id: companyId });
    if (!company) {
      throw new NotFoundException(`Company #${companyId} not found`);
    }

    const project = this.projectsRepository.create({
      ...dto,
      companyId,
    });
    return this.projectsRepository.save(project);
  }

  async findAll(companyId: number): Promise<Project[]> {
    return this.projectsRepository.find({
      where: { companyId },
      relations: { company: true },
    });
  }

  async findOne(companyId: number, id: number): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id, companyId },
      relations: { company: true },
    });
    if (!project) {
      throw new NotFoundException(`Project #${id} not found in company #${companyId}`);
    }
    return project;
  }

  async update(companyId: number, id: number, dto: CreateProjectDto): Promise<Project> {
    await this.findOne(companyId, id);
    await this.projectsRepository.update(id, dto);
    return this.findOne(companyId, id);
  }

  async remove(companyId: number, id: number): Promise<void> {
    const project = await this.findOne(companyId, id);
    await this.projectsRepository.remove(project);
  }
}
