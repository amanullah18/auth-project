import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateGalleryImagesTable1715600000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'gallery_images',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'filename',
            type: 'varchar',
          },
          {
            name: 'fileUrl',
            type: 'varchar',
          },
          {
            name: 'caption',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'sortOrder',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'uploadTimestamp',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'user_id',
            type: 'int',
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      'gallery_images',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('gallery_images');
    if (table) {
      const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.includes('user_id'));
      if (foreignKey) {
        await queryRunner.dropForeignKey('gallery_images', foreignKey);
      }
    }
    await queryRunner.dropTable('gallery_images');
  }
}
