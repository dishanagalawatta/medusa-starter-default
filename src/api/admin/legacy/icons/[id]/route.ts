import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { LEGACY_MODULE } from "../../../../../modules/legacy"
import LegacyModuleService from "../../../../../modules/legacy/service"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const legacyModuleService: LegacyModuleService = req.scope.resolve(LEGACY_MODULE)
  
  const icon = await legacyModuleService.retrieveLegacyIcon(req.params.id)

  res.json({ icon })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const legacyModuleService: LegacyModuleService = req.scope.resolve(LEGACY_MODULE)
  
  const icon = await legacyModuleService.updateLegacyIcons({
    id: req.params.id,
    ...(req.body as any),
  })

  res.json({ icon })
}

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const legacyModuleService: LegacyModuleService = req.scope.resolve(LEGACY_MODULE)
  
  await legacyModuleService.deleteLegacyIcons(req.params.id)

  res.json({
    id: req.params.id,
    object: "legacy_icon",
    deleted: true,
  })
}
