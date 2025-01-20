import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMigrationColumn1737375697452 implements MigrationInterface {
  name = 'AddMigrationColumn1737375697452';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "profile" ADD "migrationtest" character varying(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "migrationtest"`);
  }
}
