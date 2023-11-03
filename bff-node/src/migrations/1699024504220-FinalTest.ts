import { MigrationInterface, QueryRunner } from "typeorm";

export class FinalTest1699024504220 implements MigrationInterface {
    name = 'FinalTest1699024504220'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "person" ADD "finalTest" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "finalTest"`);
    }

}
