import { EntityRepository, Repository } from 'typeorm';
import { Company } from './company.entity';

@EntityRepository(Company)
class CompanyRepository extends Repository<Company> {}

export { CompanyRepository };
