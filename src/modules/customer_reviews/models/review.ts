import { model } from "@medusajs/framework/utils"

export const Review = model.define("review", {
  id: model.id().primaryKey(),
  name: model.text(),
  role: model.text(),
  avatar: model.text(),
  text: model.text(),
  time: model.text(),
  type: model.enum(["sent", "received"]),
})
