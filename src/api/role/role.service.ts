import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateRoleDTO } from './role.dto';
import { Role } from './role.entity';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService {
  private roleRepository: RoleRepository;
  constructor(private readonly connection: Connection) {
    this.roleRepository = this.connection.getCustomRepository(RoleRepository);
  }

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
    return roles.map((role) => {
      return {
        id: role.id,
        name: role.name,
      };
    });
  }

  public async findRoleById(id: any): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role) {
      throw new Error('role_not_found');
    }

    return role;
  }
}
