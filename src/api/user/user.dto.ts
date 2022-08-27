import { Role } from '../role/role.entity';
import { User } from './user.entity';

interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  cpf: string;
  avatar?: string;
  isDeleted?: boolean;
  roleId: Role[] | string[];
  companyId?: string;
  departmentId?: string;
}

interface FindUserByEmailDTO {
  email: string;
}

interface UpdateUserDTO {
  name: string;
  email: string;
  userId: string;
}

interface MapUserRole {
  adminArray?: User[];
  analystArray?: User[];
  auditorArray?: User[];
}

interface GetUserRole {
  isAdmin: boolean;
  isAuditor: boolean;
  isAnalyst: boolean;
}

interface UsersByCompany {
  analysts: object[];
  auditors: object[];
  admins: object[];
}

export {
  CreateUserDTO,
  FindUserByEmailDTO,
  UpdateUserDTO,
  MapUserRole,
  UsersByCompany,
  GetUserRole,
};
