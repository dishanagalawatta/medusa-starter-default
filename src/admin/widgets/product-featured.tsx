import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Switch, Text, toast } from "@medusajs/ui"
import { useState } from "react"
import type { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"

export default function ProductFeaturedWidget({ data: product }: DetailWidgetProps<AdminProduct>) {
  const [isFeatured, setIsFeatured] = useState<boolean>(!!product?.metadata?.is_featured)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async (checked: boolean) => {
    setIsFeatured(checked)
    setIsLoading(true)

    try {
      const res = await fetch(`/admin/products/${product.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metadata: {
            ...product.metadata,
            is_featured: checked,
          },
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to update product")
      }

      toast.success("Success", {
        description: `Product is now ${checked ? 'featured' : 'unfeatured'}.`
      })
    } catch (err) {
      setIsFeatured(!checked)
      toast.error("Error", {
        description: "Failed to update featured status."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <Heading level="h2" className="text-ui-fg-base">
            Featured Hardware
          </Heading>
          <Text className="text-ui-fg-subtle text-sm">
            Show this product in the featured hardware carousel on the storefront.
          </Text>
        </div>
        <Switch
          checked={isFeatured}
          onCheckedChange={handleToggle}
          disabled={isLoading}
        />
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.side.after",
})
