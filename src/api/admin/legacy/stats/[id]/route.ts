import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { LEGACY_MODULE } from "../../../../../modules/legacy"
import LegacyModuleService from "../../../../../modules/legacy/service"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const legacyModuleService: LegacyModuleService = req.scope.resolve(LEGACY_MODULE)
  
  const stat = await legacyModuleService.retrieveLegacyStat(req.params.id)

  res.json({ stat })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const legacyModuleService: LegacyModuleService = req.scope.resolve(LEGACY_MODULE)
  
  const stat = await legacyModuleService.updateLegacyStats({
    id: req.params.id,
    ...(req.body as any),
  })

  res.json({ stat })
}

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const legacyModuleService: LegacyModuleService = req.scope.resolve(LEGACY_MODULE)
  
  await legacyModuleService.deleteLegacyStats(req.params.id)

  res.json({
    id: req.params.id,
    object: "legacy_stat",
    deleted: true,
  })
}
