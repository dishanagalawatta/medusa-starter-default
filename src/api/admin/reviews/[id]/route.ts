import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CUSTOMER_REVIEWS_MODULE } from "../../../../modules/customer_reviews"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const reviewsService: any = req.scope.resolve(CUSTOMER_REVIEWS_MODULE)
  const { id } = req.params

  const review = await reviewsService.retrieveReview(id)

  res.json({ review })
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const reviewsService: any = req.scope.resolve(CUSTOMER_REVIEWS_MODULE)
  const { id } = req.params

  const review = await reviewsService.updateReviews({
    id,
    ...(req.validatedBody as any),
  })

  res.json({ review })
}

export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const reviewsService: any = req.scope.resolve(CUSTOMER_REVIEWS_MODULE)
  const { id } = req.params

  await reviewsService.deleteReviews(id)

  res.json({
    id,
    object: "review",
    deleted: true,
  })
}
