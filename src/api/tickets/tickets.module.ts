import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from '../company/company.service';
import { DepartmentsService } from '../departments/departments.service';
import { RoleService } from '../role/role.service';
import { SlaService } from '../sla/sla.service';
import { UserService } from '../user/user.service';
import { TicketsController } from './tickets.controller';
import { Tickets } from './tickets.entity';
import { TicketsRepository } from './tickets.repository';
import { TicketsService } from './tickets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tickets])],
  controllers: [TicketsController],
  providers: [
    TicketsService,
    TicketsRepository,
    UserService,
    CompanyService,
    DepartmentsService,
    SlaService,
    RoleService,
  ],
  exports: [TicketsService, TicketsRepository],
})
export class TicketsModule {}
