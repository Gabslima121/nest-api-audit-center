import { EntityRepository, Repository } from 'typeorm';
import { Role } from './role.entity';

@EntityRepository(Role)
class RoleRepository extends Repository<Role> {}

export { RoleRepository };
