import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import {
  ResponseCompanyDto,
  PaginatedCompaniesDto,
} from './dto/response-company.dto';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({
    status: 201,
    description: 'Company created successfully',
    type: ResponseCompanyDto,
  })
  @ApiResponse({ status: 409, description: 'CNPJ already registered' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  async create(@Body() dto: CreateCompanyDto): Promise<ResponseCompanyDto> {
    return this.companiesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List companies with filters and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of companies',
    type: PaginatedCompaniesDto,
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Current page (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiQuery({ name: 'name', required: false, type: String, description: 'Filter by company name' })
  @ApiQuery({ name: 'cnpj', required: false, type: String, description: 'Filter by CNPJ' })
  @ApiQuery({ name: 'registrationStatus', required: false, type: String, description: 'Filter by registration status' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('name') name?: string,
    @Query('cnpj') cnpj?: string,
    @Query('registrationStatus') registrationStatus?: string,
  ): Promise<PaginatedCompaniesDto> {
    return this.companiesService.findAll(
      page || 1,
      limit || 10,
      { name, cnpj, registrationStatus },
    );
  }

  @Get('cnpj/:cnpj')
  @ApiOperation({ summary: 'Find company by CNPJ' })
  @ApiParam({ name: 'cnpj', description: 'Company CNPJ (with or without mask)' })
  @ApiResponse({
    status: 200,
    description: 'Company found',
    type: ResponseCompanyDto,
  })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async findByCnpj(@Param('cnpj') cnpj: string): Promise<ResponseCompanyDto> {
    return this.companiesService.findByCnpj(cnpj);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find company by ID' })
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiResponse({
    status: 200,
    description: 'Company found',
    type: ResponseCompanyDto,
  })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ResponseCompanyDto> {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update company' })
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiResponse({
    status: 200,
    description: 'Company updated successfully',
    type: ResponseCompanyDto,
  })
  @ApiResponse({ status: 404, description: 'Company not found' })
  @ApiResponse({ status: 409, description: 'CNPJ already registered' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCompanyDto,
  ): Promise<ResponseCompanyDto> {
    return this.companiesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete company' })
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiResponse({ status: 204, description: 'Company deleted successfully' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.companiesService.remove(id);
  }
}
