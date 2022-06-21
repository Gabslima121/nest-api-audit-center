import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { UserRoleController } from './user-role.controller';
import { UserRole } from './user-role.entity';
import { UserRoleService } from './user-role.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRole]), RoleModule, UserModule],
  controllers: [UserRoleController],
  providers: [UserRoleService],
  exports: [UserRoleService],
})
export class UserRoleModule {}
