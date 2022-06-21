import { Body, Controller, Inject, Post } from '@nestjs/common';

import { UserRole } from './user-role.entity';
import { UserRoleService } from './user-role.service';

@Controller('user-role')
export class UserRoleController {
  @Inject(UserRoleService)
  private readonly userRoleService: UserRoleService;

  @Post('create')
  public async createUserRole(@Body() { userId, roleId }): Promise<UserRole> {
    try {
      return await this.userRoleService.createUserRole(userId, roleId);
    } catch (e) {
      console.log(e);
    }
  }
}
