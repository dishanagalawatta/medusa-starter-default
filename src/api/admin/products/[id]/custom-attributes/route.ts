import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
// import ProductModule from "@medusajs/medusa/product" (not needed anymore)

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const productId = req.params.id

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "product_attributes.*"],
    filters: {
      id: productId,
    },
  })

  res.json({
    product_attributes: products[0]?.product_attributes || [],
  })
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const customAttributeService = req.scope.resolve("customAttribute")
  const remoteLink = req.scope.resolve(ContainerRegistrationKeys.REMOTE_LINK)
  const productId = req.params.id

  const { name, value } = req.body as { name: string, value: string }

  // 1. Create the attribute
  const attribute = await customAttributeService.createProductAttributes({
    name,
    value,
  })

  // 2. Link it to the product
  await remoteLink.create({
    [Modules.PRODUCT]: {
      product_id: productId,
    },
    ["customAttribute"]: {
      product_attribute_id: attribute.id,
    },
  })

  res.json({ product_attribute: attribute })
}
