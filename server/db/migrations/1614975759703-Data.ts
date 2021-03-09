import {MigrationInterface, QueryRunner} from "typeorm";

export class Data1614975759703 implements MigrationInterface {
    name = 'Data1614975759703'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
      INSERT INTO users (id, email, password, "firstName", "lastName", superuser, "createdAt", "updatedAt")
      VALUES (0, 'admin@mail.com', '$2b$10$7FBJ7IIGZYIi88hM358zkOmG4x5bMsvS6VswZw6uBgDYi646nC1XS', 'User', 'Admin', true, '2021-01-21 15:30:35.719+00', '2021-02-25 14:48:49.67+00')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

    }

}
