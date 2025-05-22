import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class Trainerskills1715600000006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'trainer_skills',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { 
            name: 'trainerId',
            type: 'int',
            length: '11',  // Added length to match users.id
            isNullable: false,
            unsigned: false, // Explicitly set to match users.id
          },
          {
            name: 'skillId',
            type: 'varchar',
            length: '36',
            isNullable: false,
          },
          {
            name: 'experience_desc',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'years_of_experience',
            type: 'int',
            isNullable: false,
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
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    // Create foreign key for trainerId -> users.id
    await queryRunner.createForeignKey(
      'trainer_skills',
      new TableForeignKey({
        columnNames: ['trainerId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // Create foreign key for skillId -> skills.id (assuming skills table exists)
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
    const table = await queryRunner.getTable('trainer_skills');

    if (table) {
      const fk1 = table.foreignKeys.find(fk => fk.columnNames.includes('trainerId'));
      const fk2 = table.foreignKeys.find(fk => fk.columnNames.includes('skillId'));

      if (fk1) await queryRunner.dropForeignKey('trainer_skills', fk1);
      if (fk2) await queryRunner.dropForeignKey('trainer_skills', fk2);

      await queryRunner.dropTable('trainer_skills');
    }
  }
}