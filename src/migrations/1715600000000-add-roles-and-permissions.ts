import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoles1715600000000 implements MigrationInterface {
  name = 'CreateRoles1715600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`roles\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`name\` VARCHAR(255) NOT NULL UNIQUE,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
      INSERT INTO \`roles\` (\`name\`) VALUES ('Admin'), ('Client'), ('Trainer');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`roles\`;`);
  }
}
