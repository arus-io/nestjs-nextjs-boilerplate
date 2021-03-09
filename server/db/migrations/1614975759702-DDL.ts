import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1614975759702 implements MigrationInterface {
    name = 'Initial1614975759702'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "companies" (
                "id" SERIAL NOT NULL,
                "name" character varying(255),
                "subdomain" character varying(255) NOT NULL,
                "supportEmail" character varying(255),
                "twoFactorEnabled" boolean NOT NULL DEFAULT false,
                "logo" character varying(255),
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL,
                "email" character varying(255) NOT NULL,
                "password" character varying(255),
                "twoFactorEnabledTOTP" boolean NOT NULL DEFAULT false,
                "twoFactorEnabledSMS" boolean NOT NULL DEFAULT false,
                "twoFactorSecret" character varying,
                "twoFactorCounter" integer NOT NULL DEFAULT '0',
                "firstName" character varying(100),
                "lastName" character varying(100),
                "superuser" boolean DEFAULT false,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "personalEmail" character varying(255),
                "phone" character varying(100),
                "verificationToken" character varying(255) DEFAULT false,
                "companyId" integer,
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "messages_medium_enum" AS ENUM('EMAIL', 'SMS')
        `);
        await queryRunner.query(`
            CREATE TABLE "messages" (
                "id" SERIAL NOT NULL,
                "initiatorId" integer,
                "receiverId" integer,
                "code" character varying(32) NOT NULL,
                "to" character varying(128) NOT NULL,
                "from" character varying(128) NOT NULL,
                "subject" character varying(128) NOT NULL DEFAULT '',
                "body" text NOT NULL,
                "error" text,
                "medium" "messages_medium_enum" NOT NULL,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "users_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "messages"
            ADD CONSTRAINT "messages_initiatorId_fkey" FOREIGN KEY ("initiatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "messages"
            ADD CONSTRAINT "messages_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

      // Data seed
      await queryRunner.query(`
      INSERT INTO users (id, email, password, "firstName", "lastName", superuser, "createdAt", "updatedAt", "deletedAt")
      VALUES (0, 'admin@mail.com', '$2b$10$7FBJ7IIGZYIi88hM358zkOmG4x5bMsvS6VswZw6uBgDYi646nC1XS', 'User', 'Admin', true, '2021-01-21 15:30:35.719+00', '2021-02-25 14:48:49.67+00')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "messages" DROP CONSTRAINT "messages_receiverId_fkey"
        `);
        await queryRunner.query(`
            ALTER TABLE "messages" DROP CONSTRAINT "messages_initiatorId_fkey"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "users_companyId_fkey"
        `);
        await queryRunner.query(`
            DROP TABLE "messages"
        `);
        await queryRunner.query(`
            DROP TYPE "messages_medium_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
        await queryRunner.query(`
            DROP TABLE "companies"
        `);
    }

}
