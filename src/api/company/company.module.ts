import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { CompanyController } from './company.controller';
import { Company } from './company.entity';
import { CompanyRepository } from './company.repository';
import { CompanyService } from './company.service';

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyRepository, UserService],
  exports: [CompanyService, CompanyRepository],
})
export class CompanyModule {}
