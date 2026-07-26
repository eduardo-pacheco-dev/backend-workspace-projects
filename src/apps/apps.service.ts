import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppFeature } from './app-feature.entity';
import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';

@Injectable()
export class AppsService {
  constructor(
    @InjectRepository(AppFeature)
    private readonly appsRepository: Repository<AppFeature>,
  ) {}

  async create(dto: CreateAppDto): Promise<AppFeature> {
    const existing = await this.appsRepository.findOneBy({ slug: dto.slug });
    if (existing) {
      throw new ConflictException(`App with slug "${dto.slug}" already exists`);
    }

    const app = this.appsRepository.create({
      ...dto,
      isEnabled: dto.isEnabled ?? true,
    });
    return this.appsRepository.save(app);
  }

  async findAll(): Promise<AppFeature[]> {
    return this.appsRepository.find({ order: { name: 'ASC' } });
  }

  async findOne(id: number): Promise<AppFeature> {
    const app = await this.appsRepository.findOneBy({ id });
    if (!app) {
      throw new NotFoundException(`App with ID ${id} not found`);
    }
    return app;
  }

  async findBySlug(slug: string): Promise<AppFeature> {
    const app = await this.appsRepository.findOneBy({ slug });
    if (!app) {
      throw new NotFoundException(`App with slug "${slug}" not found`);
    }
    return app;
  }

  async update(id: number, dto: UpdateAppDto): Promise<AppFeature> {
    await this.findOne(id);
    await this.appsRepository.update(id, dto);
    return this.findOne(id);
  }

  async toggle(id: number): Promise<AppFeature> {
    const app = await this.findOne(id);
    app.isEnabled = !app.isEnabled;
    return this.appsRepository.save(app);
  }

  async remove(id: number): Promise<void> {
    const app = await this.findOne(id);
    await this.appsRepository.remove(app);
  }
}
