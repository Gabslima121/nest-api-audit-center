import { Inject, Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { hash } from 'bcrypt';

import { CreateUserDTO, FindUserByEmailDTO, UpdateUserDTO } from './user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { RoleRepository } from '../role/role.repository';
import { UserRoleRepository } from '../user-role/user-role.repository';
import { UserRole } from '../user-role/user-role.entity';
import { CompanyRepository } from '../company/company.repository';
import { CompanyService } from '../company/company.service';

@Injectable()
class UserService {
  private userRepository: UserRepository;
  private roleRepository: RoleRepository;
  private userRoleRepository: UserRoleRepository;
  private companyRepository: CompanyRepository;
  constructor(private readonly connection: Connection) {
    this.userRepository = this.connection.getCustomRepository(UserRepository);
    this.roleRepository = this.connection.getCustomRepository(RoleRepository);
    this.userRoleRepository =
      this.connection.getCustomRepository(UserRoleRepository);
    this.companyRepository =
      this.connection.getCustomRepository(CompanyRepository);
  }

  @Inject(CompanyService)
  private readonly companyService: CompanyService;

  public async createUser({
    name,
    avatar,
    cpf,
    email,
    isDeleted,
    password,
    roleId,
    companyId,
  }: CreateUserDTO): Promise<User> {
    const user = new User();
    const userRole = new UserRole();

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    await this.checkIfUserExists(email, cpf);

    const company = await this.companyService.findCompanyById(companyId);

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
    user.companyId = company.id;

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
      select: [
        'companyId',
        'id',
        'name',
        'email',
        'cpf',
        'avatar',
        'isDeleted',
      ],
      relations: ['roles', 'companies'],
    });

    return users;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id, {
      select: [
        'companyId',
        'id',
        'name',
        'email',
        'cpf',
        'avatar',
        'isDeleted',
      ],
      relations: ['roles', 'companies'],
    });

    return user;
  }

  async validadeUserByEmail({ email }: FindUserByEmailDTO): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
      select: [
        'companyId',
        'id',
        'name',
        'email',
        'cpf',
        'avatar',
        'isDeleted',
        'password',
      ],
      relations: ['roles', 'companies'],
    });
  }

  async getUserByEmail({ email }: FindUserByEmailDTO): Promise<User> {
    const user = await this.userRepository.findOne(
      { email },
      {
        select: [
          'companyId',
          'id',
          'name',
          'email',
          'cpf',
          'avatar',
          'isDeleted',
        ],
        relations: ['roles', 'companies'],
      },
    );

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async checkIfUserIsAdmin(id: string): Promise<boolean> {
    const user = await this.userRepository.findOne(id, {
      select: [
        'companyId',
        'id',
        'name',
        'email',
        'cpf',
        'avatar',
        'isDeleted',
      ],
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

  async updateUser({
    email,
    name,
    userId,
  }: UpdateUserDTO): Promise<object | void> {
    const user = await this.getUserById(userId);

    const updatedUser = await this.userRepository.update(user.id, {
      name,
      email,
    });

    if (updatedUser) {
      return {
        status: 'success',
        message: 'user_updated',
      };
    }

    return {
      status: 'error',
      message: 'user_not_updated',
    };
  }
}
export { UserService };
