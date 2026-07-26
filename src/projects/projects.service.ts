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

  create(dto: CreateProjectDto): Promise<Project> {
    const project = this.projectsRepository.create(dto);
    return this.projectsRepository.save(project);
  }

  findAll(): Promise<Project[]> {
    return this.projectsRepository.find({ relations: { companies: true } });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: { companies: true },
    });
    if (!project) {
      throw new NotFoundException(`Project #${id} not found`);
    }
    return project;
  }

  async update(id: number, dto: CreateProjectDto): Promise<Project> {
    await this.projectsRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.projectsRepository.delete(id);
  }

  async addCompany(projectId: number, companyId: number): Promise<Project> {
    const project = await this.findOne(companyId ? projectId : projectId);
    const company = await this.companiesRepository.findOneBy({
      id: companyId,
    });
    if (!company) {
      throw new NotFoundException(`Company #${companyId} not found`);
    }
    if (!project.companies.some((c) => c.id === companyId)) {
      project.companies.push(company);
      await this.projectsRepository.save(project);
    }
    return this.findOne(projectId);
  }

  async removeCompany(projectId: number, companyId: number): Promise<Project> {
    const project = await this.findOne(projectId);
    project.companies = project.companies.filter((c) => c.id !== companyId);
    await this.projectsRepository.save(project);
    return this.findOne(projectId);
  }
}
