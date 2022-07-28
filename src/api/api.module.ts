import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { UserRoleModule } from './user-role/user-role.module';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { TicketsModule } from './tickets/tickets.module';
import { DepartmentsModule } from './departments/departments.module';
import { SlaModule } from './sla/sla.module';
import { TicketItemModule } from './ticket-item/ticket-item.module';

@Module({
  imports: [
    UserModule,
    RoleModule,
    UserRoleModule,
    AuthModule,
    CompanyModule,
    TicketsModule,
    DepartmentsModule,
    SlaModule,
    TicketItemModule,
  ],
})
export class ApiModule {}
