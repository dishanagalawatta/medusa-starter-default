import { Module } from "@medusajs/framework/utils"
import PortfoliosService from "./service"

export const PORTFOLIOS_MODULE = "portfolios"

export default Module(PORTFOLIOS_MODULE, {
  service: PortfoliosService,
})
