import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSlotsTable1715600000003 implements MigrationInterface {
  name = 'CreateSlotsTable1715600000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'slots',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'date',
            type: 'date',
          },
          {
            name: 'startTime',
            type: 'varchar',
            length: '5', // HH:MM format
          },
          {
            name: 'endTime',
            type: 'varchar',
            length: '5', // HH:MM format
          },
          {
            name: 'isAvailable',
            type: 'boolean',
            default: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('slots');
  }
} 