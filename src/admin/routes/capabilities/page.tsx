import { Container, Heading, Table, Button, Text } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../../lib/sdk"
import { useNavigate } from "react-router-dom"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Component } from "@medusajs/icons"

const fetchCapabilities = async () => {
  return sdk.client.fetch("/admin/capabilities", { method: "GET" })
}

const CapabilitiesPage = () => {
  const { data, isLoading } = useQuery<any>({
    queryKey: ["capabilities"],
    queryFn: fetchCapabilities,
  })
  
  const navigate = useNavigate()

  return (
    <Container className="p-0 flex flex-col min-h-0">
      <div className="flex items-center justify-between p-6 border-b border-ui-border-base">
        <Heading level="h2">Capabilities</Heading>
        <Button size="small" variant="secondary" onClick={() => navigate("/capabilities/create")}>
          Create Capability
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-6">
            <Text>Loading capabilities...</Text>
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>Tab</Table.HeaderCell>
                <Table.HeaderCell>Price</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data?.capabilities?.length ? (
                data.capabilities.map((cap: any) => (
                  <Table.Row key={cap.id}>
                    <Table.Cell>{cap.title}</Table.Cell>
                    <Table.Cell>{cap.tab}</Table.Cell>
                    <Table.Cell>{cap.price}</Table.Cell>
                    <Table.Cell>
                      <Button size="small" variant="transparent" onClick={() => navigate(`/capabilities/${cap.id}`)}>
                        Edit
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <td colSpan={4} className="text-center py-6">
                    <Text className="text-ui-fg-subtle">No capabilities found.</Text>
                  </td>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        )}
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Capabilities",
  icon: Component,
})

export default CapabilitiesPage
