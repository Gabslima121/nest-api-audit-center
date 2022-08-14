import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Param,
  Post,
} from '@nestjs/common';

import { User } from '../user/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateDepartmentDTO } from './departments.dto';
import { Departments } from './departments.entity';
import { DepartmentsService } from './departments.service';
import { UserService } from '../user/user.service';

@Controller('departments')
export class DepartmentsController {
  @Inject(DepartmentsService)
  private readonly departmentsService: DepartmentsService;

  @Inject(UserService)
  private readonly userService: UserService;

  @Post('create/:companyId')
  public async createDepartment(
    @Body()
    { name, description }: CreateDepartmentDTO,
    @Param('companyId') companyId: string,
    @CurrentUser() user: User,
  ): Promise<Departments> {
    try {
      this.userService._checkUserRole(user);

      return this.departmentsService.createDepartment({
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
}
