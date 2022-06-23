import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { UserRoleModule } from './user-role/user-role.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, RoleModule, UserRoleModule, AuthModule],
})
export class ApiModule {}
