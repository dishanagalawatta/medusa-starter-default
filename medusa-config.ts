import { loadEnv, defineConfig, Modules } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    // @ts-ignore - database_extra is still supported by Medusa runtime despite type definitions
    database_extra: process.env.NODE_ENV !== "development" ? {
      ssl: { rejectUnauthorized: false },
      pool: { min: 2, max: 20 }
    } : {
      pool: { min: 2, max: 40 }
    },
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  modules: {
    customAttribute: {
      resolve: "./src/modules/custom-attribute",
    },
    capabilities: {
      resolve: "./src/modules/capabilities",
    },
    customer_reviews: {
      resolve: "./src/modules/customer_reviews",
    },
    portfolios: {
      resolve: "./src/modules/portfolios",
    },
    legacy: {
      resolve: "./src/modules/legacy",
    },
    product_reviews: {
      resolve: "./src/modules/product-reviews",
    },
    [Modules.FILE]: {
      resolve: "@medusajs/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/file-local",
            id: "local",
            options: {
              upload_dir: "static",
              backend_url: `${process.env.MEDUSA_BACKEND_URL || "http://localhost:3738"}/static`,
            },
          },
        ],
      },
    },
    ...(process.env.REDIS_URL ? {
      [Modules.EVENT_BUS]: {
        resolve: "@medusajs/event-bus-redis",
        options: {
          redisUrl: process.env.REDIS_URL,
        },
      },
      [Modules.CACHE]: {
        resolve: "@medusajs/cache-redis",
        options: {
          redisUrl: process.env.REDIS_URL,
        },
      },
      [Modules.WORKFLOW_ENGINE]: {
        resolve: "@medusajs/workflow-engine-redis",
        options: {
          redis: {
            redisUrl: process.env.REDIS_URL,
          }
        },
      }
    } : {})
  }
})
