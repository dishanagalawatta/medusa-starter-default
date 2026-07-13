import { Container, Heading, Table, Button, Text } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../../lib/sdk"
import { useNavigate } from "react-router-dom"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Wrench } from "@medusajs/icons"

const fetchPortfolios = async () => {
  return sdk.client.fetch("/admin/portfolios", { method: "GET" })
}

const PortfoliosPage = () => {
  const { data, isLoading } = useQuery<any>({
    queryKey: ["portfolios"],
    queryFn: fetchPortfolios,
  })
  
  const navigate = useNavigate()

  return (
    <Container className="p-0 flex flex-col min-h-0">
      <div className="flex items-center justify-between p-6 border-b border-ui-border-base">
        <Heading level="h2">Discover Our Work (Portfolios)</Heading>
        <div className="flex gap-2">
          <Button size="small" variant="secondary" onClick={() => navigate("/portfolio-categories")}>
            Manage Categories
          </Button>
          <Button size="small" variant="primary" onClick={() => navigate("/portfolios/create")}>
            Create Portfolio
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-6">
            <Text>Loading portfolios...</Text>
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Image</Table.HeaderCell>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>Category</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data?.portfolios?.length ? (
                data.portfolios.map((proj: any) => (
                  <Table.Row key={proj.id}>
                    <Table.Cell>
                      {proj.images?.[0] ? (
                        <img src={proj.images[0]} alt={proj.title} className="w-12 h-12 object-cover rounded" />
                      ) : (
                        <div className="w-12 h-12 bg-ui-bg-subtle rounded flex items-center justify-center text-xs text-ui-fg-subtle">
                          No Img
                        </div>
                      )}
                    </Table.Cell>
                    <Table.Cell>{proj.title}</Table.Cell>
                    <Table.Cell>{proj.category?.name || "None"}</Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="small" 
                          variant="secondary" 
                          onClick={() => navigate(`/portfolios/${proj.id}/edit`)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="small" 
                          variant="transparent" 
                          onClick={async () => {
                            if (window.confirm("Are you sure?")) {
                              await sdk.client.fetch(`/admin/portfolios/${proj.id}`, { method: "DELETE" });
                              window.location.reload();
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <td colSpan={4} className="text-center py-6">
                    <Text className="text-ui-fg-subtle">No portfolios found.</Text>
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
  label: "Portfolios",
  icon: Wrench,
})

export default PortfoliosPage
