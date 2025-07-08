import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateAppointmentsTable1715600000004 implements MigrationInterface {
  name = 'CreateAppointmentsTable1715600000004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'appointments',
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
            name: 'slotId',
            type: 'varchar',
            length: '36',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'BOOKED'",
          },
          {
            name: 'googleMeetLink',
            type: 'text',
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    // Add foreign key to slots table
    await queryRunner.createForeignKey(
      'appointments',
      new TableForeignKey({
        columnNames: ['slotId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'slots',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key
    const table = await queryRunner.getTable('appointments');
    const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf('slotId') !== -1);
    if (foreignKey) {
      await queryRunner.dropForeignKey('appointments', foreignKey);
    }
    
    // Drop the appointments table
    await queryRunner.dropTable('appointments');
  }
} 