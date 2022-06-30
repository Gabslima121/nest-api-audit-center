import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDTO } from './role.dto';
import { Role } from './role.entity';

@Injectable()
export class RoleService {
  @InjectRepository(Role)
  private readonly roleRepository: Repository<Role>;

  public async createRole({ name }: CreateRoleDTO): Promise<Role> {
    const role = new Role();

    role.name = name;

    return this.roleRepository.save(role);
  }

  public async getAllRoles(): Promise<Role[]> {
    return this.roleRepository.find({
      select: ['id', 'name'],
    });
  }

  public mapRoles(roles: Role[]) {
    const mappedRoles = roles.map((role) => {
      return {
        name: role.name,
      };
    });

    return mappedRoles;
  }
}
