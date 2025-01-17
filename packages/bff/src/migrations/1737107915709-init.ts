import type { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1737107915709 implements MigrationInterface {
  name = 'Init1737107915709';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "profile" ("sub" character varying NOT NULL, "language" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_3059981911fde58b299c8cbeeee" PRIMARY KEY ("sub"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "saved_search" ("id" SERIAL NOT NULL, "data" json NOT NULL, "name" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "profileSub" character varying, CONSTRAINT "PK_563b338d8b4878fa46697c8f3f2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "saved_search" ADD CONSTRAINT "FK_110ba74a1e7ecaaffb8912ab207" FOREIGN KEY ("profileSub") REFERENCES "profile"("sub") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "saved_search" DROP CONSTRAINT "FK_110ba74a1e7ecaaffb8912ab207"`);
    await queryRunner.query(`DROP TABLE "saved_search"`);
    await queryRunner.query(`DROP TABLE "profile"`);
  }
}
