import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PORTFOLIOS_MODULE } from "../../../../modules/portfolios"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const portfoliosModuleService: any = req.scope.resolve(PORTFOLIOS_MODULE)
  const { id } = req.params
  const category = await portfoliosModuleService.retrievePortfolioCategory(id, { relations: ["portfolios"] })
  res.json({ portfolio_category: category })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const portfoliosModuleService: any = req.scope.resolve(PORTFOLIOS_MODULE)
  const { id } = req.params
  const category = await portfoliosModuleService.updatePortfolioCategories({
    id,
    ...(req.body as any),
  })
  res.json({ portfolio_category: category })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const portfoliosModuleService: any = req.scope.resolve(PORTFOLIOS_MODULE)
  const { id } = req.params
  await portfoliosModuleService.deletePortfolioCategories(id)
  res.json({ success: true })
}
