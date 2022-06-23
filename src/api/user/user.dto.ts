import { Role } from '../role/role.entity';

interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  cpf: string;
  avatar?: string;
  isDeleted?: boolean;
  roleId: Role[] | string[];
}

interface FindUserByEmailDTO {
  email: string;
}

export { CreateUserDTO, FindUserByEmailDTO };
