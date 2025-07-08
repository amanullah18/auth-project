import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class UserTable1715600000002 implements MigrationInterface {
  name = 'UserTable1715600000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the user table with roleId column included
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
            name: 'gender',
            type: 'enum',
            enum: ['MALE', 'FEMALE', 'OTHER'],
            isNullable: true,
          },
        ],
      }),
    );

    // Add the foreign key for roleId (roles table already exists at this point)
    await queryRunner.createForeignKey(
      'user',
      new TableForeignKey({
        columnNames: ['roleId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
        onDelete: 'SET NULL',
      }),
    );

    // Seed permissions data (moved from CreateRolePermissions migration)
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
    // Clean up permissions data
    await queryRunner.query(`DELETE FROM \`roles_has_permissions\` WHERE \`permission_name\` IN ('UPLOAD_PROFILE_PHOTO', 'UPDATE_PROFILE_INFO');`);

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