import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameTitleColumnToNameInCoffeesTable1735655084023 implements MigrationInterface {
    name = 'RenameTitleColumnToNameInCoffeesTable1735655084023'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_coffees" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "brand" varchar NOT NULL, "flavors" json)`);
        await queryRunner.query(`INSERT INTO "temporary_coffees"("id", "name", "brand", "flavors") SELECT "id", "title", "brand", "flavors" FROM "coffees"`);
        await queryRunner.query(`DROP TABLE "coffees"`);
        await queryRunner.query(`ALTER TABLE "temporary_coffees" RENAME TO "coffees"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffees" RENAME TO "temporary_coffees"`);
        await queryRunner.query(`CREATE TABLE "coffees" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "brand" varchar NOT NULL, "flavors" json)`);
        await queryRunner.query(`INSERT INTO "coffees"("id", "title", "brand", "flavors") SELECT "id", "name", "brand", "flavors" FROM "temporary_coffees"`);
        await queryRunner.query(`DROP TABLE "temporary_coffees"`);
    }

}
