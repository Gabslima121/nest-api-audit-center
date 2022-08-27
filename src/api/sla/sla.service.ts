import { Inject, Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CompanyService } from '../company/company.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { CreateSlaDTO, UpdateSlaDTO } from './sla.dto';
import { Sla } from './sla.entity';

import { SlaRepository } from './sla.repository';

@Injectable()
export class SlaService {
  private slaRepository: SlaRepository;
  constructor(private readonly connection: Connection) {
    this.slaRepository = this.connection.getCustomRepository(SlaRepository);
  }

  @Inject(UserService)
  private readonly userService: UserService;

  @Inject(CompanyService)
  private readonly companyService: CompanyService;

  public async createSla(
    { company, name, sla, typeSla, description }: CreateSlaDTO,
    user: User,
  ): Promise<Sla> {
    const userExists = await this.userService.getUserById(user?.id);

    const { isAdmin } = await this.userService._checkUserRole(userExists);

    if (!isAdmin) {
      throw new Error('user_not_admin');
    }

    const newSla = new Sla();

    const companyExists = await this.companyService.findCompanyById(company);

    newSla.companyId = companyExists.id;
    newSla.name = name;
    newSla.sla = sla;
    newSla.typeSla = typeSla;
    newSla.description = description;

    return this.slaRepository.save(newSla);
  }

  public async findSlaById(id: string): Promise<Sla> {
    const sla = this.slaRepository.findOne({
      where: { id },
      relations: ['company'],
    });

    if (!sla) {
      throw new Error('sla_not_found');
    }

    return sla;
  }

  public async findSlaByCompanyId(companyId: string): Promise<Sla[]> {
    const sla = await this.slaRepository.find({
      where: { companyId },
      relations: ['company'],
    });

    if (!sla) {
      throw new Error('sla_not_found');
    }

    return sla;
  }

  public async updateSla(
    id: string,
    { name, sla, typeSla, description }: UpdateSlaDTO,
    user: User,
  ): Promise<object> {
    const { isAdmin } = await this.userService._checkUserRole(user);

    if (!isAdmin) {
      throw new Error('user_not_admin');
    }

    const slaExists = await this.findSlaById(id);

    const updatedSla = await this.slaRepository.update(slaExists.id, {
      name,
      sla,
      typeSla,
      description: description || slaExists.description,
    });

    if (updatedSla) {
      return {
        status: 'success',
        message: 'sla_updated',
      };
    }

    return {
      status: 'error',
      message: 'sla_not_updated',
    };
  }

  public async deleteSla(id: string, user: User): Promise<object> {
    const userExists = await this.userService.getUserById(user?.id);

    const { isAdmin } = await this.userService._checkUserRole(userExists);

    if (!isAdmin) {
      throw new Error('user_not_admin');
    }

    const slaExists = await this.findSlaById(id);

    const deletedSla = await this.slaRepository.softDelete(slaExists.id);

    if (deletedSla) {
      return {
        status: 'success',
        message: 'sla_deleted',
      };
    }

    return {
      status: 'error',
      message: 'sla_not_deleted',
    };
  }
}
