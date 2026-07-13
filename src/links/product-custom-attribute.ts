import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import CustomAttributeModule from "../modules/custom-attribute"

export default defineLink(
  ProductModule.linkable.product,
  {
    linkable: CustomAttributeModule.linkable.productAttribute,
    isList: true,
  }
)
