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
  ApiParam,
} from '@nestjs/swagger';
import { AppsService } from './apps.service';
import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';
import { ResponseAppDto } from './dto/response-app.dto';

@ApiTags('apps')
@Controller('apps')
export class AppsController {
  constructor(private readonly appsService: AppsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new app' })
  @ApiResponse({
    status: 201,
    description: 'App created successfully',
    type: ResponseAppDto,
  })
  @ApiResponse({ status: 409, description: 'Slug already exists' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  async create(@Body() dto: CreateAppDto): Promise<ResponseAppDto> {
    return this.appsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all apps' })
  @ApiResponse({
    status: 200,
    description: 'List of all apps',
    type: [ResponseAppDto],
  })
  async findAll(): Promise<ResponseAppDto[]> {
    return this.appsService.findAll();
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Find app by slug' })
  @ApiParam({ name: 'slug', description: 'App slug' })
  @ApiResponse({
    status: 200,
    description: 'App found',
    type: ResponseAppDto,
  })
  @ApiResponse({ status: 404, description: 'App not found' })
  async findBySlug(@Param('slug') slug: string): Promise<ResponseAppDto> {
    return this.appsService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find app by ID' })
  @ApiParam({ name: 'id', description: 'App ID' })
  @ApiResponse({
    status: 200,
    description: 'App found',
    type: ResponseAppDto,
  })
  @ApiResponse({ status: 404, description: 'App not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ResponseAppDto> {
    return this.appsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update app' })
  @ApiParam({ name: 'id', description: 'App ID' })
  @ApiResponse({
    status: 200,
    description: 'App updated successfully',
    type: ResponseAppDto,
  })
  @ApiResponse({ status: 404, description: 'App not found' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAppDto,
  ): Promise<ResponseAppDto> {
    return this.appsService.update(id, dto);
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Toggle app enabled status' })
  @ApiParam({ name: 'id', description: 'App ID' })
  @ApiResponse({
    status: 200,
    description: 'App status toggled',
    type: ResponseAppDto,
  })
  @ApiResponse({ status: 404, description: 'App not found' })
  async toggle(@Param('id', ParseIntPipe) id: number): Promise<ResponseAppDto> {
    return this.appsService.toggle(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete app' })
  @ApiParam({ name: 'id', description: 'App ID' })
  @ApiResponse({ status: 204, description: 'App deleted successfully' })
  @ApiResponse({ status: 404, description: 'App not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.appsService.remove(id);
  }
}
