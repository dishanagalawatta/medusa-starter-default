import { Module } from "@medusajs/framework/utils"
import CapabilitiesService from "./service"

export const CAPABILITIES_MODULE = "capabilities"

export default Module(CAPABILITIES_MODULE, {
  service: CapabilitiesService,
})
