import { Test, TestingModule } from '@nestjs/testing';
import { MyCompanyController } from './my-company.controller';
import { CompaniesService } from '../companies/companies.service';
import { NotFoundException } from '@nestjs/common';

describe('MyCompanyController', () => {
  let controller: MyCompanyController;
  let service: CompaniesService;

  const mockCompaniesService = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyCompanyController],
      providers: [
        {
          provide: CompaniesService,
          useValue: mockCompaniesService,
        },
      ],
    }).compile();

    controller = module.get<MyCompanyController>(MyCompanyController);
    service = module.get<CompaniesService>(CompaniesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findMyCompany', () => {
    it('should call service.findOne with companyId from user', async () => {
      const company = { id: 1, name: 'My Company', cnpj: '11222333000181' };

      mockCompaniesService.findOne.mockResolvedValue(company);

      const result = await controller.findMyCompany(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(company);
    });

    it('should throw NotFoundException when user has no company', async () => {
      mockCompaniesService.findOne.mockRejectedValue(
        new NotFoundException('Company with ID undefined not found'),
      );

      await expect(controller.findMyCompany(undefined as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateMyCompany', () => {
    it('should call service.update with companyId and dto', async () => {
      const dto = { name: 'Updated Company' };
      const company = { id: 1, name: 'Updated Company', cnpj: '11222333000181' };

      mockCompaniesService.update.mockResolvedValue(company);

      const result = await controller.updateMyCompany(1, dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(company);
    });
  });
});
