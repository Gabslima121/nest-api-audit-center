import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTicketsTable1657151417201 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tickets',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'responsable_id',
            type: 'varchar',
          },
          {
            name: 'responsable_area_id',
            type: 'varchar',
          },
          {
            name: 'analyst_id',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'varchar',
          },
          {
            name: 'sla',
            type: 'varchar',
          },
          {
            name: 'company_id',
            type: 'varchar',
          },
          {
            name: 'open_date',
            type: 'varchar',
          },
          {
            name: 'limit_date',
            type: 'varchar',
          },
          {
            name: 'close_date',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: true,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['responsable_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            name: 'FK_ResposableId_Tickets',
          },
          {
            columnNames: ['responsable_area_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'departments',
            name: 'FK_ResponsableAreaId_Tickets',
          },
          {
            columnNames: ['analyst_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            name: 'FK_AnalystId_Tickets',
          },
          {
            columnNames: ['company_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'company',
            name: 'FK_CompanyId_Tickets',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tickets');
  }
}
