import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PORTFOLIOS_MODULE } from "../../../modules/portfolios"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const portfoliosModuleService: any = req.scope.resolve(PORTFOLIOS_MODULE)
  // Optionally filter or only return categories that have portfolios
  const categories = await portfoliosModuleService.listPortfolioCategories({}, { relations: ["portfolios"] })
  res.json({ portfolio_categories: categories })
}
