import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { LEGACY_MODULE } from "../../../../modules/legacy"
import LegacyModuleService from "../../../../modules/legacy/service"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const legacyModuleService: LegacyModuleService = req.scope.resolve(LEGACY_MODULE)
  
  const icons = await legacyModuleService.listLegacyIcons()

  res.json({ icons })
}
