import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentsModule } from '../departments/departments.module';
import { UserModule } from '../user/user.module';
import { CompanyController } from './company.controller';
import { Company } from './company.entity';
import { CompanyRepository } from './company.repository';
import { CompanyService } from './company.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    forwardRef(() => UserModule),
    forwardRef(() => DepartmentsModule),
  ],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyRepository],
  exports: [CompanyService, CompanyRepository],
})
export class CompanyModule {}
