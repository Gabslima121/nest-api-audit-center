import { Role } from 'src/api/role/role.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRolesTable1661376923633 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(
      queryRunner.manager.create<Role>(Role, {
        name: 'SUPER_ADMIN',
      }),
    );

    await queryRunner.manager.save(
      queryRunner.manager.create<Role>(Role, {
        name: 'ADMIN',
      }),
    );

    await queryRunner.manager.save(
      queryRunner.manager.create<Role>(Role, {
        name: 'AUDITOR',
      }),
    );

    await queryRunner.manager.save(
      queryRunner.manager.create<Role>(Role, {
        name: 'ANALYST',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM currency`);
  }
}
