import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from '../company/company.service';

import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { TicketsController } from './tickets.controller';
import { Tickets } from './tickets.entity';
import { TicketsRepository } from './tickets.repository';
import { TicketsService } from './tickets.service';

@Module({
  imports: [UserModule, RoleModule, TypeOrmModule.forFeature([Tickets])],
  controllers: [TicketsController],
  providers: [TicketsService, TicketsRepository, UserService, CompanyService],
  exports: [TicketsService, TicketsRepository],
})
export class TicketsModule {}
