import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PORTFOLIOS_MODULE } from "../../../modules/portfolios"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const portfoliosModuleService: any = req.scope.resolve(PORTFOLIOS_MODULE)
  const portfolios = await portfoliosModuleService.listPortfolios({}, { relations: ["category"] })
  res.json({ portfolios })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const portfoliosModuleService: any = req.scope.resolve(PORTFOLIOS_MODULE)
  const portfolio = await portfoliosModuleService.createPortfolios(req.body as any)
  res.json({ portfolio })
}
