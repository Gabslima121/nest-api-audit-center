import { Inject, Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CompanyService } from '../company/company.service';
import { CreateDepartmentDTO } from './departments.dto';
import { Departments } from './departments.entity';
import { DepartmentsRepository } from './departments.repository';

@Injectable()
export class DepartmentsService {
  private departmentsRepository: DepartmentsRepository;

  constructor(private readonly connection: Connection) {
    this.departmentsRepository = this.connection.getCustomRepository(
      DepartmentsRepository,
    );
  }

  @Inject(CompanyService)
  private readonly companyService: CompanyService;

  async createDepartment({
    companyId,
    name,
    description,
  }: CreateDepartmentDTO): Promise<Departments> {
    const department = new Departments();
    const company = await this.companyService.findCompanyById(companyId);

    if (!company) {
      throw new Error('company_not_found');
    }

    department.name = name;
    department.companyId = company.id;
    department.description = description;

    return this.departmentsRepository.save(department);
  }

  async findAllDepartments(): Promise<Departments[]> {
    return this.departmentsRepository.find({
      select: ['id', 'name', 'description', 'companyId'],
      relations: ['company'],
    });
  }

  async findDepartmentById(id: string): Promise<Departments> {
    return this.departmentsRepository.findOne(id, {
      select: ['id', 'name', 'description', 'companyId'],
      relations: ['company'],
    });
  }
}
