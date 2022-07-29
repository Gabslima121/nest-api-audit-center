import { Inject, Injectable } from '@nestjs/common';
import { TICKET_ITEM_STATUS } from 'src/shared/helpers/constants';
import { Connection } from 'typeorm';
import { TicketsService } from '../tickets/tickets.service';
import { CreateTicketItem } from './ticket-item.dto';
import { TicketItems } from './ticket-item.entity';
import { TicketItemRepository } from './ticket-item.repository';

@Injectable()
export class TicketItemService {
  private ticketItemRepository: TicketItemRepository;

  constructor(private readonly connection: Connection) {
    this.ticketItemRepository =
      this.connection.getCustomRepository(TicketItemRepository);
  }

  @Inject(TicketsService)
  private readonly ticketsService: TicketsService;

  public async createTicketItem({
    item,
    status,
    ticketId,
    description,
  }: CreateTicketItem): Promise<TicketItems> {
    const ticketItem = new TicketItems();

    const ticketExists = await this.ticketsService.findTicketById(ticketId);

    if (!ticketExists) throw new Error('ticket_not_found');

    ticketItem.item = item;
    ticketItem.status = status || TICKET_ITEM_STATUS.PENDING;
    ticketItem.ticketId = ticketExists?.id;
    ticketItem.description = description || null;

    return this.ticketItemRepository.save(ticketItem);
  }

  public async findTicketItemsByTicketId(
    ticketId: string,
  ): Promise<TicketItems[]> {
    const ticketItems = await this.ticketItemRepository.find({
      where: { ticketId },
      relations: ['ticket'],
    });

    if (!ticketItems) throw new Error('ticket_not_found');

    return ticketItems;
  }
}
