import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class TrainerskillsImages1747147197086 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create trainer_skill_images table
    await queryRunner.createTable(
      new Table({
        name: 'trainer_skill_images',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'trainerSkillId',
            type: 'uuid',
          },
          {
            name: 'image_url',
            type: 'varchar',
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
    // Get the table
    const table = await queryRunner.getTable('trainer_skill_images');
    
    // Check if the table is found before accessing foreign keys
    if (table) {
      // Find the foreign key for trainerSkillId
      const foreignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('trainerSkillId') !== -1,
      );

      // If foreign key exists, drop it
      if (foreignKey) {
        await queryRunner.dropForeignKey('trainer_skill_images', foreignKey);
      }

      // Drop the trainer_skill_images table
      await queryRunner.dropTable('trainer_skill_images');
    } else {
      console.log("Table 'trainer_skill_images' not found, skipping foreign key drops.");
    }
  }
}
