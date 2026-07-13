import { model } from "@medusajs/framework/utils"
import { PortfolioCategory } from "./portfolio-category"

export const Portfolio = model.define("portfolio", {
  id: model.id().primaryKey(),
  title: model.text(),
  category: model.belongsTo(() => PortfolioCategory, {
    mappedBy: "portfolios",
  }),
  icon: model.text().nullable(),
  gradient: model.text().nullable(),
  overview: model.text(),
  specs: model.json(),
  images: model.json(),
  project_url: model.text().nullable(),
})
