import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewColumn1698939312719 implements MigrationInterface {
    name = 'AddNewColumn1698939312719'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "person" ADD "newColumn" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "newColumn"`);
    }

}
