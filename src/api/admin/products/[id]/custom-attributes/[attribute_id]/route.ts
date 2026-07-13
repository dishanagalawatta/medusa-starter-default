import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
// import ProductModule from "@medusajs/medusa/product"

export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const customAttributeService = req.scope.resolve("customAttribute")
  const remoteLink = req.scope.resolve(ContainerRegistrationKeys.REMOTE_LINK)
  
  const productId = req.params.id
  const attributeId = req.params.attribute_id

  // 1. Remove the link
  await remoteLink.dismiss({
    [Modules.PRODUCT]: {
      product_id: productId,
    },
    ["customAttribute"]: {
      product_attribute_id: attributeId,
    },
  })

  // 2. Delete the attribute entirely
  await customAttributeService.deleteProductAttributes(attributeId)

  res.json({ id: attributeId, object: "product_attribute", deleted: true })
}
