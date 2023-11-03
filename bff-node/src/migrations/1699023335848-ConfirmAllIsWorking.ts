import { MigrationInterface, QueryRunner } from "typeorm";

export class ConfirmAllIsWorking1699023335848 implements MigrationInterface {
    name = 'ConfirmAllIsWorking1699023335848'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "person" ADD "confirmAllIsWorking" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "confirmAllIsWorking"`);
    }

}
