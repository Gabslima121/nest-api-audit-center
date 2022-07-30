import { Module } from '@nestjs/common';
import { TicketsCommentsService } from './tickets-comments.service';
import { TicketsCommentsController } from './tickets-comments.controller';
import { TicketsCommentsRepository } from './tickets-comments.repository';
import { TicketsService } from '../tickets/tickets.service';
import { SlaService } from '../sla/sla.service';
import { DepartmentsService } from '../departments/departments.service';
import { UserService } from '../user/user.service';
import { CompanyService } from '../company/company.service';

@Module({
  imports: [],
  providers: [
    TicketsCommentsService,
    TicketsCommentsRepository,
    TicketsService,
    UserService,
    SlaService,
    DepartmentsService,
    CompanyService,
  ],
  controllers: [TicketsCommentsController],
})
export class TicketsCommentsModule {}
