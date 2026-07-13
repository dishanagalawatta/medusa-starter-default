import { medusaIntegrationTestRunner } from "@medusajs/test-utils"

jest.setTimeout(60000)

medusaIntegrationTestRunner({
  env: {},
  testSuite: ({ getContainer, api }) => {
    describe("Store Product Reviews API", () => {
      it("should create, list, and delete a product review", async () => {
        const payload = {
          product_id: "prod_123",
          rating: 5,
          title: "Great product",
          content: "I loved it!",
          reviewer_name: "John Doe",
          reviewer_email: "john@example.com"
        }

        const createRes = await api.post("/store/product-reviews", payload)
        expect(createRes.status).toEqual(200)
        expect(createRes.data.product_review.product_id).toEqual("prod_123")
        
        const reviewId = createRes.data.product_review.id

        const listRes = await api.get(`/store/product-reviews?product_id=prod_123`)
        expect(listRes.status).toEqual(200)
        expect(listRes.data.product_reviews.length).toEqual(1)
        expect(listRes.data.product_reviews[0].id).toEqual(reviewId)

        const deleteRes = await api.delete(`/store/product-reviews/${reviewId}`)
        expect(deleteRes.status).toEqual(200)
        expect(deleteRes.data.deleted).toEqual(true)
      })
    })
  }
})
