import { Inject, Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import * as moment from 'moment';
import 'moment/locale/pt-br';

import { CompanyService } from '../company/company.service';
import { DepartmentsService } from '../departments/departments.service';
import { UserService } from '../user/user.service';
import { CreateTicketsDTO } from './tickets.dto';
import { Tickets } from './tickets.entity';
import { TicketsRepository } from './tickets.repository';

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

    ticket.analystId = analystExists.id;
    ticket.companyId = companyExists.id;
    ticket.responsableAreaId = departmentExists.id;
    ticket.responsableId = responsableExists.id;
    ticket.closeDate = formatedCloseDate;
    ticket.limitDate = formatedLimitDate;
    ticket.openDate =
      formatedOpenDate || moment(new Date()).format('DD-MM-YYYY');
    ticket.sla = sla;
    ticket.status = status || 'OPEN';
    ticket.title = title;
    ticket.description = description || null;

    return this.ticketsRepository.save(ticket);
  }

  public async findAllTickets(): Promise<Tickets[]> {
    return this.ticketsRepository.find({
      select: [
        'id',
        'title',
        'status',
        'openDate',
        'closeDate',
        'sla',
        'limitDate',
      ],
      relations: ['analyst', 'responsable', 'company', 'responsableArea'],
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
      select: [
        'id',
        'title',
        'status',
        'openDate',
        'closeDate',
        'sla',
        'limitDate',
      ],
      relations: ['analyst', 'responsable', 'company', 'responsableArea'],
    });

    const total = tickets.length;

    return {
      data: { tickets },
      total,
    };
  }
}
