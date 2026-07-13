import { z } from "zod"

export const PostAdminCreateCapability = z.object({
  title: z.string(),
  desc: z.string(),
  detailed_desc: z.string().optional(),
  tab: z.enum(['electronics', 'automation', 'installations', 'services']),
  icon: z.string(),
  images: z.array(z.string()).default([]),
  price: z.string(),
  benefits: z.array(z.string()).default([]),
})

export const PostAdminUpdateCapability = z.object({
  title: z.string().optional(),
  desc: z.string().optional(),
  detailed_desc: z.string().optional(),
  tab: z.enum(['electronics', 'automation', 'installations', 'services']).optional(),
  icon: z.string().optional(),
  images: z.array(z.string()).optional(),
  price: z.string().optional(),
  benefits: z.array(z.string()).optional(),
})
