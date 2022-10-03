import {
  Body,
  Controller,
  Delete,
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
    ticketItems: [],
    @Param('ticketId') ticketId: string,
  ) {
    try {
      return await this.ticketItemService.createTicketItem(
        { ...ticketItems },
        ticketId,
      );
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

  @Delete('delete/:id')
  async deleteTicketItem(@Param('id') id: string) {
    try {
      return await this.ticketItemService.deleteTicketItem(id);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
