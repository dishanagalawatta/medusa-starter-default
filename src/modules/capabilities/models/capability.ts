import { model } from "@medusajs/framework/utils"

export const Capability = model.define("capability", {
  id: model.id().primaryKey(),
  title: model.text(),
  desc: model.text(),
  detailed_desc: model.text().nullable(),
  tab: model.enum(['electronics', 'automation', 'installations', 'services']),
  icon: model.text(),
  images: model.json(),
  price: model.text(),
  benefits: model.json(),
})
