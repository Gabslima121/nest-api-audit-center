import { IsEmail, IsString } from 'class-validator';
import { Request } from 'express';
import { Role } from 'src/api/role/role.entity';

import { User } from 'src/api/user/user.entity';

export interface AuthRequest extends Request {
  user: User;
}

export interface UserPayload {
  id?: string;
  sub?: string;
  email: string;
  cpf: string;
  roles: Role[];
  name: string;
  iat?: number;
  exp?: number;
  companyId: string;
}

export interface UserToken {
  accessToken: string;
  user: User;
}

export interface UserFromJwt {
  id: string;
  email: string;
}

export class LoginRequestBody {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export interface ValidateToken {
  token: string;
}
