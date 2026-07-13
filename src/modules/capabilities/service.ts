import { MedusaService } from "@medusajs/framework/utils"
import { Capability } from "./models/capability"

class CapabilitiesService extends MedusaService({
  Capability,
}) {
}

export default CapabilitiesService
