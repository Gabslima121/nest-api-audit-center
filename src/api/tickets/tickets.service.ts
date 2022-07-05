import { Inject, Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CompanyService } from '../company/company.service';
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

  public async createTicket({
    analystId,
    companyId,
    responsableAreaId,
    responsableId,
    closeDate,
    limitDate,
    openDate,
    sla,
    status,
    title,
    description,
  }: CreateTicketsDTO): Promise<Tickets> {
    const ticket = new Tickets();

    const analystExists = await this.userService.getUserById(analystId);
    const responsableExists = await this.userService.getUserById(responsableId);
    const companyExists = await this.companyService.findCompanyById(companyId);

    if (!analystExists || !responsableExists) {
      throw new Error('analyst_or_responsable_not_found');
    }

    if (!companyExists) {
      throw new Error('company_not_found');
    }

    ticket.analystId = analystExists.id;
    ticket.companyId = companyExists.id;

    //TODO change this line
    ticket.responsableAreaId = responsableAreaId;

    ticket.responsableId = responsableExists.id;
    ticket.closeDate = closeDate;
    ticket.limitDate = limitDate;
    ticket.openDate = openDate || new Date();
    ticket.sla = sla;
    ticket.status = status || 'open';
    ticket.title = title;
    ticket.description = description || null;

    // const responsableAreaExists = await this.departmentService.getDepartmentById()

    return await this.ticketsRepository.save(ticket);
  }

  public async findAllTickets(): Promise<Tickets[]> {
    return await this.ticketsRepository.find({
      select: [
        'id',
        'title',
        'status',
        'openDate',
        'closeDate',
        'sla',
        'limitDate',
      ],
      relations: ['analyst', 'responsable', 'company'],
    });
  }
}
