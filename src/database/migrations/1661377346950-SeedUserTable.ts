import { User } from 'src/api/user/user.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { hash } from 'bcrypt';

export class SeedUserTable1661377346950 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hashedPassword = await hash('12341234', 12);

    await queryRunner.manager.save(
      queryRunner.manager.create<User>(User, {
        name: 'Gabriel Oliveira Lima',
        cpf: '489.340.988-30',
        email: 'gabriel.lima@auditcenter.com.br',
        password: hashedPassword,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM users`);
  }
}
