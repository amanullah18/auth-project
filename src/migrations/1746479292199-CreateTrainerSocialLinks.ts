import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTrainerSocialLinksTable1744390100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \trainer_social_links\ (
      \id\ BIGINT AUTO_INCREMENT PRIMARY KEY,
      \url\ VARCHAR(500) NOT NULL,
      \trainer_id\ BIGINT NOT NULL,
      \created_at\ TIMESTAMP DEFAULT now(),
      \updated_at\ TIMESTAMP DEFAULT now(),
      CONSTRAINT \FK_trainer_social_links_trainer_id\ FOREIGN KEY (\trainer_id\) REFERENCES \users\(\id\) ON DELETE CASCADE
    ) ENGINE=InnoDB`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \trainer_social_links\`);
  }
}