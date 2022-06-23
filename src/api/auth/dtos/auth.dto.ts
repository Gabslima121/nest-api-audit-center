import { IsEmail, IsString } from 'class-validator';
import { Request } from 'express';
import { Role } from 'src/api/role/role.entity';

import { User } from 'src/api/user/user.entity';

export interface AuthRequest extends Request {
  user: User;
}

export interface UserPayload {
  sub: string;
  email: string;
  cpf: string;
  roles: Role[];
  iat?: number;
  exp?: number;
}

export interface UserToken {
  accessToken: string;
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
