import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import 'moment/locale/pt-br';

import { CompanyService } from '../company/company.service';
import { DepartmentsService } from '../departments/departments.service';
import { UserService } from '../user/user.service';
import { CreateTicketsDTO, UpdateTicket } from './tickets.dto';
import { Tickets } from './tickets.entity';
import { TicketsRepository } from './tickets.repository';
import { SlaService } from '../sla/sla.service';
import { AUDIT_STATUS } from '../../shared/helpers/constants';
import { isEmpty } from 'lodash';

@Injectable()
export class TicketsService {
  private ticketsRepository: TicketsRepository;

  constructor(private readonly connection: Connection) {
    this.ticketsRepository =
      this.connection.getCustomRepository(TicketsRepository);
  }

  @Inject(forwardRef(() => UserService))
  private readonly userService: UserService;

  @Inject(forwardRef(() => CompanyService))
  private readonly companyService: CompanyService;

  @Inject(forwardRef(() => DepartmentsService))
  private readonly departmentsSerivce: DepartmentsService;

  @Inject(forwardRef(() => SlaService))
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

    ticket.analystId = analystExists?.id;
    ticket.companyId = companyExists?.id;
    ticket.responsableAreaId = departmentExists?.id;
    ticket.responsableId = responsableExists?.id;
    ticket.closeDate = closeDate;
    ticket.limitDate = limitDate;
    ticket.openDate = openDate;
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

    const updatedTicket = await this.ticketsRepository.update(ticket?.id, {
      analystId: analystExists?.id,
      companyId: companyExists?.id,
      responsableAreaId: departmentExists?.id,
      responsableId: responsableExists?.id,
      closeDate: new Date(closeDate) || null,
      limitDate: new Date(limitDate),
      openDate: new Date(openDate),
      slaId: slaExists?.id,
      status: status,
      title: title,
      description: description,
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

  // private _mapTicketAndDepartment(tickets) {
  //   return tickets.map((ticket) => {
  //     return {
  //       ticket,
  //       total: ticket?.depar?.length,
  //     };
  //   });
  // }

  public async findTicketsAndDepartments() {
    const tickets = await this.ticketsRepository
      .createQueryBuilder('tickets')
      .select([
        'tickets.id',
        'tickets.title',
        'responsableArea.id',
        'responsableArea.name',
        'company.id',
        'company.corporateName',
      ])
      .leftJoin('tickets.responsableArea', 'responsableArea')
      .leftJoin('responsableArea.company', 'company')
      .getMany();

    if (!tickets) {
      throw new Error('tickets_not_found');
    }

    return tickets;
  }

  private checkIfTicketArrayIsEmpty({
    doneTickets,
    openTickets,
    pendingTickets,
    inProgressTickets,
  }) {
    const result = [];

    result.push(!isEmpty(openTickets) ? openTickets : {});
    result.push(!isEmpty(pendingTickets) ? pendingTickets : {});
    result.push(!isEmpty(doneTickets) ? doneTickets : {});
    result.push(!isEmpty(inProgressTickets) ? inProgressTickets : {});

    return result;
  }

  private async buildResponseToMountTicketsByStatusChart(tickets) {
    let doneTickets = {};
    let openTickets = {};
    let pendingTickets = {};
    let inProgressTickets = {};

    const totalDone = [];
    const totalPending = [];
    const totalOpen = [];
    const totalInProgress = [];

    tickets.forEach((ticket: any) => {
      if (ticket?.status === AUDIT_STATUS.PENDING) {
        totalPending.push(ticket);
        pendingTickets = {
          status: ticket?.status,
          total: totalPending.length,
        };
      }

      if (ticket?.status === AUDIT_STATUS.DONE) {
        totalDone.push(ticket);
        doneTickets = {
          status: ticket?.status,
          total: totalDone.length,
        };
      }

      if (ticket?.status === AUDIT_STATUS.OPEN) {
        totalOpen.push(ticket);
        openTickets = {
          status: ticket?.status,
          total: totalOpen.length,
        };
      }

      if (ticket?.status === AUDIT_STATUS.IN_PROGRESS) {
        totalInProgress.push(ticket);

        inProgressTickets = {
          status: ticket?.status,
          total: totalInProgress.length,
        };
      }
    });

    const result = this.checkIfTicketArrayIsEmpty({
      doneTickets,
      openTickets,
      pendingTickets,
      inProgressTickets,
    });

    return result;
  }

  public async findAllTicketsByCompanyAndMainStatus(
    companyId: string,
    status?: any,
  ) {
    const tickets = await this.ticketsRepository
      .createQueryBuilder('tickets')
      .select([
        'tickets.title',
        'tickets.id',
        'tickets.status',
        'company.corporateName',
        'company.id',
      ])
      .where('tickets.status IN (:...status)', {
        status,
      })
      .andWhere('tickets.companyId = :companyId', { companyId })
      .leftJoin('tickets.company', 'company')
      .getMany();

    const result = await this.buildResponseToMountTicketsByStatusChart(tickets);

    return result;
  }
}
