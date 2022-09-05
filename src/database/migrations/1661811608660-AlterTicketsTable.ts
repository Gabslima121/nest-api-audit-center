import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterTicketsTable1661811608660 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'tickets',
      'open_date',
      new TableColumn({
        name: 'open_date',
        type: 'timestamptz',
        isNullable: true,
      }),
    );

    await queryRunner.changeColumn(
      'tickets',
      'limit_date',
      new TableColumn({
        name: 'limit_date',
        type: 'timestamptz',
        isNullable: true,
      }),
    );

    await queryRunner.changeColumn(
      'tickets',
      'close_date',
      new TableColumn({
        name: 'close_date',
        type: 'timestamptz',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'tickets',
      'open_date',
      new TableColumn({
        name: 'open_date',
        type: 'varchar',
      }),
    );

    await queryRunner.changeColumn(
      'tickets',
      'limit_date',
      new TableColumn({
        name: 'limit_date',
        type: 'varchar',
      }),
    );

    await queryRunner.changeColumn(
      'tickets',
      'close_date',
      new TableColumn({
        name: 'close_date',
        type: 'varchar',
      }),
    );
  }
}
