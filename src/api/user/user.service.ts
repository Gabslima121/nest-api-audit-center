import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { hash } from 'bcrypt';
import { isArray, isEmpty, isObject } from 'lodash';

import {
  CreateUserDTO,
  FindUserByEmailDTO,
  GetUserRole,
  MapUserRole,
  UpdateUserDTO,
  UsersByCompany,
} from './user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserRole } from '../user-role/user-role.entity';
import { CompanyService } from '../company/company.service';
import { DepartmentsService } from '../departments/departments.service';
import { RoleService } from '../role/role.service';
import { UserRoleService } from '../user-role/user-role.service';

@Injectable()
class UserService {
  private userRepository: UserRepository;
  constructor(private readonly connection: Connection) {
    this.userRepository = this.connection.getCustomRepository(UserRepository);
  }

  @Inject(forwardRef(() => RoleService))
  private readonly roleService: RoleService;

  @Inject(forwardRef(() => UserRoleService))
  private readonly userRoleService: UserRoleService;

  @Inject(forwardRef(() => CompanyService))
  private readonly companyService: CompanyService;

  @Inject(forwardRef(() => DepartmentsService))
  private readonly departmentsService: DepartmentsService;

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

    await this.userRoleService.createUserRole(newUser.id, role.id);

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

  private async mapUserByRole(users: User[]): Promise<MapUserRole> {
    const adminArray = [];
    const analystArray = [];
    const auditorArray = [];

    users.forEach(async (user) => {
      user?.roles.forEach((role) => {
        if (role.name === 'ADMIN' || role.name === 'SUPER_ADMIN') {
          adminArray.push(user);
        }
      });

      user?.roles.forEach((role) => {
        if (role.name === 'ANALYST') {
          analystArray.push(user);
        }
      });

      user?.roles.forEach((role) => {
        if (role.name === 'AUDITOR') {
          auditorArray.push(user);
        }
      });
    });

    return {
      adminArray,
      analystArray,
      auditorArray,
    };
  }

  private getUserRole(user: User): GetUserRole {
    let isAdmin = false;
    let isAnalyst = false;
    let isAuditor = false;

    user?.roles.forEach((role) => {
      isAdmin = role.name.includes('ADMIN' || 'SUPER_ADMIN');

      isAnalyst = role?.name.includes('ANALYST');

      isAuditor = role?.name.includes('AUDITOR');
    });

    return { isAdmin, isAnalyst, isAuditor };
  }

  async _checkUserRole(user: User | User[] | any) {
    if (isArray(user) && !isEmpty(user)) {
      const { adminArray, analystArray, auditorArray } =
        await this.mapUserByRole(user);

      return {
        adminArray,
        analystArray,
        auditorArray,
      };
    }

    if (user && isObject(user)) {
      const { isAdmin, isAnalyst, isAuditor } = this.getUserRole(user);

      return {
        isAdmin,
        isAnalyst,
        isAuditor,
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
    const usersArray = await this.userRepository.find({
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

    if (!usersArray) {
      throw new Error('no_users_found');
    }

    const { adminArray, analystArray, auditorArray } =
      await this._checkUserRole(usersArray);

    return {
      adminArray,
      analystArray,
      auditorArray,
    };
  }

  async deleteUserById(id: string, currentUser: User): Promise<object | void> {
    const userExists = await this.getUserById(id);
    const currentUserExists = await this.getUserById(currentUser?.id);

    const { isAdmin } = await this._checkUserRole(currentUserExists);

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

    const { adminArray, analystArray, auditorArray } =
      await this._checkUserRole(users);

    return {
      analysts: analystArray,
      auditors: auditorArray,
      admins: adminArray,
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
