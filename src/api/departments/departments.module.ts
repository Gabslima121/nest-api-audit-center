import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompanyService } from '../company/company.service';
import { UserService } from '../user/user.service';
import { DepartmentsController } from './departments.controller';
import { Departments } from './departments.entity';
import { DepartmentsRepository } from './departments.repository';
import { DepartmentsService } from './departments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Departments])],
  controllers: [DepartmentsController],
  providers: [
    DepartmentsService,
    DepartmentsRepository,
    CompanyService,
    UserService,
  ],
  exports: [DepartmentsService, DepartmentsRepository],
})
export class DepartmentsModule {}
