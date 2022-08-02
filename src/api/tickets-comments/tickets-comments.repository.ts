import { EntityRepository, Repository } from 'typeorm';
import { TicketsComments } from './tickets-comments.entity';

@EntityRepository(TicketsComments)
class TicketsCommentsRepository extends Repository<TicketsComments> {}

export { TicketsCommentsRepository };
