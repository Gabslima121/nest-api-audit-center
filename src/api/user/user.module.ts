import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from '../company/company.service';
import { DepartmentsService } from '../departments/departments.service';
import { RoleModule } from '../role/role.module';
import { RoleService } from '../role/role.service';
import { UserRoleRepository } from '../user-role/user-role.repository';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RoleModule],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    UserRoleRepository,
    CompanyService,
    DepartmentsService,
    RoleService,
  ],
  exports: [UserService, UserRepository],
})
export class UserModule {}
