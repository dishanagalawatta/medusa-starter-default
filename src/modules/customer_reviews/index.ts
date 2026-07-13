import { Module } from "@medusajs/framework/utils"
import CustomerReviewsService from "./service"

export const CUSTOMER_REVIEWS_MODULE = "customer_reviews"

export default Module(CUSTOMER_REVIEWS_MODULE, {
  service: CustomerReviewsService,
})
