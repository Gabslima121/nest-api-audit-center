import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from '../company/company.module';
import { UserModule } from '../user/user.module';
import { SlaController } from './sla.controller';
import { Sla } from './sla.entity';
import { SlaRepository } from './sla.repository';
import { SlaService } from './sla.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sla]), UserModule, CompanyModule],
  controllers: [SlaController],
  providers: [SlaService, SlaRepository],
  exports: [SlaService, SlaRepository],
})
export class SlaModule {}
