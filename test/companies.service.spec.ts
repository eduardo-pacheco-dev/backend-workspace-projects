import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompaniesService } from '../src/companies/companies.service';
import { Company } from '../src/companies/company.entity';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('CompaniesService', () => {
  let service: CompaniesService;
  let repository: MockRepository<Company>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: getRepositoryToken(Company),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    repository = module.get(getRepositoryToken(Company));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a company', async () => {
      const dto = { name: 'Acme Corp', cnpj: '12345678000190' };
      const company = { id: 1, ...dto, address: null, phone: null, email: null };

      repository.create!.mockReturnValue(company);
      repository.save!.mockReturnValue(company);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(company);
      expect(result).toEqual(company);
    });
  });

  describe('findAll', () => {
    it('should return all companies', async () => {
      const companies = [
        { id: 1, name: 'Acme Corp', cnpj: '12345678000190' },
        { id: 2, name: 'Globex Corp', cnpj: '98765432000110' },
      ];

      repository.find!.mockReturnValue(companies);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(companies);
    });
  });

  describe('findOne', () => {
    it('should return a company by id', async () => {
      const company = { id: 1, name: 'Acme Corp', cnpj: '12345678000190' };

      repository.findOneBy!.mockReturnValue(company);

      const result = await service.findOne(1);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(company);
    });

    it('should return null when company is not found', async () => {
      repository.findOneBy!.mockReturnValue(undefined);

      const result = await service.findOne(999);

      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update and return the company', async () => {
      const dto = { name: 'Acme Corp Updated', cnpj: '12345678000190' };
      const company = { id: 1, ...dto, address: null, phone: null, email: null };

      repository.update!.mockReturnValue(undefined);
      repository.findOneBy!.mockReturnValue(company);

      const result = await service.update(1, dto);

      expect(repository.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(company);
    });

    it('should return null when company is not found', async () => {
      repository.update!.mockReturnValue(undefined);
      repository.findOneBy!.mockReturnValue(undefined);

      const result = await service.update(999, { name: 'Test', cnpj: '000' });

      expect(result).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should delete the company', async () => {
      repository.delete!.mockReturnValue(undefined);

      await service.remove(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
