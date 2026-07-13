import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { CAPABILITIES_MODULE } from "../modules/capabilities";

export default async function seedCapabilities({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const capabilitiesService = container.resolve(CAPABILITIES_MODULE);

  logger.info("Starting capabilities seed...");

  const mockCapabilities = [
    {
      title: "Smart Home Integration",
      desc: "Complete automation of your home lighting, climate, and security systems.",
      tab: "automation",
      icon: "Home",
      price: "LKR 45,000",
      benefits: ["Energy savings", "Remote control", "Enhanced security"],
      images: [
        "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800"
      ]
    },
    {
      title: "Custom PCB Design",
      desc: "Professional printed circuit board design and prototyping for your specific hardware needs.",
      tab: "electronics",
      icon: "Cpu",
      price: "LKR 25,000",
      benefits: ["Multi-layer designs", "Rapid prototyping", "DFM compliant"],
      images: [
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800"
      ]
    },
    {
      title: "Industrial Server Setup",
      desc: "Robust server infrastructure and network installations for industrial environments.",
      tab: "installations",
      icon: "Server",
      price: "LKR 120,000",
      benefits: ["High availability", "Scalable architecture", "24/7 monitoring"],
      images: [
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
      ]
    },
    {
      title: "Predictive Maintenance Service",
      desc: "AI-driven technical services to predict and prevent hardware failures before they occur.",
      tab: "services",
      icon: "Wrench",
      price: "LKR 75,000",
      benefits: ["Reduced downtime", "Cost effective", "Data-driven insights"],
      images: [
        "https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=800"
      ]
    }
  ];

  for (const capability of mockCapabilities) {
    logger.info(`Adding capability: ${capability.title}`);
    await capabilitiesService.createCapabilities(capability as any);
  }

  logger.info("Successfully seeded mock capabilities!");
}
