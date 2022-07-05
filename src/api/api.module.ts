import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { UserRoleModule } from './user-role/user-role.module';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [
    UserModule,
    RoleModule,
    UserRoleModule,
    AuthModule,
    CompanyModule,
    TicketsModule,
  ],
})
export class ApiModule {}
