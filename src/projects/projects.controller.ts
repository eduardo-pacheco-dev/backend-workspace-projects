import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import {
  CreateProjectDto,
  AddCompanyToProjectDto,
} from './dto/create-project.dto';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a project' })
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all projects' })
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.remove(id);
  }

  @Post(':id/companies')
  @ApiOperation({ summary: 'Add a company to a project' })
  addCompany(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddCompanyToProjectDto,
  ) {
    return this.projectsService.addCompany(id, dto.companyId);
  }

  @Delete(':id/companies/:companyId')
  @ApiOperation({ summary: 'Remove a company from a project' })
  removeCompany(
    @Param('id', ParseIntPipe) id: number,
    @Param('companyId', ParseIntPipe) companyId: number,
  ) {
    return this.projectsService.removeCompany(id, companyId);
  }
}
