import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationName1746276983331 implements MigrationInterface {
  name = 'MigrationName1746276983331';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create roles table
    await queryRunner.query(`
      CREATE TABLE \`roles\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`name\` VARCHAR(255) NOT NULL UNIQUE,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB;
    `);

    // Create role-permissions table
    await queryRunner.query(`
      CREATE TABLE \`roles_has_permissions\` (
        \`id\` CHAR(36) NOT NULL,
        \`role_id\` INT,
        \`permission_name\` VARCHAR(255) NOT NULL,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_role_id\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // Alter user table to add role_id and foreign key
    await queryRunner.query(`
      ALTER TABLE \`user\`
      ADD COLUMN \`role_id\` INT NULL,
      ADD CONSTRAINT \`FK_user_role\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`);
    `);

    // Insert default roles
    await queryRunner.query(`
      INSERT INTO \`roles\` (\`name\`) VALUES ('Admin'), ('Client'), ('Trainer');
    `);

    // Insert permissions for each role
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
    await queryRunner.query(`DROP TABLE \`roles\`;`);
  }
}
