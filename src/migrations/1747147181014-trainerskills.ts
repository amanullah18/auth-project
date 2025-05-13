import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class Trainerskills1747147181014 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the trainer_skills table
    await queryRunner.createTable(
      new Table({
        name: 'trainer_skills',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'trainerId',
            type: 'uuid',
          },
          {
            name: 'skillId',
            type: 'uuid',
          },
          {
            name: 'experience_desc',
            type: 'text',
          },
          {
            name: 'years_of_experience',
            type: 'int',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    // Add foreign key for trainerId
    await queryRunner.createForeignKey(
      'trainer_skills',
      new TableForeignKey({
        columnNames: ['trainerId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // Add foreign key for skillId
    await queryRunner.createForeignKey(
      'trainer_skills',
      new TableForeignKey({
        columnNames: ['skillId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'skills',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Get the table 'trainer_skills'
    const table = await queryRunner.getTable('trainer_skills');

    if (table) {
      // Drop the foreign keys if they exist
      const foreignKey1 = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('trainerId') !== -1,
      );
      const foreignKey2 = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('skillId') !== -1,
      );

      if (foreignKey1) {
        await queryRunner.dropForeignKey('trainer_skills', foreignKey1);
      }
      if (foreignKey2) {
        await queryRunner.dropForeignKey('trainer_skills', foreignKey2);
      }

      // Drop the trainer_skills table
      await queryRunner.dropTable('trainer_skills');
    } else {
      console.log("Table 'trainer_skills' not found, skipping foreign key drops.");
    }
  }
}
