import { model } from "@medusajs/framework/utils"

export const LegacyIcon = model.define("legacy_icon", {
  id: model.id().primaryKey(),
  icon_name: model.text().nullable(),
  image_url: model.text().nullable(),
  bg_color: model.text(),
  size: model.number(),
})
