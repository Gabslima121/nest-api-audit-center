import { Role } from '../role/role.entity';

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

interface CheckUserRole {
  isAdmin?: boolean;
  isAnalyst?: boolean;
  isAuditor?: boolean;
  isResponsable?: boolean;
  isSuperAdmin?: boolean;
  message: string;
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
  CheckUserRole,
  UsersByCompany,
};
