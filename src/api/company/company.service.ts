import { Inject, Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { CreateCompanyDTO, UpdateCompanyDTO } from './company.dto';
import { Company } from './company.entity';
import { CompanyRepository } from './company.repository';

@Injectable()
class CompanyService {
  private companyRepository: CompanyRepository;
  constructor(private readonly connection: Connection) {
    this.companyRepository =
      this.connection.getCustomRepository(CompanyRepository);
  }

  @Inject(UserService)
  private readonly userService: UserService;

  public async createCompany(
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
    user: User,
  ): Promise<Company> {
    const { isAdmin } = await this.userService._checkUserRole(user);

    if (!isAdmin) {
      throw new Error('user_not_admin');
    }

    const company = new Company();

    if (!corporateName || !cnpj) {
      throw new Error('corporate_name_and_cnpj_are_required');
    }

    company.cep = cep;
    company.city = city;
    company.cnpj = cnpj;
    company.corporateName = corporateName;
    company.neighborhood = neighborhood;
    company.number = number;
    company.state = state;
    company.street = street;
    company.complement = complement || null;

    return this.companyRepository.save(company);
  }

  public async findAllCompanies(user: User): Promise<Company[]> {
    const userExists = await this.userService.getUserById(user?.id);

    const { isAdmin } = await this.userService._checkUserRole(userExists);

    if (!isAdmin) {
      throw new Error('user_not_admin');
    }

    return this.companyRepository.find({
      relations: ['tickets'],
    });
  }

  public async findAllCompaniesAndEachTicket() {
    const companies = await this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.tickets', 'ticket')
      .getMany();

    if (!companies) {
      throw new Error('company_not_found');
    }

    return companies.map((company) => {
      return {
        company,
        total: company?.tickets?.length,
      };
    });
  }

  public async findCompanyById(id: string): Promise<Company> {
    const company = await this.companyRepository.findOne({ where: { id } });

    if (!company) {
      throw new Error('company_not_found');
    }

    return company;
  }

  public async deleteCompany(id: string): Promise<void> {
    const company = await this.companyRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new Error('company_not_found');
    }

    await this.companyRepository.remove(company);
  }

  public async updateCompany(
    id: string,
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
    }: UpdateCompanyDTO,
  ): Promise<void> {
    if (!corporateName || !cnpj) {
      throw new Error('corporate_name_and_cnpj_are_required');
    }

    const company = await this.findCompanyById(id);

    this.companyRepository.update(company?.id, {
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
  }

  private _mapCompanyAndTicket(companies) {
    return companies.map((company) => {
      return {
        company,
        total: company?.tickets?.length,
      };
    });
  }

  public async findCompanyAndEachTicketByStatus(
    status: string,
  ): Promise<object> {
    const companies = await this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.tickets', 'ticket')
      .where('ticket.status = :status', { status })
      .getMany();

    if (!companies) {
      throw new Error('company_not_found');
    }

    return this._mapCompanyAndTicket(companies);
  }
}

export { CompanyService };
