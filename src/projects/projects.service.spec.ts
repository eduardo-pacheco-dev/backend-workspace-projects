import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProjectsService } from './projects.service';
import { Project } from './project.entity';
import { Company } from '../companies/company.entity';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a project', async () => {
      const dto = { name: 'Test Project', description: 'A test project' };
      const project = { id: 1, ...dto, companies: [] };

      projectsRepository.create!.mockReturnValue(project);
      projectsRepository.save!.mockReturnValue(project);

      const result = await service.create(dto);

      expect(projectsRepository.create).toHaveBeenCalledWith(dto);
      expect(projectsRepository.save).toHaveBeenCalledWith(project);
      expect(result).toEqual(project);
    });
  });

  describe('findAll', () => {
    it('should return all projects', async () => {
      const projects = [
        { id: 1, name: 'Project 1', description: 'Desc 1', companies: [] },
        { id: 2, name: 'Project 2', description: 'Desc 2', companies: [] },
      ];

      projectsRepository.find!.mockReturnValue(projects);

      const result = await service.findAll();

      expect(projectsRepository.find).toHaveBeenCalledWith({
        relations: { companies: true },
      });
      expect(result).toEqual(projects);
    });
  });

  describe('findOne', () => {
    it('should return a project by id', async () => {
      const project = {
        id: 1,
        name: 'Project 1',
        description: 'Desc 1',
        companies: [],
      };

      projectsRepository.findOne!.mockReturnValue(project);

      const result = await service.findOne(1);

      expect(projectsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { companies: true },
      });
      expect(result).toEqual(project);
    });

    it('should throw NotFoundException when project is not found', async () => {
      projectsRepository.findOne!.mockReturnValue(undefined);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the project', async () => {
      const dto = { name: 'Updated Project' };
      const project = {
        id: 1,
        name: 'Updated Project',
        description: 'Desc',
        companies: [],
      };

      projectsRepository.update!.mockReturnValue(undefined);
      projectsRepository.findOne!.mockReturnValue(project);

      const result = await service.update(1, dto);

      expect(projectsRepository.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(project);
    });

    it('should throw NotFoundException when project is not found', async () => {
      projectsRepository.update!.mockReturnValue(undefined);
      projectsRepository.findOne!.mockReturnValue(undefined);

      await expect(service.update(999, { name: 'Test' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete the project', async () => {
      projectsRepository.delete!.mockReturnValue(undefined);

      await service.remove(1);

      expect(projectsRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('addCompany', () => {
    it('should add a company to the project', async () => {
      const project = {
        id: 1,
        name: 'Project 1',
        companies: [],
      };
      const company = { id: 1, name: 'Company 1' };

      projectsRepository.findOne!.mockReturnValue(project);
      companiesRepository.findOneBy!.mockReturnValue(company);
      projectsRepository.save!.mockReturnValue({ ...project, companies: [company] });

      const result = await service.addCompany(1, 1);

      expect(companiesRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(projectsRepository.save).toHaveBeenCalled();
      expect(result.companies).toContainEqual(company);
    });

    it('should not duplicate company if already associated', async () => {
      const company = { id: 1, name: 'Company 1' };
      const project = {
        id: 1,
        name: 'Project 1',
        companies: [company],
      };

      projectsRepository.findOne!.mockReturnValue(project);
      companiesRepository.findOneBy!.mockReturnValue(company);
      projectsRepository.save!.mockReturnValue(project);

      await service.addCompany(1, 1);

      expect(projectsRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when company is not found', async () => {
      const project = {
        id: 1,
        name: 'Project 1',
        companies: [],
      };

      projectsRepository.findOne!.mockReturnValue(project);
      companiesRepository.findOneBy!.mockReturnValue(undefined);

      await expect(service.addCompany(1, 999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when project is not found', async () => {
      projectsRepository.findOne!.mockReturnValue(undefined);

      await expect(service.addCompany(999, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('removeCompany', () => {
    it('should remove a company from the project', async () => {
      const company = { id: 1, name: 'Company 1' };
      const project = {
        id: 1,
        name: 'Project 1',
        companies: [company],
      };
      const updatedProject = {
        id: 1,
        name: 'Project 1',
        companies: [],
      };

      projectsRepository.findOne
        .mockReturnValueOnce(project)
        .mockReturnValueOnce(updatedProject);
      projectsRepository.save!.mockReturnValue(updatedProject);

      const result = await service.removeCompany(1, 1);

      expect(projectsRepository.save).toHaveBeenCalled();
      expect(result.companies).not.toContainEqual(company);
    });

    it('should throw NotFoundException when project is not found', async () => {
      projectsRepository.findOne!.mockReturnValue(undefined);

      await expect(service.removeCompany(999, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
