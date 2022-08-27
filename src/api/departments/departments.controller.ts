import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  Post,
} from '@nestjs/common';

import { CreateDepartmentDTO } from './departments.dto';
import { Departments } from './departments.entity';
import { DepartmentsService } from './departments.service';
@Controller('departments')
export class DepartmentsController {
  @Inject(DepartmentsService)
  private readonly departmentsService: DepartmentsService;

  @Post('create/:companyId')
  public async createDepartment(
    @Body()
    { name, description }: CreateDepartmentDTO,
    @Param('companyId') companyId: string,
  ): Promise<Departments> {
    try {
      return await this.departmentsService.createDepartment({
        name,
        companyId,
        description,
      });
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @Get()
  async findAllDepartments(): Promise<Departments[]> {
    return this.departmentsService.findAllDepartments();
  }

  @Get('/:companyId')
  async findAllDepartmentsByCompanyId(
    @Param('companyId') companyId: string,
  ): Promise<Departments[]> {
    return this.departmentsService.findDepartmentByCompanyId(companyId);
  }

  @Delete('delete-department/:id')
  async deleteDepartment(@Param('id') id: string) {
    try {
      return await this.departmentsService.deleteDeparment(id);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
