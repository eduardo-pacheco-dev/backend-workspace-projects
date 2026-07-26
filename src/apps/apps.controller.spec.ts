import { Test, TestingModule } from '@nestjs/testing';
import { AppsController } from './apps.controller';
import { AppsService } from './apps.service';

describe('AppsController', () => {
  let controller: AppsController;
  let service: AppsService;

  const mockAppsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findBySlug: jest.fn(),
    update: jest.fn(),
    toggle: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppsController],
      providers: [
        {
          provide: AppsService,
          useValue: mockAppsService,
        },
      ],
    }).compile();

    controller = module.get<AppsController>(AppsController);
    service = module.get<AppsService>(AppsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto = { name: 'Companies', slug: 'companies' };
      const app = { id: 1, ...dto, isEnabled: true };

      mockAppsService.create.mockResolvedValue(app);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(app);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll', async () => {
      const apps = [
        { id: 1, name: 'Auth', slug: 'auth', isEnabled: true },
        { id: 2, name: 'Companies', slug: 'companies', isEnabled: true },
      ];

      mockAppsService.findAll.mockResolvedValue(apps);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(apps);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with id', async () => {
      const app = { id: 1, name: 'Companies', slug: 'companies', isEnabled: true };

      mockAppsService.findOne.mockResolvedValue(app);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(app);
    });
  });

  describe('findBySlug', () => {
    it('should call service.findBySlug with slug', async () => {
      const app = { id: 1, name: 'Companies', slug: 'companies', isEnabled: true };

      mockAppsService.findBySlug.mockResolvedValue(app);

      const result = await controller.findBySlug('companies');

      expect(service.findBySlug).toHaveBeenCalledWith('companies');
      expect(result).toEqual(app);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto = { name: 'Updated' };
      const app = { id: 1, name: 'Updated', slug: 'companies', isEnabled: true };

      mockAppsService.update.mockResolvedValue(app);

      const result = await controller.update(1, dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(app);
    });
  });

  describe('toggle', () => {
    it('should call service.toggle with id', async () => {
      const app = { id: 1, name: 'Companies', isEnabled: false };

      mockAppsService.toggle.mockResolvedValue(app);

      const result = await controller.toggle(1);

      expect(service.toggle).toHaveBeenCalledWith(1);
      expect(result).toEqual(app);
    });
  });

  describe('remove', () => {
    it('should call service.remove with id', async () => {
      mockAppsService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
