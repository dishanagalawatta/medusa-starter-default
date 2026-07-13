import { Module } from "@medusajs/framework/utils"
import LegacyModuleService from "./service"

export const LEGACY_MODULE = "legacy"

export default Module(LEGACY_MODULE, {
  service: LegacyModuleService,
})
