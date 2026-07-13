import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260711020405 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "product_attribute" ("id" text not null, "name" text not null, "value" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_attribute_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_attribute_deleted_at" ON "product_attribute" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "product_attribute" cascade;`);
  }

}
