import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

import { UserRole } from './user-role.entity';
import { UserRepository } from '../user/user.repository';
import { RoleRepository } from '../role/role.repository';
import { UserRoleRepository } from './user-role.repository';

@Injectable()
export class UserRoleService {
  private userRoleRepository: UserRoleRepository;
  private userRepository: UserRepository;
  private roleRepository: RoleRepository;
  constructor(private readonly connection: Connection) {
    this.userRoleRepository =
      this.connection.getCustomRepository(UserRoleRepository);
    this.userRepository = this.connection.getCustomRepository(UserRepository);
    this.roleRepository = this.connection.getCustomRepository(RoleRepository);
  }

  public async createUserRole(
    userId: string,
    roleId: string,
  ): Promise<UserRole> {
    const userRole = new UserRole();

    const user = await this.userRepository.findOne(userId);
    const role = await this.roleRepository.findOne(roleId);

    if (!user || !role) {
      throw new Error('User or Role not found');
    }

    userRole.userId = user.id;
    userRole.roleId = role.id;

    return await this.userRoleRepository.save(userRole);
  }
}
