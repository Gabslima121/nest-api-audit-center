import { Company } from 'src/api/company/company.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedCompaniesTable1661377182733 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(
      queryRunner.manager.create<Company>(Company, {
        corporateName: 'Audit Center',
        cnpj: '40.691.568/0001-10',
        cep: '03382-167',
        street: 'Rua Joaquim Peixoto',
        city: 'São Paulo',
        state: 'São Paulo',
        neighborhood: 'Vila Gustavo',
        number: '624',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM company`);
  }
}
