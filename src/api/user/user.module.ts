import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from '../company/company.module';
import { DepartmentsModule } from '../departments/departments.module';
import { RoleModule } from '../role/role.module';
import { UserRoleModule } from '../user-role/user-role.module';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => RoleModule),
    forwardRef(() => UserRoleModule),
    forwardRef(() => CompanyModule),
    forwardRef(() => DepartmentsModule),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
