import { MedusaService } from "@medusajs/framework/utils"
import { ProductReview } from "./models/product-review"

class ProductReviewsService extends MedusaService({
  ProductReview,
}) {
}

export default ProductReviewsService
