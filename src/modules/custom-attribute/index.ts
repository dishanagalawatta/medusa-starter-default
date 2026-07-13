import { Module } from "@medusajs/framework/utils"
import { ProductAttribute } from "./models/product-attribute"

import { MedusaService } from "@medusajs/framework/utils"

export const CUSTOM_ATTRIBUTE_MODULE = "customAttribute"

class CustomAttributeService extends MedusaService({
  ProductAttribute,
}) {}

export default Module(CUSTOM_ATTRIBUTE_MODULE, {
  service: CustomAttributeService
})
