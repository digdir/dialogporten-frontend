import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFinalColumn1699012536323 implements MigrationInterface {
    name = 'AddFinalColumn1699012536323'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "person" ADD "finalColumn" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "finalColumn"`);
    }

}
