import { Inject, Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import * as moment from 'moment';
import 'moment/locale/pt-br';

import { CompanyService } from '../company/company.service';
import { DepartmentsService } from '../departments/departments.service';
import { UserService } from '../user/user.service';
import { CreateTicketsDTO, UpdateTicket } from './tickets.dto';
import { Tickets } from './tickets.entity';
import { TicketsRepository } from './tickets.repository';
import { SlaService } from '../sla/sla.service';

@Injectable()
export class TicketsService {
  private ticketsRepository: TicketsRepository;

  constructor(private readonly connection: Connection) {
    this.ticketsRepository =
      this.connection.getCustomRepository(TicketsRepository);
  }

  @Inject(UserService)
  private readonly userService: UserService;

  @Inject(CompanyService)
  private readonly companyService: CompanyService;

  @Inject(DepartmentsService)
  private readonly departmentsSerivce: DepartmentsService;

  @Inject(SlaService)
  private readonly slaSerivce: SlaService;

  public async createTicket({
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
  }: CreateTicketsDTO): Promise<Tickets> {
    const ticket = new Tickets();

    const analystExists = await this.userService.getUserById(analyst);
    const responsableExists = await this.userService.getUserById(responsable);
    const companyExists = await this.companyService.findCompanyById(company);
    const departmentExists = await this.departmentsSerivce.findDepartmentById(
      responsableArea,
    );
    const slaExists = await this.slaSerivce.findSlaById(sla);

    if (!analystExists || !responsableExists) {
      throw new Error('analyst_or_responsable_not_found');
    }

    if (!companyExists) {
      throw new Error('company_not_found');
    }

    const formatedOpenDate = moment(openDate).format('DD-MM-YYYY');
    const formatedLimitDate = moment(limitDate).format('DD-MM-YYYY');
    const formatedCloseDate = !closeDate
      ? null
      : moment(closeDate).format('DD-MM-YYYY');

    ticket.analystId = analystExists?.id;
    ticket.companyId = companyExists?.id;
    ticket.responsableAreaId = departmentExists?.id;
    ticket.responsableId = responsableExists?.id;
    ticket.closeDate = formatedCloseDate;
    ticket.limitDate = formatedLimitDate;
    ticket.openDate =
      formatedOpenDate || moment(new Date()).format('DD-MM-YYYY');
    ticket.slaId = slaExists?.id;
    ticket.status = status || 'OPEN';
    ticket.title = title;
    ticket.description = description || null;

    return this.ticketsRepository.save(ticket);
  }

  public async findAllTickets(): Promise<Tickets[]> {
    return this.ticketsRepository.find({
      select: ['id', 'title', 'status', 'openDate', 'closeDate', 'limitDate'],
      relations: [
        'analyst',
        'responsable',
        'company',
        'responsableArea',
        'sla',
      ],
    });
  }

  public async findTicketsByResponsableId(
    responsableId: string,
    status?: string,
  ): Promise<Tickets[] | any> {
    let where = {};

    if (status) {
      where = { responsableId, status };
    } else {
      where = { responsableId };
    }

    const tickets = await this.ticketsRepository.find({
      where,
      select: ['id', 'title', 'status', 'openDate', 'closeDate', 'limitDate'],
      relations: [
        'analyst',
        'responsable',
        'company',
        'responsableArea',
        'sla',
      ],
    });

    const total = tickets.length;

    return {
      data: { tickets },
      total,
    };
  }

  public async findTicketsByAnalystId(analystId: string) {
    const tickets = await this.ticketsRepository.find({
      where: { analystId },
      relations: [
        'analyst',
        'responsable',
        'company',
        'responsableArea',
        'sla',
      ],
    });

    if (!tickets) {
      throw new Error('ticket_not_found');
    }

    return tickets;
  }

  public async findTicketById(id: string): Promise<Tickets> {
    return this.ticketsRepository.findOne({
      where: { id },
      select: ['id', 'title', 'status', 'openDate', 'closeDate', 'limitDate'],
      relations: [
        'analyst',
        'responsable',
        'company',
        'responsableArea',
        'sla',
      ],
    });
  }

  public async findTicketsByCompanyId(companyId: string): Promise<Tickets[]> {
    return this.ticketsRepository.find({
      where: { companyId },
      relations: [
        'analyst',
        'responsable',
        'company',
        'responsableArea',
        'sla',
      ],
    });
  }

  public async deleteTicketByCompany(
    companyId: string,
    ticketId: string,
  ): Promise<void> {
    const ticket = await this.ticketsRepository.findOne({
      where: { id: ticketId, companyId },
    });

    await this.ticketsRepository.softDelete(ticket?.id);
  }

  public async updateTicket(
    id: string,
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
    const ticket = await this.findTicketById(id);

    const analystExists = await this.userService.getUserById(analyst);
    const responsableExists = await this.userService.getUserById(responsable);
    const companyExists = await this.companyService.findCompanyById(company);
    const departmentExists = await this.departmentsSerivce.findDepartmentById(
      responsableArea,
    );
    const slaExists = await this.slaSerivce.findSlaById(sla);

    if (!analystExists || !responsableExists) {
      throw new Error('analyst_or_responsable_not_found');
    }

    if (!companyExists) {
      throw new Error('company_not_found');
    }

    const formatedOpenDate = moment(openDate).format('DD-MM-YYYY');
    const formatedLimitDate = moment(limitDate).format('DD-MM-YYYY');
    const formatedCloseDate = !closeDate
      ? null
      : moment(closeDate).format('DD-MM-YYYY');

    const updatedTicket = await this.ticketsRepository.update(ticket?.id, {
      analystId: analystExists?.id,
      companyId: companyExists?.id,
      responsableAreaId: departmentExists?.id,
      responsableId: responsableExists?.id,
      closeDate: formatedCloseDate,
      limitDate: formatedLimitDate,
      openDate: formatedOpenDate || moment(new Date()).format('DD-MM-YYYY'),
      slaId: slaExists?.id,
      status: status || 'OPEN',
      title: title,
      description: description || null,
    });

    if (updatedTicket) {
      return {
        status: 'success',
        message: 'ticket_updated',
      };
    }

    return {
      status: 'error',
      message: 'ticket_not_updated',
    };
  }

  public async deleteTicket(id: string): Promise<object> {
    const ticket = await this.findTicketById(id);

    const isDeleted = await this.ticketsRepository.softDelete(ticket?.id);

    if (isDeleted) {
      return {
        status: 'success',
        message: 'ticket_deleted',
      };
    }

    return {
      status: 'error',
      message: 'ticket_not_deleted',
    };
  }
}
