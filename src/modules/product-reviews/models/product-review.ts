import { model } from "@medusajs/framework/utils"

export const ProductReview = model.define("product_review", {
  id: model.id().primaryKey(),
  product_id: model.text().searchable(),
  rating: model.number(),
  title: model.text(),
  content: model.text(),
  reviewer_name: model.text(),
  reviewer_email: model.text().nullable(),
})
