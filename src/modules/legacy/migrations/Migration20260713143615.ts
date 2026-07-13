import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260713143615 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "legacy_icon" ("id" text not null, "icon_name" text null, "image_url" text null, "bg_color" text not null, "size" integer not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "legacy_icon_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_legacy_icon_deleted_at" ON "legacy_icon" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "legacy_stat" ("id" text not null, "count" text not null, "label" text not null, "order" integer not null default 0, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "legacy_stat_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_legacy_stat_deleted_at" ON "legacy_stat" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "legacy_icon" cascade;`);

    this.addSql(`drop table if exists "legacy_stat" cascade;`);
  }

}
