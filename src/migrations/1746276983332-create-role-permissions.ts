import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRolePermissions1746276983332 implements MigrationInterface {
  name = 'CreateRolePermissions1746276983332';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create roles_has_permissions table
    await queryRunner.query(`
      CREATE TABLE \`roles_has_permissions\` (
        \`id\` CHAR(36) NOT NULL,
        \`role_id\` INT,
        \`permission_name\` VARCHAR(255) NOT NULL,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_role_id\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // Add role_id to user table and FK
    await queryRunner.query(`
      ALTER TABLE \`user\`
      ADD COLUMN \`role_id\` INT NULL,
      ADD CONSTRAINT \`FK_user_role\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`);
    `);

    // Seed permissions
    await queryRunner.query(`
      INSERT INTO \`roles_has_permissions\` (\`id\`, \`role_id\`, \`permission_name\`)
      SELECT UUID(), id, 'UPLOAD_PROFILE_PHOTO' FROM \`roles\`;
    `);

    await queryRunner.query(`
      INSERT INTO \`roles_has_permissions\` (\`id\`, \`role_id\`, \`permission_name\`)
      SELECT UUID(), id, 'UPDATE_PROFILE_INFO' FROM \`roles\`;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_user_role\`;`);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`role_id\`;`);
    await queryRunner.query(`DROP TABLE \`roles_has_permissions\`;`);
  }
}
