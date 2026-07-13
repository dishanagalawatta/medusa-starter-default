import { ExecArgs } from "@medusajs/framework/types";
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {
  createRegionsWorkflow,
} from "@medusajs/medusa/core-flows";
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { updateStoresStep } from "@medusajs/medusa/core-flows";

const updateStoreCurrencies = createWorkflow(
  "update-store-currencies-lk",
  (input: {
    supported_currencies: { currency_code: string; is_default?: boolean }[];
    store_id: string;
  }) => {
    const normalizedInput = transform({ input }, (data) => {
      return {
        selector: { id: data.input.store_id },
        update: {
          supported_currencies: data.input.supported_currencies.map(
            (currency) => {
              return {
                currency_code: currency.currency_code,
                is_default: currency.is_default ?? false,
              };
            }
          ),
        },
      };
    });

    const stores = updateStoresStep(normalizedInput);
    return new WorkflowResponse(stores);
  }
);

export default async function addSriLanka({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const storeModuleService = container.resolve(Modules.STORE);
  const regionModuleService = container.resolve(Modules.REGION);

  logger.info("Fetching store...");
  const [store] = await storeModuleService.listStores({}, { relations: ["supported_currencies"] });
  
  if (!store) {
    logger.error("No store found.");
    return;
  }

  const existingCurrencies = store.supported_currencies?.map(c => ({
    currency_code: c.currency_code,
    is_default: c.is_default
  })) || [];

  if (!existingCurrencies.some(c => c.currency_code === "lkr")) {
    logger.info("Adding LKR to store currencies...");
    await updateStoreCurrencies(container).run({
      input: {
        store_id: store.id,
        supported_currencies: [
          ...existingCurrencies,
          { currency_code: "lkr" }
        ]
      }
    });
  } else {
    logger.info("LKR already supported in store.");
  }

  const existingRegions = await regionModuleService.listRegions({ q: "Asia" });
  if (existingRegions.length === 0) {
    logger.info("Creating Asia region with Sri Lanka...");
    await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Asia",
            currency_code: "lkr",
            countries: ["lk"],
            payment_providers: ["pp_system_default"],
          }
        ]
      }
    });
  } else {
    logger.info("Asia region already exists.");
  }

  logger.info("Successfully added Sri Lanka and LKR!");
}
