import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateRoleDTO } from './role.dto';

import { Role } from './role.entity';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  @Inject(RoleService)
  private readonly roleService: RoleService;

  @Post('create')
  public async createRole(@Body() { name }: CreateRoleDTO): Promise<Role> {
    return this.roleService.createRole({ name });
  }
}
