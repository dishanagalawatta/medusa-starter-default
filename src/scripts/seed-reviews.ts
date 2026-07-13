import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { CUSTOMER_REVIEWS_MODULE } from "../modules/customer_reviews";

export default async function seedReviews({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const reviewsService = container.resolve(CUSTOMER_REVIEWS_MODULE);

  logger.info("Clearing existing reviews...");
  const existingReviews = await (reviewsService as any).listReviews({});
  if (existingReviews && existingReviews.length > 0) {
    const ids = existingReviews.map((r: any) => r.id);
    await (reviewsService as any).deleteReviews(ids);
    logger.info(`Deleted ${ids.length} existing reviews.`);
  }

  logger.info("Starting reviews seed...");

  const mockReviews = [
    {
      name: "Kasun Perera",
      role: "Startup Founder",
      avatar: "/avatars/saman.jpg", // Man in suit
      text: "The prototype was delivered exactly on schedule. The firmware integration is flawless. Highly recommend their mechatronics team!",
      time: "09:41 AM",
      type: "received",
    },
    {
      name: "Chaminda Silva",
      role: "Hardware Director",
      avatar: "/avatars/dilini.jpg", // Man in hardhat
      text: "The new sensor rigs have drastically improved our data collection accuracy. The build quality is industrial-grade.",
      time: "10:15 AM",
      type: "received",
    },
    {
      name: "Dilini Fernando",
      role: "Product Lead",
      avatar: "/avatars/amal.jpg", // Woman
      text: "Excellent communication throughout the project. It's rare to find an engineering studio that understands both the mechanical constraints and the software architecture so well.",
      time: "11:20 AM",
      type: "received",
    },
    {
      name: "Amal Silva",
      role: "Operations Manager",
      avatar: "", // Fallback testing
      text: "We were struggling with our automated assembly line until Electrotion stepped in. Their custom PCB design saved us a lot of space and reduced latency.",
      time: "01:15 PM",
      type: "received",
    },
    {
      name: "Tanya de Silva",
      role: "Research Scientist",
      avatar: "/avatars/chaminda.jpg", // Woman
      text: "The integration with our existing legacy systems was seamless. Electrotion's ability to reverse-engineer and adapt is top-notch.",
      time: "04:12 PM",
      type: "received",
    },
  ];

  for (const review of mockReviews) {
    logger.info(`Adding review: ${review.name}`);
    await (reviewsService as any).createReviews(review as any);
  }

  logger.info("Successfully seeded mock reviews!");
}
