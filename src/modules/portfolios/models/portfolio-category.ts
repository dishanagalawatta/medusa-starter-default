import { model } from "@medusajs/framework/utils"
import { Portfolio } from "./portfolio"

export const PortfolioCategory = model.define("portfolio_category", {
  id: model.id().primaryKey(),
  name: model.text(),
  portfolios: model.hasMany(() => Portfolio, {
    mappedBy: "category"
  })
})
