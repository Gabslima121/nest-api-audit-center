import { Role } from 'src/api/role/role.entity';
import { UserRole } from 'src/api/user-role/user-role.entity';
import { User } from 'src/api/user/user.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedUserRoleTable1661379113150 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const user = await queryRunner.manager.findOne(User, {
      where: { email: 'gabriel.lima@auditcenter.com.br' },
    });

    const role = await queryRunner.manager.findOne(Role, {
      where: { name: 'SUPER_ADMIN' },
    });

    await queryRunner.manager.save(
      queryRunner.manager.create(UserRole, {
        roleId: role?.id,
        userId: user?.id,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM user_roles`);
  }
}
