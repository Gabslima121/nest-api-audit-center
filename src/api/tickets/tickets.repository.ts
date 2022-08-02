import { EntityRepository, Repository } from 'typeorm';
import { Tickets } from './tickets.entity';

@EntityRepository(Tickets)
class TicketsRepository extends Repository<Tickets> {}

export { TicketsRepository };
