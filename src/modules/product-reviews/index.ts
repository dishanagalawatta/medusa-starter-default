import { Module } from "@medusajs/framework/utils"
import ProductReviewsService from "./service"

export const PRODUCT_REVIEWS_MODULE = "product_reviews"

export default Module(PRODUCT_REVIEWS_MODULE, {
  service: ProductReviewsService,
})
