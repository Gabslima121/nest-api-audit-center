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

  async findDepartmentByCompanyId(companyId: string): Promise<Departments[]> {
    return this.departmentsRepository.find({
      where: { companyId },
      select: ['id', 'name', 'description', 'companyId'],
      relations: ['company'],
    });
  }

  async deleteDeparment(id: string) {
    const departmentExists = await this.findDepartmentById(id);

    const deletedDepartment = await this.departmentsRepository.softDelete(
      departmentExists?.id,
    );

    if (deletedDepartment) {
      return {
        status: 'success',
        message: 'department_deleted',
      };
    }

    return {
      status: 'error',
      message: 'department_not_deleted',
    };
  }

  private _mapDepartmentsAndTicket(departments: Departments[]) {
    return departments.map((department: Departments) => {
      return {
        department,
        total: department?.tickets?.length,
      };
    });
  }

  public async findDepartmentsAndEachTicket(): Promise<object> {
    const departments = await this.departmentsRepository
      .createQueryBuilder('departments')
      .leftJoinAndSelect('departments.tickets', 'ticket')
      .leftJoinAndSelect('departments.company', 'company')
      .getMany();

    if (!departments) {
      throw new Error('company_not_found');
    }

    return this._mapDepartmentsAndTicket(departments);
  }
}
