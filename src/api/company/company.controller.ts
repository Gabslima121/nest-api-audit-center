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
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { CreateCompanyDTO } from './company.dto';
import { Company } from './company.entity';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {
  @Inject(CompanyService)
  private readonly companyService: CompanyService;

  @Inject(UserService)
  private readonly userService: UserService;

  @Post('create')
  async createCompany(
    @Body()
    {
      cep,
      city,
      cnpj,
      corporateName,
      neighborhood,
      number,
      state,
      street,
      complement,
    }: CreateCompanyDTO,
    @CurrentUser() user: User,
  ): Promise<Company> {
    try {
      await this.userService.checkIfUserIsAdmin(user.id);

      return await this.companyService.createCompany({
        cep,
        city,
        cnpj,
        corporateName,
        neighborhood,
        number,
        state,
        street,
        complement,
      });
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @Get()
  async getAllCompanies(@CurrentUser() user: User): Promise<Company[]> {
    try {
      await this.userService.checkIfUserIsAdmin(user.id);

      return await this.companyService.findAllCompanies();
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Delete('delete/:id')
  async deleteCompany(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<void> {
    try {
      await this.userService.checkIfUserIsAdmin(user.id);

      return this.companyService.deleteCompany(id);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @Get('/:id')
  async getCompanyById(@Param('id') id: string) {
    try {
      return await this.companyService.findCompanyById(id);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
