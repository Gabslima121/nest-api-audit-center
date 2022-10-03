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

  public async createTicketItem(
    ticketItemData: any,
    ticketId: string,
  ): Promise<TicketItems> {
    const ticketExists = await this.ticketsService.findTicketById(ticketId);

    if (!ticketExists) throw new Error('ticket_not_found');

    const test = ticketItemData?.ticketItems.map((item: any) => {
      const ticketItem = new TicketItems();

      ticketItem.item = item?.item;
      ticketItem.status = item?.status || TICKET_ITEM_STATUS.PENDING;
      ticketItem.ticketId = ticketExists?.id;
      ticketItem.description = item?.description || null;

      return ticketItem;
    });

    return this.ticketItemRepository.save(test);
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

  public async deleteTicketItem(ticketItemId: string) {
    const ticketItemExists = await this.ticketItemRepository.findOne({
      where: { id: ticketItemId },
    });

    const deletedTicketItem = await this.ticketItemRepository.softDelete(
      ticketItemExists?.id,
    );

    if (deletedTicketItem) {
      return {
        status: 'success',
        message: 'ticket_item_deleted',
      };
    }

    return {
      status: 'error',
      message: 'ticket_item_not_deleted',
    };
  }
}
