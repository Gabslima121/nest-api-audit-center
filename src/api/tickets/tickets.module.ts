import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from '../company/company.module';
import { DepartmentsModule } from '../departments/departments.module';
import { SlaModule } from '../sla/sla.module';
import { UserModule } from '../user/user.module';
import { TicketsController } from './tickets.controller';
import { Tickets } from './tickets.entity';
import { TicketsRepository } from './tickets.repository';
import { TicketsService } from './tickets.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tickets]),
    forwardRef(() => UserModule),
    forwardRef(() => CompanyModule),
    forwardRef(() => DepartmentsModule),
    forwardRef(() => SlaModule),
  ],
  controllers: [TicketsController],
  providers: [TicketsService, TicketsRepository],
  exports: [TicketsService, TicketsRepository],
})
export class TicketsModule {}
