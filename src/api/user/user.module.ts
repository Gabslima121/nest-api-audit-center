import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from '../company/company.module';
import { CompanyRepository } from '../company/company.repository';
import { CompanyService } from '../company/company.service';
import { RoleRepository } from '../role/role.repository';
import { UserRoleRepository } from '../user-role/user-role.repository';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CompanyModule],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    RoleRepository,
    UserRoleRepository,
    CompanyRepository,
    CompanyService,
  ],
  exports: [UserService, UserRepository],
})
export class UserModule {}
