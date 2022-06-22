import { EntityRepository, Repository } from 'typeorm';
import { UserRole } from './user-role.entity';

@EntityRepository(UserRole)
class UserRoleRepository extends Repository<UserRole> {}

export { UserRoleRepository };
