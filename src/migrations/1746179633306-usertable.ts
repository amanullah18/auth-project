import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class UserTable1746179633306 implements MigrationInterface {
  name = 'UserTable1746179633306';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the user table
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'fullName',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'roleId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'profilePhotoUrl',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'gender',
            type: 'enum',
            enum: ['MALE', 'FEMALE', 'OTHER'],
            isNullable: true,
          },
        ],
      }),
    );

    // If you have a 'roles' table, add the foreign key for roleId
    // Remove this part if the roles table does not exist yet
    await queryRunner.createForeignKey(
      'user',
      new TableForeignKey({
        columnNames: ['roleId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles', // Adjust this if you have a different table name for roles
        onDelete: 'SET NULL', // Adjust the delete behavior if needed
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key for roleId
    const table = await queryRunner.getTable('user');
    const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf('roleId') !== -1);
    if (foreignKey) {
      await queryRunner.dropForeignKey('user', foreignKey);
    }

    // Drop the user table
    await queryRunner.dropTable('user');
  }
}
