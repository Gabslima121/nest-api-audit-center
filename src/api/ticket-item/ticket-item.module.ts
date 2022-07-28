import { Module } from '@nestjs/common';
import { TicketItemController } from './ticket-item.controller';
import { TicketItemService } from './ticket-item.service';

@Module({
  controllers: [TicketItemController],
  providers: [TicketItemService]
})
export class TicketItemModule {}
