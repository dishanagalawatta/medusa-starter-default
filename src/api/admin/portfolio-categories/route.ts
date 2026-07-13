import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PORTFOLIOS_MODULE } from "../../../modules/portfolios"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const portfoliosModuleService: any = req.scope.resolve(PORTFOLIOS_MODULE)
  const categories = await portfoliosModuleService.listPortfolioCategories({}, { relations: ["portfolios"] })
  res.json({ portfolio_categories: categories })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const portfoliosModuleService: any = req.scope.resolve(PORTFOLIOS_MODULE)
  const category = await portfoliosModuleService.createPortfolioCategories(req.body as any)
  res.json({ portfolio_category: category })
}
