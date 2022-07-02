import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { hash } from 'bcrypt';

import { CreateUserDTO, FindUserByEmailDTO } from './user.dto';
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

    user.name = name;
    user.avatar = avatar || '';
    user.cpf = cpf;
    user.email = email;
    user.isDeleted = isDeleted || false;
    user.password = hashedPassword;

    const newUser = await this.userRepository.save(user);

    userRole.userId = newUser.id;
    userRole.roleId = role.id;

    await this.userRoleRepository.save(userRole);

    return newUser;
  }

  async checkIfUserExists(email: string, cpf: string): Promise<object> {
    const user = await this.userRepository.findOne({
      where: {
        email,
        cpf,
      },
    });

    if (user) {
      throw new Error('User already exists');
    }

    return user;
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

  async validadeUserByEmail({ email }: FindUserByEmailDTO): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'cpf', 'avatar', 'isDeleted', 'password'],
      relations: ['roles'],
    });
  }

  async getUserByEmail({ email }: FindUserByEmailDTO): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'cpf', 'avatar', 'isDeleted'],
      relations: ['roles'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async checkIfUserIsAdmin(id: string): Promise<boolean> {
    const user = await this.userRepository.findOne(id, {
      select: ['id', 'name', 'email', 'cpf', 'avatar', 'isDeleted'],
      relations: ['roles'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isAdmin = user.roles.some(
      (role) => role.name === 'ADMIN' || role.name === 'SUPER_ADMIN',
    );

    if (!isAdmin) {
      throw new Error('User is not admin');
    }

    return true;
  }
}
export { UserService };
