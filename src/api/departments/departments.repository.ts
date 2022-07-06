import { EntityRepository, Repository } from 'typeorm';

import { Departments } from './departments.entity';

@EntityRepository(Departments)
class DepartmentsRepository extends Repository<Departments> {}

export { DepartmentsRepository };
