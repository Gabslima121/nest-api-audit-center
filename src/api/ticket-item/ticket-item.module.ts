import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketItems } from './ticket-item.entity';
import { TicketItemController } from './ticket-item.controller';
import { TicketItemRepository } from './ticket-item.repository';
import { TicketItemService } from './ticket-item.service';
import { TicketsModule } from '../tickets/tickets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TicketItems]),
    forwardRef(() => TicketsModule),
  ],
  controllers: [TicketItemController],
  providers: [TicketItemService, TicketItemRepository],
  exports: [TicketItemService, TicketItemRepository],
})
export class TicketItemModule {}
