import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from '../company/company.service';
import { DepartmentsService } from '../departments/departments.service';
import { UserService } from '../user/user.service';
import { SlaController } from './sla.controller';
import { Sla } from './sla.entity';
import { SlaRepository } from './sla.repository';
import { SlaService } from './sla.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sla])],
  controllers: [SlaController],
  providers: [
    SlaService,
    SlaRepository,
    CompanyService,
    UserService,
    DepartmentsService,
  ],
  exports: [SlaService, SlaRepository],
})
export class SlaModule {}
