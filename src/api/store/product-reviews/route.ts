import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PRODUCT_REVIEWS_MODULE } from "../../../modules/product-reviews"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const reviewsModuleService = req.scope.resolve(PRODUCT_REVIEWS_MODULE)
  const product_id = req.query.product_id as string | undefined
  const reviewer_email = req.query.reviewer_email as string | undefined
  
  const filters: Record<string, any> = {}
  if (product_id) filters.product_id = product_id
  if (reviewer_email) filters.reviewer_email = reviewer_email

  const product_reviews = await reviewsModuleService.listProductReviews(filters, {
    order: { created_at: "DESC" }
  })

  res.json({ product_reviews })
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const reviewsModuleService = req.scope.resolve(PRODUCT_REVIEWS_MODULE)
  
  const payload = req.body as {
    product_id: string
    rating: number
    title: string
    content: string
    reviewer_name: string
    reviewer_email?: string
  }

  const review = await reviewsModuleService.createProductReviews(payload)

  res.json({ product_review: review })
}
