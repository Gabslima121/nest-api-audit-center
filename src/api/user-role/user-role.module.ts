import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { UserRoleController } from './user-role.controller';
import { UserRole } from './user-role.entity';
import { UserRoleRepository } from './user-role.repository';
import { UserRoleService } from './user-role.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRole]),
    forwardRef(() => UserModule),
    forwardRef(() => RoleModule),
  ],
  controllers: [UserRoleController],
  providers: [UserRoleRepository, UserRoleService],
  exports: [UserRoleService, UserRoleRepository],
})
export class UserRoleModule {}
