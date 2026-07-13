import { Container, Heading, Table, Button, Text } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../../lib/sdk"
import { useNavigate } from "react-router-dom"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ChatBubble } from "@medusajs/icons"

const fetchReviews = async () => {
  return sdk.client.fetch("/admin/reviews", { method: "GET" })
}

const ReviewsPage = () => {
  const { data, isLoading } = useQuery<any>({
    queryKey: ["reviews"],
    queryFn: fetchReviews,
  })
  
  const navigate = useNavigate()

  return (
    <Container className="p-0 flex flex-col min-h-0">
      <div className="flex items-center justify-between p-6 border-b border-ui-border-base">
        <Heading level="h2">Customer Reviews</Heading>
        <Button size="small" variant="secondary" onClick={() => navigate("/reviews/create")}>
          Create Review
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-6">
            <Text>Loading reviews...</Text>
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Role</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Time</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data?.reviews?.length ? (
                data.reviews.map((rev: any) => (
                  <Table.Row key={rev.id}>
                    <Table.Cell>{rev.name}</Table.Cell>
                    <Table.Cell>{rev.role}</Table.Cell>
                    <Table.Cell>{rev.type}</Table.Cell>
                    <Table.Cell>{rev.time}</Table.Cell>
                    <Table.Cell>
                      <Button size="small" variant="transparent" onClick={() => navigate(`/reviews/${rev.id}`)}>
                        Edit
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <td colSpan={5} className="text-center py-6">
                    <Text className="text-ui-fg-subtle">No reviews found.</Text>
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
  label: "Reviews",
  icon: ChatBubble,
})

export default ReviewsPage
