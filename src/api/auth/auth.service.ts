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
        };
      }
    }

    throw new Error('invalid_credentials');
  }
}
