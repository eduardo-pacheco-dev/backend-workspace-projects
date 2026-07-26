import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';
import { ProjectsService } from './projects.service';
import { Project } from './project.entity';
import { Company } from '../companies/company.entity';

type MockRepository<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T extends ObjectLiteral = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  remove: jest.fn(),
});

describe('ProjectsService', () => {
  let service: ProjectsService;
  let projectsRepository: MockRepository<Project>;
  let companiesRepository: MockRepository<Company>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Company),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    projectsRepository = module.get(getRepositoryToken(Project));
    companiesRepository = module.get(getRepositoryToken(Company));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a project for a company', async () => {
      const company = { id: 1, name: 'Acme Corp' };
      const dto = { name: 'Test Project', description: 'A test project' };
      const project = { id: 1, ...dto, companyId: 1, company };

      companiesRepository.findOneBy!.mockResolvedValue(company);
      projectsRepository.create!.mockReturnValue(project);
      projectsRepository.save!.mockReturnValue(project);

      const result = await service.create(1, dto);

      expect(companiesRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(projectsRepository.create).toHaveBeenCalledWith({ ...dto, companyId: 1 });
      expect(projectsRepository.save).toHaveBeenCalledWith(project);
      expect(result).toEqual(project);
    });

    it('should throw NotFoundException when company is not found', async () => {
      companiesRepository.findOneBy!.mockResolvedValue(undefined);

      await expect(service.create(999, { name: 'Test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all projects for a company', async () => {
      const projects = [
        { id: 1, name: 'Project 1', companyId: 1, company: { id: 1 } },
        { id: 2, name: 'Project 2', companyId: 1, company: { id: 1 } },
      ];

      projectsRepository.find!.mockResolvedValue(projects);

      const result = await service.findAll(1);

      expect(projectsRepository.find).toHaveBeenCalledWith({
        where: { companyId: 1 },
        relations: { company: true },
      });
      expect(result).toEqual(projects);
    });
  });

  describe('findOne', () => {
    it('should return a project by id and companyId', async () => {
      const project = { id: 1, name: 'Project 1', companyId: 1, company: { id: 1 } };

      projectsRepository.findOne!.mockResolvedValue(project);

      const result = await service.findOne(1, 1);

      expect(projectsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, companyId: 1 },
        relations: { company: true },
      });
      expect(result).toEqual(project);
    });

    it('should throw NotFoundException when project is not found', async () => {
      projectsRepository.findOne!.mockResolvedValue(undefined);

      await expect(service.findOne(1, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the project', async () => {
      const dto = { name: 'Updated Project' };
      const project = { id: 1, name: 'Updated Project', companyId: 1, company: { id: 1 } };

      projectsRepository.findOne!
        .mockResolvedValueOnce(project)
        .mockResolvedValueOnce(project);
      projectsRepository.update!.mockResolvedValue(undefined);

      const result = await service.update(1, 1, dto);

      expect(projectsRepository.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(project);
    });
  });

  describe('remove', () => {
    it('should delete the project', async () => {
      const project = { id: 1, name: 'Project 1', companyId: 1 };

      projectsRepository.findOne!.mockResolvedValue(project);

      await service.remove(1, 1);

      expect(projectsRepository.remove).toHaveBeenCalledWith(project);
    });
  });
});
