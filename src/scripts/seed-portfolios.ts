import { ExecArgs } from "@medusajs/framework/types"
import { PORTFOLIOS_MODULE } from "../modules/portfolios"

export default async function seedPortfolios({ container }: ExecArgs) {
  const portfoliosModuleService: any = container.resolve(PORTFOLIOS_MODULE)
  
  // Check if categories exist, if not create them
  const existingCategories = await portfoliosModuleService.listPortfolioCategories()
  let hardwareCategory = existingCategories.find((c: any) => c.name === "Hardware")
  let automationCategory = existingCategories.find((c: any) => c.name === "Automation")
  
  if (!hardwareCategory) {
    hardwareCategory = await portfoliosModuleService.createPortfolioCategories({ name: "Hardware" })
  }
  
  if (!automationCategory) {
    automationCategory = await portfoliosModuleService.createPortfolioCategories({ name: "Automation" })
  }

  // Create mock portfolios
  await portfoliosModuleService.createPortfolioes([
    {
      title: "Advanced Industrial PCB",
      category_id: hardwareCategory.id,
      icon: "Cpu",
      gradient: "bg-gradient-to-br from-emerald-600 to-teal-900",
      overview: "A highly complex, multi-layer printed circuit board designed for real-time robotic control systems. Features advanced thermal management, high-speed signal integrity, and ultra-low latency processing.",
      specs: ["12-Layer Board", "Real-time Processing", "Thermal Management"],
      images: ["http://localhost:3738/static/mock_portfolio_1.jpg"]
    },
    {
      title: "Precision Robotic Arm",
      category_id: automationCategory.id,
      icon: "Wrench",
      gradient: "bg-gradient-to-br from-zinc-800 to-zinc-950",
      overview: "An industrial-grade autonomous robotic arm built for precision manufacturing. It leverages computer vision and machine learning for predictive path planning.",
      specs: ["0.01mm Precision", "Computer Vision Integration", "Carbon Fiber Frame"],
      images: ["http://localhost:3738/static/mock_portfolio_2.jpg"]
    },
    {
      title: "Autonomous Inspection Drone",
      category_id: automationCategory.id,
      icon: "Plane",
      gradient: "bg-gradient-to-br from-blue-600 to-indigo-900",
      overview: "A specialized quadcopter drone engineered for autonomous industrial inspections. Features LiDAR, thermal imaging, and a reinforced carbon-fiber exoskeleton.",
      specs: ["LiDAR Mapping", "Thermal Imaging", "45-min Flight Time"],
      images: ["http://localhost:3738/static/mock_portfolio_3.jpg"]
    }
  ])
  
  console.log("Mock portfolios seeded successfully!")
}
