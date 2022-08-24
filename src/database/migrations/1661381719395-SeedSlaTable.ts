import { Company } from 'src/api/company/company.entity';
import { Sla } from 'src/api/sla/sla.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedSlaTable1661381719395 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const company = await queryRunner.manager.findOne(Company, {
      where: { corporateName: 'Audit Center' },
    });

    await queryRunner.manager.save(
      queryRunner.manager.create(Sla, {
        name: 'Bravo Squad',
        companyId: company?.id,
        sla: 2,
        typeSla: 'days',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM sla`);
  }
}
