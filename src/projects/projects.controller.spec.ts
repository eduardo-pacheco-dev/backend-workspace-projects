import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let service: ProjectsService;

  const mockProjectsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    addCompany: jest.fn(),
    removeCompany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: mockProjectsService,
        },
      ],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto = { name: 'Test Project', description: 'A test project' };
      const project = { id: 1, ...dto, companies: [] };

      mockProjectsService.create.mockReturnValue(project);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(project);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll', async () => {
      const projects = [
        { id: 1, name: 'Project 1', companies: [] },
        { id: 2, name: 'Project 2', companies: [] },
      ];

      mockProjectsService.findAll.mockReturnValue(projects);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(projects);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with id', async () => {
      const project = { id: 1, name: 'Project 1', companies: [] };

      mockProjectsService.findOne.mockReturnValue(project);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(project);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto = { name: 'Updated Project' };
      const project = { id: 1, ...dto, companies: [] };

      mockProjectsService.update.mockReturnValue(project);

      const result = await controller.update(1, dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(project);
    });
  });

  describe('remove', () => {
    it('should call service.remove with id', async () => {
      mockProjectsService.remove.mockReturnValue(undefined);

      await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('addCompany', () => {
    it('should call service.addCompany with projectId and companyId', async () => {
      const dto = { companyId: 1 };
      const project = {
        id: 1,
        name: 'Project 1',
        companies: [{ id: 1, name: 'Company 1' }],
      };

      mockProjectsService.addCompany.mockReturnValue(project);

      const result = await controller.addCompany(1, dto);

      expect(service.addCompany).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(project);
    });
  });

  describe('removeCompany', () => {
    it('should call service.removeCompany with projectId and companyId', async () => {
      const project = {
        id: 1,
        name: 'Project 1',
        companies: [],
      };

      mockProjectsService.removeCompany.mockReturnValue(project);

      const result = await controller.removeCompany(1, 1);

      expect(service.removeCompany).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(project);
    });
  });
});
