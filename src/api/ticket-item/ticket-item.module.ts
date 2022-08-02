import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketItems } from './ticket-item.entity';
import { TicketsService } from '../tickets/tickets.service';
import { TicketItemController } from './ticket-item.controller';
import { TicketItemRepository } from './ticket-item.repository';
import { TicketItemService } from './ticket-item.service';
import { UserModule } from '../user/user.module';
import { TicketsModule } from '../tickets/tickets.module';
import { CompanyModule } from '../company/company.module';
import { DepartmentsModule } from '../departments/departments.module';
import { SlaModule } from '../sla/sla.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TicketItems]),
    UserModule,
    TicketsModule,
    CompanyModule,
    DepartmentsModule,
    SlaModule,
  ],
  controllers: [TicketItemController],
  providers: [TicketItemService, TicketItemRepository, TicketsService],
  exports: [TicketItemService, TicketItemRepository],
})
export class TicketItemModule {}
