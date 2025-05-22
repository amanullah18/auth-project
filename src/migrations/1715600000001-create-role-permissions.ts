import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRolePermissions1715600000001 implements MigrationInterface {
  name = 'CreateRolePermissions1715600000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create roles_has_permissions table only
    await queryRunner.query(`
      CREATE TABLE \`roles_has_permissions\` (
        \`id\` CHAR(36) NOT NULL,
        \`role_id\` INT,
        \`permission_name\` VARCHAR(255) NOT NULL,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_role_id\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // Seed permissions - wait until after user table is created
    // We'll move this to a separate migration or do it after user table exists
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`roles_has_permissions\`;`);
  }
}