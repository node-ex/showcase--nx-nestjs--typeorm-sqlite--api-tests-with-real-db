import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCoffeesTable1735654846044 implements MigrationInterface {
    name = 'CreateCoffeesTable1735654846044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "coffees" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "brand" varchar NOT NULL, "flavors" json)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "coffees"`);
    }

}
