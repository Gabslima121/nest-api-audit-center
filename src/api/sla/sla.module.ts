import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from '../company/company.service';
import { UserService } from '../user/user.service';
import { SlaController } from './sla.controller';
import { Sla } from './sla.entity';
import { SlaRepository } from './sla.repository';
import { SlaService } from './sla.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sla])],
  controllers: [SlaController],
  providers: [SlaService, SlaRepository, CompanyService, UserService],
  exports: [SlaService, SlaRepository],
})
export class SlaModule {}