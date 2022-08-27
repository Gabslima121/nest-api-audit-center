import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoleModule } from '../user-role/user-role.module';
import { UserModule } from '../user/user.module';

import { RoleController } from './role.controller';
import { Role } from './role.entity';
import { RoleRepository } from './role.repository';
import { RoleService } from './role.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    forwardRef(() => UserRoleModule),
    forwardRef(() => UserModule),
  ],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
  exports: [RoleService, RoleRepository],
})
export class RoleModule {}
