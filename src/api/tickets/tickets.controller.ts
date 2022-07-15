import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/user.entity';
import { CreateTicketsDTO, TicketQuery } from './tickets.dto';
import { Tickets } from './tickets.entity';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  @Inject(TicketsService)
  private readonly ticketsService: TicketsService;

  @Post('create')
  public async createTicket(
    @Body()
    {
      analyst,
      company,
      responsableArea,
      responsable,
      closeDate,
      limitDate,
      openDate,
      sla,
      status,
      title,
      description,
    }: CreateTicketsDTO,
  ): Promise<Tickets> {
    try {
      return await this.ticketsService.createTicket({
        analyst,
        company,
        responsableArea,
        responsable,
        closeDate,
        limitDate,
        openDate: openDate || new Date(),
        sla,
        status,
        title,
        description: description || null,
      });
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @Get()
  public async findAllTickets(): Promise<Tickets[]> {
    return this.ticketsService.findAllTickets();
  }

  @Get('get-by-responsable')
  public async findTicketsByResponsable(
    @CurrentUser() user: User,
    @Query() { ticketStatus }: TicketQuery,
  ): Promise<Tickets[]> {
    return this.ticketsService.findTicketsByResponsableId(
      user?.id,
      ticketStatus,
    );
  }
}
