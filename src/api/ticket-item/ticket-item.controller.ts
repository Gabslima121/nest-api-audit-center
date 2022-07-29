import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { CreateTicketItem } from './ticket-item.dto';
import { TicketItemService } from './ticket-item.service';

@Controller('ticket-item')
export class TicketItemController {
  @Inject(TicketItemService)
  private readonly ticketItemService: TicketItemService;

  @Post('create/:ticketId')
  async createTicketItem(
    @Body()
    { item, status, description }: CreateTicketItem,
    @Param('ticketId') ticketId: string,
  ) {
    try {
      return await this.ticketItemService.createTicketItem({
        item,
        status,
        ticketId,
        description,
      });
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @Get('/:ticketId')
  async findTicketItemsByTicketId(@Param('ticketId') ticketId: string) {
    try {
      return await this.ticketItemService.findTicketItemsByTicketId(ticketId);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
