import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from '../role/role.entity';
import { User } from '../user/user.entity';

import { UserRole } from './user-role.entity';

@Injectable()
export class UserRoleService {
  @InjectRepository(UserRole)
  private readonly userRoleRepository: Repository<UserRole>;
  private readonly userRepository: Repository<User>;
  private readonly roleRepository: Repository<Role>;

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

    userRole.userId = userId;
    userRole.roleId = roleId;

    return this.userRoleRepository.save(userRole);
  }
}
