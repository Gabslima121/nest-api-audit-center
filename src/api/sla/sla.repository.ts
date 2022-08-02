import { EntityRepository, Repository } from 'typeorm';
import { Sla } from './sla.entity';

@EntityRepository(Sla)
class SlaRepository extends Repository<Sla> {}

export { SlaRepository };
