import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
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

  @Get()
  public async listAllRoles(): Promise<Role[]> {
    return this.roleService.getAllRoles();
  }
}
