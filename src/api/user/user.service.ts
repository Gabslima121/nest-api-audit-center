import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { hash } from 'bcrypt';

import { CreateUserDTO } from './user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { RoleRepository } from '../role/role.repository';
import { UserRoleRepository } from '../user-role/user-role.repository';
import { UserRole } from '../user-role/user-role.entity';
@Injectable()
class UserService {
  private userRepository: UserRepository;
  private roleRepository: RoleRepository;
  private userRoleRepository: UserRoleRepository;
  constructor(private readonly connection: Connection) {
    this.userRepository = this.connection.getCustomRepository(UserRepository);
    this.roleRepository = this.connection.getCustomRepository(RoleRepository);
    this.userRoleRepository =
      this.connection.getCustomRepository(UserRoleRepository);
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

    const hashedPassword = await hash(password, 12);

    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    });

    console.log('service', role);

    user.name = name;
    user.avatar = avatar || '';
    user.cpf = cpf;
    user.email = email;
    user.isDeleted = isDeleted || false;
    user.password = hashedPassword;

    const newUser = await this.userRepository.save(user);

    userRole.userId = newUser.id;
    userRole.roleId = role.id;

    console.log('service', newUser);

    await this.userRoleRepository.save(userRole);

    return newUser;
  }

  async checkIfUserExists(email: string, cpf: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
        cpf,
      },
    });

    if (user) {
      throw new Error('User already exists. Please try another email or cpf');
    }

    return false;
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepository.find({
      select: ['id', 'name', 'email', 'cpf', 'avatar', 'isDeleted'],
      relations: ['roles'],
    });

    return users;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id, {
      select: ['id', 'name', 'email', 'cpf', 'avatar', 'isDeleted'],
      relations: ['roles'],
    });

    return user;
  }
}
export { UserService };
