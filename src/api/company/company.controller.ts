import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IsPublic } from '../auth/decorators/is-public.decorator';
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

  @IsPublic()
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
      // this.userService._checkUserRole(user);

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
      const userExist = await this.userService.getUserById(user?.id);

      const { isAdmin } = this.userService._checkUserRole(userExist);

      if (isAdmin) {
        return await this.companyService.findAllCompanies();
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Get('companies-and-tickets')
  async getCompaniesByTicket() {
    try {
      return await this.companyService.findAllCompaniesAndEachTicket();
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Get('companies-and-tickets-by-status')
  async getCompaniesByTicketByStatus(@Query('status') status: string) {
    try {
      return await this.companyService.findCompanyAndEachTicketByStatus(status);
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
      this.userService._checkUserRole(user);

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

  @Put('update/:id')
  async updateCompany(
    @Param('id') id: string,
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
  ): Promise<void> {
    try {
      await this.companyService.updateCompany(id, {
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
}
