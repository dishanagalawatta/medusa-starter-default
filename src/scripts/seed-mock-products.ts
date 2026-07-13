import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, ProductStatus } from "@medusajs/framework/utils";
import { createProductsWorkflow, createProductCategoriesWorkflow } from "@medusajs/medusa/core-flows";

export default async function seedMockProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  logger.info("Seeding additional mock products...");

  // Fetch the default sales channel to link products to
  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id"],
    filters: { name: "Default Sales Channel" }
  });
  
  if (!salesChannels || salesChannels.length === 0) {
    throw new Error("Default Sales Channel not found. Cannot seed products.");
  }
  const defaultSalesChannelId = salesChannels[0].id;

  // Fetch shipping profile
  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
    filters: { type: "default" }
  });
  
  if (!shippingProfiles || shippingProfiles.length === 0) {
    throw new Error("Default shipping profile not found.");
  }
  const shippingProfileId = shippingProfiles[0].id;

  // Fetch or create 'Merch' category
  let categoryId: string;
  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
    filters: { name: "Merch" }
  });
  
  if (!categories || categories.length === 0) {
    const { result: categoryResult } = await createProductCategoriesWorkflow(container).run({
      input: { product_categories: [{ name: "Merch", is_active: true }] }
    });
    categoryId = categoryResult[0].id;
  } else {
    categoryId = categories[0].id;
  }

  // Create products
  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Mock Smartwatch",
          category_ids: [categoryId],
          description: "A futuristic mock smartwatch.",
          handle: "mock-smartwatch",
          weight: 100,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfileId,
          images: [{ url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/coffee-mug.png" }],
          options: [{ title: "Strap", values: ["Sport", "Metal"] }],
          variants: [
            {
              title: "Sport", sku: "MOCK-WATCH-SPORT", options: { Strap: "Sport" },
              prices: [
                { amount: 25000, currency_code: "eur" },
                { amount: 27000, currency_code: "usd" }
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannelId }],
        },
        {
          title: "Mock Drone",
          category_ids: [categoryId],
          description: "An automated mock drone for aerial recon.",
          handle: "mock-drone",
          weight: 2500,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfileId,
          images: [{ url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png" }],
          options: [{ title: "Camera", values: ["4K", "8K"] }],
          variants: [
            {
              title: "4K", sku: "MOCK-DRONE-4K", options: { Camera: "4K" },
              prices: [
                { amount: 350000, currency_code: "eur" },
                { amount: 380000, currency_code: "usd" }
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannelId }],
        },
        {
          title: "Mock Robot Arm",
          category_ids: [categoryId],
          description: "A precision robotic arm for assembly.",
          handle: "mock-robot-arm",
          weight: 5000,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfileId,
          images: [{ url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/coffee-mug.png" }],
          options: [{ title: "Payload", values: ["1kg", "5kg"] }],
          variants: [
            {
              title: "1kg", sku: "MOCK-ARM-1KG", options: { Payload: "1kg" },
              prices: [
                { amount: 550000, currency_code: "eur" },
                { amount: 600000, currency_code: "usd" }
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannelId }],
        },
        {
          title: "Mock Sensor Kit",
          category_ids: [categoryId],
          description: "A complete suite of mock sensors.",
          handle: "mock-sensor-kit",
          weight: 500,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfileId,
          images: [{ url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png" }],
          options: [{ title: "Type", values: ["Basic", "Advanced"] }],
          variants: [
            {
              title: "Basic", sku: "MOCK-SENSOR-BASIC", options: { Type: "Basic" },
              prices: [
                { amount: 15000, currency_code: "eur" },
                { amount: 18000, currency_code: "usd" }
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannelId }],
        },
      ],
    },
  });

  logger.info("Successfully seeded additional mock products!");
}
