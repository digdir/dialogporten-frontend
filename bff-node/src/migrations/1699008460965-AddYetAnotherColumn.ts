import { MigrationInterface, QueryRunner } from "typeorm";

export class AddYetAnotherColumn1699008460965 implements MigrationInterface {
    name = 'AddYetAnotherColumn1699008460965'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "person" ADD "anotherColumn" integer`);
        await queryRunner.query(`ALTER TABLE "person" ADD "yetAnotherColumn" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "yetAnotherColumn"`);
        await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "anotherColumn"`);
    }

}
