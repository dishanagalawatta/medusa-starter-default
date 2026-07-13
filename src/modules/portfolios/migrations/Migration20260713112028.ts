import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260713112028 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "portfolio_category" ("id" text not null, "name" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "portfolio_category_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_portfolio_category_deleted_at" ON "portfolio_category" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "portfolio" ("id" text not null, "title" text not null, "category_id" text not null, "icon" text null, "gradient" text null, "overview" text not null, "specs" jsonb not null, "images" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "portfolio_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_portfolio_category_id" ON "portfolio" ("category_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_portfolio_deleted_at" ON "portfolio" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "portfolio" add constraint "portfolio_category_id_foreign" foreign key ("category_id") references "portfolio_category" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "portfolio" drop constraint if exists "portfolio_category_id_foreign";`);

    this.addSql(`drop table if exists "portfolio_category" cascade;`);

    this.addSql(`drop table if exists "portfolio" cascade;`);
  }

}
