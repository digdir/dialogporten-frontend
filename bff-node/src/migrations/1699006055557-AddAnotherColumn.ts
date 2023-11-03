import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAnotherColumn1699006055557 implements MigrationInterface {
    name = 'AddAnotherColumn1699006055557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "person" ADD "anotherColumn" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "anotherColumn"`);
    }

}
