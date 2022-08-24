import { Company } from 'src/api/company/company.entity';
import { Departments } from 'src/api/departments/departments.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDepartmentsTable1661380054427 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const company = await queryRunner.manager.findOne(Company, {
      where: { corporateName: 'Audit Center' },
    });

    await queryRunner.manager.save(
      queryRunner.manager.create(Departments, {
        name: 'T.I.',
        companyId: company?.id,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM departments`);
  }
}
