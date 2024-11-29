import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameTitleColumnToNameInCoffeesTable1728306510699
  implements MigrationInterface
{
  name = 'RenameTitleColumnToNameInCoffeesTable1728306510699';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coffees" RENAME COLUMN "title" TO "name"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coffees" RENAME COLUMN "name" TO "title"`,
    );
  }
}
