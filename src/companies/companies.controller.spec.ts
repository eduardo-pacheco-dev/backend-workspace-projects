import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

describe('CompaniesController', () => {
  let controller: CompaniesController;
  let service: CompaniesService;

  const mockCompaniesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [
        {
          provide: CompaniesService,
          useValue: mockCompaniesService,
        },
      ],
    }).compile();

    controller = module.get<CompaniesController>(CompaniesController);
    service = module.get<CompaniesService>(CompaniesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto = { name: 'Acme Corp', cnpj: '12345678000190' };
      const company = { id: 1, ...dto, address: null, phone: null, email: null };

      mockCompaniesService.create.mockReturnValue(company);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(company);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll', async () => {
      const companies = [
        { id: 1, name: 'Acme Corp', cnpj: '12345678000190' },
        { id: 2, name: 'Globex Corp', cnpj: '98765432000110' },
      ];

      mockCompaniesService.findAll.mockReturnValue(companies);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(companies);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with id', async () => {
      const company = { id: 1, name: 'Acme Corp', cnpj: '12345678000190' };

      mockCompaniesService.findOne.mockReturnValue(company);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(company);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto = { name: 'Acme Corp Updated', cnpj: '12345678000190' };
      const company = { id: 1, ...dto, address: null, phone: null, email: null };

      mockCompaniesService.update.mockReturnValue(company);

      const result = await controller.update(1, dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(company);
    });
  });

  describe('remove', () => {
    it('should call service.remove with id', async () => {
      mockCompaniesService.remove.mockReturnValue(undefined);

      await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
