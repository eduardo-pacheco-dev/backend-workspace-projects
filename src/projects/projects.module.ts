import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { Company } from '../companies/company.entity';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Company])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
