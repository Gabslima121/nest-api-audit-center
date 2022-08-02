import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class DropSlaColumn1658964090477 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('tickets', 'sla');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'tickets',
      new TableColumn({
        name: 'sla',
        type: 'varchar',
      }),
    );
  }
}
