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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with companyId and dto', async () => {
      const dto = { name: 'Test Project', description: 'A test project' };
      const project = { id: 1, ...dto, companyId: 1, company: { id: 1 } };

      mockProjectsService.create.mockResolvedValue(project);

      const result = await controller.create(1, dto);

      expect(service.create).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(project);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with companyId', async () => {
      const projects = [
        { id: 1, name: 'Project 1', companyId: 1, company: { id: 1 } },
      ];

      mockProjectsService.findAll.mockResolvedValue(projects);

      const result = await controller.findAll(1);

      expect(service.findAll).toHaveBeenCalledWith(1);
      expect(result).toEqual(projects);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with companyId and id', async () => {
      const project = { id: 1, name: 'Project 1', companyId: 1, company: { id: 1 } };

      mockProjectsService.findOne.mockResolvedValue(project);

      const result = await controller.findOne(1, 1);

      expect(service.findOne).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(project);
    });
  });

  describe('update', () => {
    it('should call service.update with companyId, id and dto', async () => {
      const dto = { name: 'Updated Project' };
      const project = { id: 1, ...dto, companyId: 1, company: { id: 1 } };

      mockProjectsService.update.mockResolvedValue(project);

      const result = await controller.update(1, 1, dto);

      expect(service.update).toHaveBeenCalledWith(1, 1, dto);
      expect(result).toEqual(project);
    });
  });

  describe('remove', () => {
    it('should call service.remove with companyId and id', async () => {
      mockProjectsService.remove.mockResolvedValue(undefined);

      await controller.remove(1, 1);

      expect(service.remove).toHaveBeenCalledWith(1, 1);
    });
  });
});
