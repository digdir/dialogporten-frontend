import { MigrationInterface, QueryRunner } from "typeorm";

export class Initialization1700139653377 implements MigrationInterface {
    name = 'Initialization1700139653377'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "start_up" ("id" SERIAL NOT NULL, "version" character varying NOT NULL, "note" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_0bc7ae8d35b360ffae7b9e8da5a" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "start_up"`);
    }

}
