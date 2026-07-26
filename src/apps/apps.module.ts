import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppsService } from './apps.service';
import { AppsController } from './apps.controller';
import { AppFeature } from './app-feature.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppFeature])],
  controllers: [AppsController],
  providers: [AppsService],
  exports: [AppsService],
})
export class AppsModule {}
