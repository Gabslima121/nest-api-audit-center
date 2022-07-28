import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from '../company/company.service';
import { DepartmentsModule } from '../departments/departments.module';
import { DepartmentsService } from '../departments/departments.service';

import { RoleModule } from '../role/role.module';
import { SlaService } from '../sla/sla.service';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { TicketsController } from './tickets.controller';
import { Tickets } from './tickets.entity';
import { TicketsRepository } from './tickets.repository';
import { TicketsService } from './tickets.service';

@Module({
  imports: [
    UserModule,
    RoleModule,
    DepartmentsModule,
    TypeOrmModule.forFeature([Tickets]),
  ],
  controllers: [TicketsController],
  providers: [
    TicketsService,
    TicketsRepository,
    UserService,
    CompanyService,
    DepartmentsService,
    SlaService,
  ],
  exports: [TicketsService, TicketsRepository],
})
export class TicketsModule {}
