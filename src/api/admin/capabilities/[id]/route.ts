import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CAPABILITIES_MODULE } from "../../../../modules/capabilities"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const capabilitiesService: any = req.scope.resolve(CAPABILITIES_MODULE)
  const { id } = req.params

  const capability = await capabilitiesService.retrieveCapability(id)

  res.json({ capability })
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const capabilitiesService: any = req.scope.resolve(CAPABILITIES_MODULE)
  const { id } = req.params

  const capability = await capabilitiesService.updateCapabilities({
    id,
    ...(req.validatedBody as any),
  })

  res.json({ capability })
}

export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const capabilitiesService: any = req.scope.resolve(CAPABILITIES_MODULE)
  const { id } = req.params

  await capabilitiesService.deleteCapabilities(id)

  res.json({
    id,
    object: "capability",
    deleted: true,
  })
}
