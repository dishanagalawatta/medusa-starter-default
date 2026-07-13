import { MedusaService } from "@medusajs/framework/utils"
import { LegacyStat } from "./models/legacy-stat"
import { LegacyIcon } from "./models/legacy-icon"

class LegacyModuleService extends MedusaService({
  LegacyStat,
  LegacyIcon,
}) {}

export default LegacyModuleService
