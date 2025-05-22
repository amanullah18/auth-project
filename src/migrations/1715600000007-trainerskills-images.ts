import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class TrainerskillsImages1715600000007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create trainer_skill_images table
    await queryRunner.createTable(
      new Table({
        name: 'trainer_skill_images',
        columns: [
          {
            name: 'id',
            type: 'int', // ✅ Use int instead of number
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment', // ✅ Use increment for numeric PK
          },
          {
            name: 'trainerSkillId',
            type: 'int', // ✅ Corrected type
          },
          {
            name: 'image_url',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    // Add foreign key for trainerSkillId
    await queryRunner.createForeignKey(
      'trainer_skill_images',
      new TableForeignKey({
        columnNames: ['trainerSkillId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'trainer_skills',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('trainer_skill_images');
    if (table) {
      const foreignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.includes('trainerSkillId'),
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('trainer_skill_images', foreignKey);
      }
      await queryRunner.dropTable('trainer_skill_images');
    }
  }
}