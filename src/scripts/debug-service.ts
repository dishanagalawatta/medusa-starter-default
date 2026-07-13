import { ExecArgs } from "@medusajs/framework/types"
import { PORTFOLIOS_MODULE } from "../modules/portfolios"

export default async function debugPortfolios({ container }: ExecArgs) {
  const service = container.resolve(PORTFOLIOS_MODULE)
  console.log("Keys in service:", Object.keys(service).filter(k => !k.startsWith("_") && !k.startsWith("constructor")))
  
  try {
    const list = await (service as any).listPortfolios()
    console.log("listPortfolios count:", list.length)
  } catch (e: any) {
    console.log("listPortfolios error:", e.message)
  }
  
  try {
    const list2 = await (service as any).listPortfolioes()
    console.log("listPortfolioes count:", list2.length)
  } catch (e: any) {
    console.log("listPortfolioes error:", e.message)
  }
}
