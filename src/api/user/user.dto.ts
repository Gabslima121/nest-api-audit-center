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

export { CreateUserDTO, FindUserByEmailDTO, UpdateUserDTO, CheckUserRole };
