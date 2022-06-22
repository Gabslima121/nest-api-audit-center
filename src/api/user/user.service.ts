import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { hash } from 'bcrypt';

import { CreateUserDTO } from './user.dto';
import { User } from './user.entity';
import { UserRoleRepository } from '../user-role/user-role.repository';
import { UserRepository } from './user.repository';
import { RoleRepository } from '../role/role.repository';
import { UserRole } from '../user-role/user-role.entity';
@Injectable()
class UserService {
  private userRoleRepository: UserRoleRepository;
  private userRepository: UserRepository;
  private roleRepository: RoleRepository;
  constructor(private readonly connection: Connection) {
    this.userRoleRepository =
      this.connection.getCustomRepository(UserRoleRepository);
    this.userRepository = this.connection.getCustomRepository(UserRepository);
    this.roleRepository = this.connection.getCustomRepository(RoleRepository);
  }

  public async createUser({
    name,
    avatar,
    cpf,
    email,
    isDeleted,
    password,
    roleId,
  }: CreateUserDTO): Promise<User> {
    const user = new User();
    const userRole = new UserRole();

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    await this.checkIfUserExists(email, cpf);

    const roleExists = await this.roleRepository.findOne({
      where: {
        id: roleId,
      },
      select: ['id'],
    });

    if (!roleExists) {
      throw new Error('Role not found');
    }

    const hashedPassword = await hash(password, 12);

    user.name = name;
    user.avatar = avatar || '';
    user.cpf = cpf;
    user.email = email;
    user.isDeleted = isDeleted || false;
    user.password = hashedPassword;

    userRole.roleId = roleExists.id;
    userRole.userId = user.id;

    await this.userRoleRepository.save(userRole);

    return await this.userRepository.save(user);
  }

  async checkIfUserExists(email: string, cpf: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    const cpfExists = await this.userRepository.findOne({
      where: {
        cpf,
      },
    });

    if (user || cpfExists) {
      throw new Error('User already exists. Please try another email or cpf');
    }

    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find({
      order: {
        name: 'ASC',
      },
      select: ['id', 'name', 'email', 'cpf', 'avatar'],
    });
  }

  // async associateUserWithRole(userId: number, roleId: number): Promise<void> {}
}
export { UserService };
