import { model } from "@medusajs/framework/utils"

export const ProductAttribute = model.define("product_attribute", {
  id: model.id().primaryKey(),
  name: model.text(),
  value: model.text(),
})
