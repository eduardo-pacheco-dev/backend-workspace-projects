import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
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
  @ApiOperation({
    summary: 'Create a project',
    description: 'Create a new project with a name and optional description.',
  })
  @ApiBody({
    type: CreateProjectDto,
    examples: {
      create: {
        summary: 'Create a new project',
        value: {
          name: 'Website Redesign',
          description: 'Redesign the company website with modern UI/UX',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Project created successfully',
    schema: {
      example: {
        id: 1,
        name: 'Website Redesign',
        description: 'Redesign the company website with modern UI/UX',
        companies: [],
      },
    },
  })
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List all projects',
    description: 'Return all projects with their associated companies.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of projects',
    schema: {
      example: [
        {
          id: 1,
          name: 'Website Redesign',
          description: 'Redesign the company website with modern UI/UX',
          companies: [
            {
              id: 1,
              name: 'Acme Corp',
              cnpj: '12345678000190',
              address: '123 Main St',
              phone: '555-0100',
              email: 'contact@acme.com',
            },
          ],
        },
      ],
    },
  })
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a project by id',
    description: 'Return a single project by its ID with associated companies.',
  })
  @ApiParam({
    name: 'id',
    description: 'Project ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Project found',
    schema: {
      example: {
        id: 1,
        name: 'Website Redesign',
        description: 'Redesign the company website with modern UI/UX',
        companies: [],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Project #1 not found',
        error: 'Not Found',
      },
    },
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a project',
    description: 'Update project name and/or description.',
  })
  @ApiParam({
    name: 'id',
    description: 'Project ID',
    example: 1,
  })
  @ApiBody({
    type: CreateProjectDto,
    examples: {
      update: {
        summary: 'Update project name',
        value: {
          name: 'Website Redesign v2',
          description: 'Updated description for the project',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Project updated successfully',
    schema: {
      example: {
        id: 1,
        name: 'Website Redesign v2',
        description: 'Updated description for the project',
        companies: [],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Project #1 not found',
        error: 'Not Found',
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a project',
    description: 'Delete a project by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Project ID',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'Project deleted successfully',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.remove(id);
  }

  @Post(':id/companies')
  @ApiOperation({
    summary: 'Add a company to a project',
    description:
      'Associate a company with a project. If the company is already associated, no changes are made.',
  })
  @ApiParam({
    name: 'id',
    description: 'Project ID',
    example: 1,
  })
  @ApiBody({
    type: AddCompanyToProjectDto,
    examples: {
      add: {
        summary: 'Add a company to the project',
        value: {
          companyId: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Company added to project',
    schema: {
      example: {
        id: 1,
        name: 'Website Redesign',
        description: 'Redesign the company website with modern UI/UX',
        companies: [
          {
            id: 1,
            name: 'Acme Corp',
            cnpj: '12345678000190',
            address: '123 Main St',
            phone: '555-0100',
            email: 'contact@acme.com',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Project or Company not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Company #99 not found',
        error: 'Not Found',
      },
    },
  })
  addCompany(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddCompanyToProjectDto,
  ) {
    return this.projectsService.addCompany(id, dto.companyId);
  }

  @Delete(':id/companies/:companyId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove a company from a project',
    description: 'Disassociate a company from a project.',
  })
  @ApiParam({
    name: 'id',
    description: 'Project ID',
    example: 1,
  })
  @ApiParam({
    name: 'companyId',
    description: 'Company ID to remove',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'Company removed from project',
  })
  removeCompany(
    @Param('id', ParseIntPipe) id: number,
    @Param('companyId', ParseIntPipe) companyId: number,
  ) {
    return this.projectsService.removeCompany(id, companyId);
  }
}
