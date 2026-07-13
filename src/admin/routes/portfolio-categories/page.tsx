import { Container, Heading, Table, Button, Text } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../../lib/sdk"
import { useNavigate } from "react-router-dom"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Folder } from "@medusajs/icons"

const fetchCategories = async () => {
  return sdk.client.fetch("/admin/portfolio-categories", { method: "GET" })
}

const PortfolioCategoriesPage = () => {
  const { data, isLoading } = useQuery<any>({
    queryKey: ["portfolio_categories"],
    queryFn: fetchCategories,
  })
  
  const navigate = useNavigate()

  return (
    <Container className="p-0 flex flex-col min-h-0">
      <div className="flex items-center justify-between p-6 border-b border-ui-border-base">
        <Heading level="h2">Portfolio Categories</Heading>
        <Button size="small" variant="secondary" onClick={() => navigate("/portfolio-categories/create")}>
          Create Category
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-6">
            <Text>Loading categories...</Text>
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data?.portfolio_categories?.length ? (
                data.portfolio_categories.map((cat: any) => (
                  <Table.Row key={cat.id}>
                    <Table.Cell>{cat.name}</Table.Cell>
                    <Table.Cell>
                      <Button 
                        size="small" 
                        variant="transparent" 
                        onClick={async () => {
                          if (window.confirm("Are you sure?")) {
                            await sdk.client.fetch(`/admin/portfolio-categories/${cat.id}`, { method: "DELETE" });
                            window.location.reload();
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <td colSpan={2} className="text-center py-6">
                    <Text className="text-ui-fg-subtle">No categories found.</Text>
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

export default PortfolioCategoriesPage
