import { MedusaService } from "@medusajs/framework/utils"
import { Review } from "./models/review"

class CustomerReviewsService extends MedusaService({
  Review,
}) {}

export default CustomerReviewsService
