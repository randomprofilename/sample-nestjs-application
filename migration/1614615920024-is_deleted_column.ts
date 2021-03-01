import {MigrationInterface, QueryRunner} from "typeorm";

export class isDeletedColumn1614615920024 implements MigrationInterface {
    name = 'isDeletedColumn1614615920024'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "is_deleted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_deleted"`);
    }

}
