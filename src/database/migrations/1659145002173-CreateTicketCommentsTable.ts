import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTicketCommentsTable1659145002173
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tickets_comments',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'ticket_id',
            type: 'varchar',
          },
          {
            name: 'author_id',
            type: 'varchar',
          },
          {
            name: 'content',
            type: 'varchar',
          },
          {
            name: 'registered_at',
            type: 'timestamp',
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
            columnNames: ['ticket_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'tickets',
            onDelete: 'CASCADE',
            name: 'FK_TicketId_TicketComments',
          },
          {
            columnNames: ['author_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
            name: 'FK_AuthorId_TicketComments',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('ticket_comments');
  }
}
