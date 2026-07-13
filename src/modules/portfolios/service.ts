import { MedusaService } from "@medusajs/framework/utils"
import { PortfolioCategory } from "./models/portfolio-category"
import { Portfolio } from "./models/portfolio"

class PortfoliosService extends MedusaService({
  PortfolioCategory,
  Portfolio,
}) {
}

export default PortfoliosService
