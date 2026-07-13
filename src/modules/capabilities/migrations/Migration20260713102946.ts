import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260713102946 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "capability" add column if not exists "detailed_desc" text null;`);
    this.addSql(`alter table if exists "capability" alter column "images" drop default;`);
    this.addSql(`alter table if exists "capability" alter column "images" type jsonb using ("images"::jsonb);`);
    this.addSql(`alter table if exists "capability" alter column "benefits" drop default;`);
    this.addSql(`alter table if exists "capability" alter column "benefits" type jsonb using ("benefits"::jsonb);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "capability" drop column if exists "detailed_desc";`);

    this.addSql(`alter table if exists "capability" alter column "images" type jsonb using ("images"::jsonb);`);
    this.addSql(`alter table if exists "capability" alter column "images" set default '[]';`);
    this.addSql(`alter table if exists "capability" alter column "benefits" type jsonb using ("benefits"::jsonb);`);
    this.addSql(`alter table if exists "capability" alter column "benefits" set default '[]';`);
  }

}
