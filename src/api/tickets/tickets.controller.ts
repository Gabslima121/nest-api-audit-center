import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/user.entity';
import { CreateTicketsDTO, TicketQuery, UpdateTicket } from './tickets.dto';
import { Tickets } from './tickets.entity';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  @Inject(TicketsService)
  private readonly ticketsService: TicketsService;

  @Get('/get-tickets-and-departments')
  public async getTicketsAndDepartments() {
    try {
      return await this.ticketsService.findTicketsAndDepartments();
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }

  @Get('/tickets-by-user-and-status')
  public async findTicketsByUserAndStatus(@CurrentUser() user: User) {
    try {
      return await this.ticketsService.findTicketsByUserAndStatus(user);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

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

  @Get('get-by-analyst')
  public async findTicketsByAnalyst(
    @CurrentUser() user: User,
  ): Promise<Tickets[]> {
    try {
      const { data } = await this.ticketsService.findTicketsByAnalystId(
        user?.id,
      );

      return data.tickets;
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @Get('get-by-company/:companyId')
  public async findTicketsByCompany(
    @Param('companyId') companyId: string,
  ): Promise<Tickets[]> {
    return this.ticketsService.findTicketsByCompanyId(companyId);
  }

  @Delete('delete/:id/:companyId')
  public async deleteTicketByCompanyId(
    @Param('id') id: string,
    @Param('companyId') companyId: string,
  ): Promise<void> {
    return this.ticketsService.deleteTicketByCompany(companyId, id);
  }

  @Get('/:id')
  public async findTicketById(@Param('id') id: string): Promise<Tickets> {
    return this.ticketsService.findTicketById(id);
  }

  @Get('get-by-company-and-main-status/:companyId')
  public async findAllTicketsByCompanyAndMainStatus(
    @Param('companyId') companyId: string,
    @Query('status') status: any,
  ) {
    return this.ticketsService.findAllTicketsByCompanyAndMainStatus(
      companyId,
      status,
    );
  }

  @Put('update-ticket/:id')
  public async updateTicket(
    @Param('id') id: string,
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
    }: UpdateTicket,
  ): Promise<object> {
    try {
      return await this.ticketsService.updateTicket(id, {
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

  @Delete('delete/:id')
  public async deleteTicketById(@Param('id') id: string): Promise<object> {
    try {
      return await this.ticketsService.deleteTicket(id);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
