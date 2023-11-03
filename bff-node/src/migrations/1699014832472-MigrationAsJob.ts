import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationAsJob1699014832472 implements MigrationInterface {
    name = 'MigrationAsJob1699014832472'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "person" ADD "migrationAsJobColumn" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "migrationAsJobColumn"`);
    }

}
