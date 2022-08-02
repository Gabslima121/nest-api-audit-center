import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
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

  public async createCompany({
    cep,
    city,
    cnpj,
    corporateName,
    neighborhood,
    number,
    state,
    street,
    complement,
  }: CreateCompanyDTO): Promise<Company> {
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

    return await this.companyRepository.save(company);
  }

  public async findAllCompanies(): Promise<Company[]> {
    return await this.companyRepository.find();
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
}

export { CompanyService };
