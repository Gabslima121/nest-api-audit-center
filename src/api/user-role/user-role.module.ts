import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from '../company/company.service';
import { DepartmentsService } from '../departments/departments.service';
import { RoleService } from '../role/role.service';
import { UserService } from '../user/user.service';

import { UserRoleController } from './user-role.controller';
import { UserRole } from './user-role.entity';
import { UserRoleService } from './user-role.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRole])],
  controllers: [UserRoleController],
  providers: [
    UserRoleService,
    UserService,
    RoleService,
    CompanyService,
    DepartmentsService,
  ],
  exports: [UserRoleService],
})
export class UserRoleModule {}
