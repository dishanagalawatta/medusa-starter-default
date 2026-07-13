import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CUSTOMER_REVIEWS_MODULE } from "../../../modules/customer_reviews"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const reviewsService: any = req.scope.resolve(CUSTOMER_REVIEWS_MODULE)
  const reviews = await reviewsService.listReviews()

  res.json({ reviews })
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const reviewsService: any = req.scope.resolve(CUSTOMER_REVIEWS_MODULE)
  
  const review = await reviewsService.createReviews(req.validatedBody as any)

  res.json({ review })
}
