import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CAPABILITIES_MODULE } from "../../../modules/capabilities"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const capabilitiesService: any = req.scope.resolve(CAPABILITIES_MODULE)
  const capabilities = await capabilitiesService.listCapabilities()

  res.json({ capabilities })
}
