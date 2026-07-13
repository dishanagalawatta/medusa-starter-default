import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260713131028 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "portfolio" add column if not exists "project_url" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "portfolio" drop column if exists "project_url";`);
  }

}
