import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260713100203 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "capability" ("id" text not null, "title" text not null, "desc" text not null, "tab" text check ("tab" in ('electronics', 'automation', 'installations', 'services')) not null, "icon" text not null, "images" jsonb not null default '[]', "price" text not null, "benefits" jsonb not null default '[]', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "capability_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_capability_deleted_at" ON "capability" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "capability" cascade;`);
  }

}
