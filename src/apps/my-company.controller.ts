import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CompaniesService } from '../companies/companies.service';
import { UpdateCompanyDto } from '../companies/dto/update-company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ResponseCompanyDto } from '../companies/dto/response-company.dto';

@ApiTags('apps')
@Controller('apps/company')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MyCompanyController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @ApiOperation({ summary: 'Get the authenticated user company' })
  @ApiResponse({
    status: 200,
    description: 'Company found',
    type: ResponseCompanyDto,
  })
  @ApiResponse({ status: 404, description: 'Company not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findMyCompany(
    @CurrentUser('companyId') companyId: number,
  ): Promise<ResponseCompanyDto> {
    return this.companiesService.findOne(companyId);
  }

  @Patch()
  @ApiOperation({ summary: 'Update the authenticated user company' })
  @ApiResponse({
    status: 200,
    description: 'Company updated successfully',
    type: ResponseCompanyDto,
  })
  @ApiResponse({ status: 404, description: 'Company not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  async updateMyCompany(
    @CurrentUser('companyId') companyId: number,
    @Body() dto: UpdateCompanyDto,
  ): Promise<ResponseCompanyDto> {
    return this.companiesService.update(companyId, dto);
  }
}
