import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppsService } from './apps.service';
import { AppsController } from './apps.controller';
import { MyCompanyController } from './my-company.controller';
import { AppFeature } from './app-feature.entity';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [TypeOrmModule.forFeature([AppFeature]), CompaniesModule],
  controllers: [AppsController, MyCompanyController],
  providers: [AppsService],
  exports: [AppsService],
})
export class AppsModule {}
