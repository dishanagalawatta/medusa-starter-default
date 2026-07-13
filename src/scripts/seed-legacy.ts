import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { LEGACY_MODULE } from "../modules/legacy";

export default async function seedLegacy({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const legacyService = container.resolve(LEGACY_MODULE);

  logger.info("Starting legacy seed...");

  const mockStats = [
    { count: "300+", label: "Projects Delivered", order: 1 },
    { count: "100+", label: "Satisfied Clients", order: 2 },
    { count: "7+", label: "Years of Excellence", order: 3 },
  ];

  for (const stat of mockStats) {
    logger.info(`Adding stat: ${stat.label}`);
    await legacyService.createLegacyStats(stat);
  }

  const mockIcons = [
    { icon_name: "Cpu", bg_color: "bg-blue-500/10", size: 32 },
    { icon_name: "Wrench", bg_color: "bg-orange-500/10", size: 40 },
    { icon_name: "Microscope", bg_color: "bg-green-500/10", size: 28 },
    { icon_name: "Globe", bg_color: "bg-purple-500/10", size: 36 },
    { icon_name: "Zap", bg_color: "bg-yellow-500/10", size: 44 },
    { icon_name: "Shield", bg_color: "bg-red-500/10", size: 30 },
    { icon_name: "Database", bg_color: "bg-indigo-500/10", size: 38 },
    { icon_name: "Code", bg_color: "bg-pink-500/10", size: 34 },
    { icon_name: "Cloud", bg_color: "bg-cyan-500/10", size: 42 },
    { icon_name: "Box", bg_color: "bg-emerald-500/10", size: 36 },
  ];

  for (const icon of mockIcons) {
    logger.info(`Adding icon: ${icon.icon_name}`);
    await legacyService.createLegacyIcons(icon);
  }

  logger.info("Successfully seeded legacy stats and icons!");
}
