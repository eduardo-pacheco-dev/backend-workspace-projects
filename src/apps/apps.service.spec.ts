import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';
import { AppsService } from './apps.service';
import { AppFeature } from './app-feature.entity';

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

describe('AppsService', () => {
  let service: AppsService;
  let appsRepository: MockRepository<AppFeature>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppsService,
        {
          provide: getRepositoryToken(AppFeature),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<AppsService>(AppsService);
    appsRepository = module.get(getRepositoryToken(AppFeature));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return an app', async () => {
      const dto = { name: 'Companies', slug: 'companies', description: 'Company management module' };
      const app = { id: 1, ...dto, isEnabled: true, createdAt: new Date(), updatedAt: new Date() };

      appsRepository.findOneBy!.mockResolvedValue(undefined);
      appsRepository.create!.mockReturnValue(app);
      appsRepository.save!.mockResolvedValue(app);

      const result = await service.create(dto);

      expect(appsRepository.findOneBy).toHaveBeenCalledWith({ slug: 'companies' });
      expect(appsRepository.create).toHaveBeenCalledWith({ ...dto, isEnabled: true });
      expect(appsRepository.save).toHaveBeenCalledWith(app);
      expect(result).toEqual(app);
    });

    it('should throw ConflictException when slug already exists', async () => {
      const dto = { name: 'Companies', slug: 'companies' };

      appsRepository.findOneBy!.mockResolvedValue({ id: 1 });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(appsRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all apps ordered by name', async () => {
      const apps = [
        { id: 1, name: 'Auth', slug: 'auth', isEnabled: true },
        { id: 2, name: 'Companies', slug: 'companies', isEnabled: true },
      ];

      appsRepository.find!.mockResolvedValue(apps);

      const result = await service.findAll();

      expect(appsRepository.find).toHaveBeenCalledWith({ order: { name: 'ASC' } });
      expect(result).toEqual(apps);
    });
  });

  describe('findOne', () => {
    it('should return an app by id', async () => {
      const app = { id: 1, name: 'Companies', slug: 'companies', isEnabled: true };

      appsRepository.findOneBy!.mockResolvedValue(app);

      const result = await service.findOne(1);

      expect(appsRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(app);
    });

    it('should throw NotFoundException when app is not found', async () => {
      appsRepository.findOneBy!.mockResolvedValue(undefined);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findBySlug', () => {
    it('should return an app by slug', async () => {
      const app = { id: 1, name: 'Companies', slug: 'companies', isEnabled: true };

      appsRepository.findOneBy!.mockResolvedValue(app);

      const result = await service.findBySlug('companies');

      expect(appsRepository.findOneBy).toHaveBeenCalledWith({ slug: 'companies' });
      expect(result).toEqual(app);
    });

    it('should throw NotFoundException when slug is not found', async () => {
      appsRepository.findOneBy!.mockResolvedValue(undefined);

      await expect(service.findBySlug('unknown')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the app', async () => {
      const dto = { name: 'Updated Companies' };
      const app = { id: 1, name: 'Updated Companies', slug: 'companies', isEnabled: true };

      appsRepository.findOneBy!.mockResolvedValueOnce(app);
      appsRepository.update!.mockResolvedValue(undefined);
      appsRepository.findOneBy!.mockResolvedValueOnce(app);

      const result = await service.update(1, dto);

      expect(appsRepository.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(app);
    });

    it('should throw NotFoundException when app is not found', async () => {
      appsRepository.findOneBy!.mockResolvedValue(undefined);

      await expect(service.update(999, { name: 'Test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('toggle', () => {
    it('should disable an enabled app', async () => {
      const app = { id: 1, name: 'Companies', isEnabled: true };

      appsRepository.findOneBy!.mockResolvedValue(app);
      appsRepository.save!.mockResolvedValue({ ...app, isEnabled: false });

      const result = await service.toggle(1);

      expect(appsRepository.save).toHaveBeenCalled();
      expect(result.isEnabled).toBe(false);
    });

    it('should enable a disabled app', async () => {
      const app = { id: 1, name: 'Companies', isEnabled: false };

      appsRepository.findOneBy!.mockResolvedValue(app);
      appsRepository.save!.mockResolvedValue({ ...app, isEnabled: true });

      const result = await service.toggle(1);

      expect(appsRepository.save).toHaveBeenCalled();
      expect(result.isEnabled).toBe(true);
    });

    it('should throw NotFoundException when app is not found', async () => {
      appsRepository.findOneBy!.mockResolvedValue(undefined);

      await expect(service.toggle(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete the app', async () => {
      const app = { id: 1, name: 'Companies' };

      appsRepository.findOneBy!.mockResolvedValue(app);

      await service.remove(1);

      expect(appsRepository.remove).toHaveBeenCalledWith(app);
    });

    it('should throw NotFoundException when app is not found', async () => {
      appsRepository.findOneBy!.mockResolvedValue(undefined);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
