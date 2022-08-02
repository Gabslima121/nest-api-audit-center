import { EntityRepository, Repository } from 'typeorm';
import { TicketItems } from './ticket-item.entity';

@EntityRepository(TicketItems)
class TicketItemRepository extends Repository<TicketItems> {}

export { TicketItemRepository };
