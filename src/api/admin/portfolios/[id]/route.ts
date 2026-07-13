import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PORTFOLIOS_MODULE } from "../../../../modules/portfolios"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const portfoliosModuleService: any = req.scope.resolve(PORTFOLIOS_MODULE)
  const { id } = req.params
  const portfolio = await portfoliosModuleService.retrievePortfolio(id, { relations: ["category"] })
  res.json({ portfolio })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const portfoliosModuleService: any = req.scope.resolve(PORTFOLIOS_MODULE)
  const { id } = req.params
  const portfolio = await portfoliosModuleService.updatePortfolios({
    id,
    ...(req.body as any),
  })
  res.json({ portfolio })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const portfoliosModuleService: any = req.scope.resolve(PORTFOLIOS_MODULE)
  const { id } = req.params
  await portfoliosModuleService.deletePortfolios(id)
  res.json({ success: true })
}
