import { Inject, Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { hash } from 'bcrypt';
import { forEach, isEmpty } from 'lodash';

import {
  CheckUserRole,
  CreateUserDTO,
  FindUserByEmailDTO,
  UpdateUserDTO,
  UsersByCompany,
} from './user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserRoleRepository } from '../user-role/user-role.repository';
import { UserRole } from '../user-role/user-role.entity';
import { CompanyService } from '../company/company.service';
import { DepartmentsService } from '../departments/departments.service';
import { RoleService } from '../role/role.service';

@Injectable()
class UserService {
  private userRepository: UserRepository;
  private userRoleRepository: UserRoleRepository;
  constructor(private readonly connection: Connection) {
    this.userRepository = this.connection.getCustomRepository(UserRepository);
    this.userRoleRepository =
      this.connection.getCustomRepository(UserRoleRepository);
  }

  @Inject(CompanyService)
  private readonly companyService: CompanyService;

  @Inject(DepartmentsService)
  private readonly departmentsService: DepartmentsService;

  @Inject(RoleService)
  private readonly roleService: RoleService;

  public async createUser({
    name,
    avatar,
    cpf,
    email,
    isDeleted,
    password,
    roleId,
    companyId,
    departmentId,
  }: CreateUserDTO): Promise<User> {
    const user = new User();
    const userRole = new UserRole();

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    await this.checkIfUserExists(email, cpf);

    const company = await this.companyService.findCompanyById(companyId);
    const department = await this.departmentsService.findDepartmentById(
      departmentId,
    );

    const hashedPassword = await hash(password, 12);

    const role = await this.roleService.findRoleById(roleId);

    user.name = name;
    user.avatar = avatar || '';
    user.cpf = cpf;
    user.email = email;
    user.isDeleted = isDeleted || false;
    user.password = hashedPassword;
    user.companyId = company?.id;
    user.departmentId = department?.id;

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
      relations: ['roles', 'companies', 'department'],
    });

    if (!user) {
      throw new Error('user_not_found');
    }

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

  _checkUserRole(user: User): CheckUserRole {
    if (isEmpty(user.roles)) {
      throw new Error('user_has_no_roles');
    }

    const isAdmin = user.roles.some(
      (role) => role.name === 'ADMIN' || role.name === 'SUPER_ADMIN',
    );

    const isAnalyst = user.roles.some((role) => role.name === 'ANALYST');

    const isAuditor = user.roles.some((role) => role.name === 'AUDITOR');

    if (isAdmin) {
      return {
        isAdmin: true,
        message: 'User is admin',
      };
    }

    if (isAnalyst) {
      return {
        isAnalyst: true,
        message: 'User is analyst',
      };
    }

    if (isAuditor) {
      return {
        isAuditor: true,
        message: 'User is auditor',
      };
    }

    return {
      message: 'User does not have permission to access this resource',
    };
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

  async getUserByCompanyIdAndDepartmentId(
    companyId: string,
    departmentId: string,
  ) {
    const analystArray = [];

    const users = await this.userRepository.find({
      where: { companyId, departmentId },
      select: [
        'companyId',
        'id',
        'name',
        'email',
        'cpf',
        'avatar',
        'isDeleted',
      ],
      relations: ['roles', 'companies', 'department'],
    });

    if (!users) {
      throw new Error('no_users_found');
    }

    forEach(users, async (user) => {
      const { isAnalyst } = this._checkUserRole(user);

      if (isAnalyst) {
        analystArray.push(user);
      }
    });

    return {
      analyst: analystArray,
    };
  }

  async deleteUserById(id: string, currentUser: User): Promise<object | void> {
    const userExists = await this.getUserById(id);
    const currentUserExists = await this.getUserById(currentUser?.id);
    const { isAdmin } = this._checkUserRole(currentUserExists);

    if (!isAdmin) {
      throw new Error('user_not_authorized');
    }

    const deletedUser = await this.userRepository.softDelete(userExists?.id);

    if (deletedUser) {
      return {
        status: 'success',
        message: 'user_deleted',
      };
    }

    return {
      status: 'error',
      message: 'user_not_deleted',
    };
  }

  async getAllUserByCompanyId(companyId: string): Promise<UsersByCompany> {
    const auditorsArray = [];
    const analystsArray = [];
    const adminsArray = [];

    const users = await this.userRepository.find({
      where: { companyId },
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

    if (!users) {
      throw new Error('no_users_found');
    }

    forEach(users, async (user) => {
      const { isAnalyst, isAuditor, isAdmin } = this._checkUserRole(user);

      if (isAnalyst) {
        analystsArray.push(user);
      }

      if (isAuditor) {
        auditorsArray.push(user);
      }

      if (isAdmin) {
        adminsArray.push(user);
      }
    });

    return {
      analysts: analystsArray,
      auditors: auditorsArray,
      admins: adminsArray,
    };
  }

  async getUserByDepartmentId(departmentId: string): Promise<User[]> {
    const users = await this.userRepository.find({
      where: { departmentId },
      select: [
        'companyId',
        'id',
        'name',
        'email',
        'cpf',
        'avatar',
        'isDeleted',
      ],
      relations: ['roles', 'companies', 'departments'],
    });

    if (!users) {
      throw new Error('no_users_found');
    }

    return users;
  }

  async getAuditorsByCompanyId(companyId: string): Promise<object> {
    const { auditors } = await this.getAllUserByCompanyId(companyId);

    return auditors;
  }

  async getAnalystsByCompanyId(companyId: string): Promise<object> {
    const { analysts } = await this.getAllUserByCompanyId(companyId);

    return analysts;
  }
}
export { UserService };
