import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { RoleService } from '../role/role.service';
import { User } from '../user/user.entity';

import { UserService } from '../user/user.service';
import { UserPayload, UserToken } from './dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User): Promise<UserToken> {
    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      cpf: user.cpf,
      roles: user.roles,
      name: user.name,
      companyId: user.companyId,
    };

    const jwtToken = this.jwtService.sign(payload);

    return { accessToken: jwtToken, user };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.validadeUserByEmail({ email });
    if (user) {
      const isPasswordValid = await compare(password, user.password);

      const mappedRoles = this.roleService.mapRoles(user.roles);

      if (isPasswordValid) {
        return {
          id: user.id,
          email: user.email,
          cpf: user.cpf,
          name: user.name,
          roles: mappedRoles,
          companyId: user.companyId,
        };
      }
    }

    throw new Error('invalid_credentials');
  }

  async validateToken(token?: string): Promise<object> {
    // if (!token) throw new Error('invalid_token');

    const decoded = await this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });

    if (!decoded) throw new Error('invalid_token');

    const userExists = await this.userService.getUserById(decoded?.sub);

    if (!userExists) throw new Error('invalid_token');

    const payload: UserPayload = {
      id: userExists.id,
      email: userExists.email,
      cpf: userExists.cpf,
      roles: userExists.roles,
      name: userExists.name,
      companyId: userExists.companyId,
    };

    return {
      payload: { ...payload },
      accessToken: token,
    };
  }
}
