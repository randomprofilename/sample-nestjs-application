import {MigrationInterface, QueryRunner} from "typeorm";

export class initializeTables1614615075906 implements MigrationInterface {
    name = 'initializeTables1614615075906'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "group" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "friends" ("userId_1" integer NOT NULL, "userId_2" integer NOT NULL, CONSTRAINT "PK_eb136507de7a87538dfd7dd0842" PRIMARY KEY ("userId_1", "userId_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_13fb33190c3333cbad7e5c8e75" ON "friends" ("userId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_1867d7b94efcf02ed2c0bd183f" ON "friends" ("userId_2") `);
        await queryRunner.query(`CREATE TABLE "user_group" ("groupId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_d9a1801971c4c66927d77560e73" PRIMARY KEY ("groupId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_31e541c93fdc0bb63cfde6549b" ON "user_group" ("groupId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3d6b372788ab01be58853003c9" ON "user_group" ("userId") `);
        await queryRunner.query(`ALTER TABLE "friends" ADD CONSTRAINT "FK_13fb33190c3333cbad7e5c8e750" FOREIGN KEY ("userId_1") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friends" ADD CONSTRAINT "FK_1867d7b94efcf02ed2c0bd183f5" FOREIGN KEY ("userId_2") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_group" ADD CONSTRAINT "FK_31e541c93fdc0bb63cfde6549b7" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_group" ADD CONSTRAINT "FK_3d6b372788ab01be58853003c93" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_group" DROP CONSTRAINT "FK_3d6b372788ab01be58853003c93"`);
        await queryRunner.query(`ALTER TABLE "user_group" DROP CONSTRAINT "FK_31e541c93fdc0bb63cfde6549b7"`);
        await queryRunner.query(`ALTER TABLE "friends" DROP CONSTRAINT "FK_1867d7b94efcf02ed2c0bd183f5"`);
        await queryRunner.query(`ALTER TABLE "friends" DROP CONSTRAINT "FK_13fb33190c3333cbad7e5c8e750"`);
        await queryRunner.query(`DROP INDEX "IDX_3d6b372788ab01be58853003c9"`);
        await queryRunner.query(`DROP INDEX "IDX_31e541c93fdc0bb63cfde6549b"`);
        await queryRunner.query(`DROP TABLE "user_group"`);
        await queryRunner.query(`DROP INDEX "IDX_1867d7b94efcf02ed2c0bd183f"`);
        await queryRunner.query(`DROP INDEX "IDX_13fb33190c3333cbad7e5c8e75"`);
        await queryRunner.query(`DROP TABLE "friends"`);
        await queryRunner.query(`DROP TABLE "group"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
