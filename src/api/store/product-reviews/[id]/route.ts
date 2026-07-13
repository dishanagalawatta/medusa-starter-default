import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PRODUCT_REVIEWS_MODULE } from "../../../../modules/product-reviews"

export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const reviewsModuleService = req.scope.resolve(PRODUCT_REVIEWS_MODULE)
  const { id } = req.params

  await reviewsModuleService.deleteProductReviews(id)

  res.json({ id, deleted: true })
}
