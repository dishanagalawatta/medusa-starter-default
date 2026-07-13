import { model } from "@medusajs/framework/utils"

export const LegacyStat = model.define("legacy_stat", {
  id: model.id().primaryKey(),
  count: model.text(),
  label: model.text(),
  order: model.number().default(0),
})
