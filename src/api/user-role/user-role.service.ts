import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

import { UserRole } from './user-role.entity';
import { UserRoleRepository } from './user-role.repository';
import { RoleService } from '../role/role.service';
import { UserService } from '../user/user.service';

@Injectable()
export class UserRoleService {
  private userRoleRepository: UserRoleRepository;
  constructor(private readonly connection: Connection) {
    this.userRoleRepository =
      this.connection.getCustomRepository(UserRoleRepository);
  }

  @Inject(forwardRef(() => RoleService))
  private readonly roleService: RoleService;

  @Inject(forwardRef(() => UserService))
  private readonly userService: UserService;

  public async createUserRole(
    userId: string,
    roleId: string,
  ): Promise<UserRole> {
    const userRole = new UserRole();

    const user = await this.userService.getUserById(userId);
    const role = await this.roleService.findRoleById(roleId);

    userRole.userId = user.id;
    userRole.roleId = role.id;

    return this.userRoleRepository.save(userRole);
  }
}
