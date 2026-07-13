import { Container, Heading, Table, Button, Text } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../../lib/sdk"
import { useNavigate } from "react-router-dom"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ClockSolid } from "@medusajs/icons"

const fetchLegacyStats = async () => {
  return sdk.client.fetch("/admin/legacy/stats", { method: "GET" })
}

const fetchLegacyIcons = async () => {
  return sdk.client.fetch("/admin/legacy/icons", { method: "GET" })
}

const LegacyPage = () => {
  const { data: statsData, isLoading: isLoadingStats } = useQuery<any>({
    queryKey: ["legacy-stats"],
    queryFn: fetchLegacyStats,
  })

  const { data: iconsData, isLoading: isLoadingIcons } = useQuery<any>({
    queryKey: ["legacy-icons"],
    queryFn: fetchLegacyIcons,
  })
  
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-y-4">
      {/* STATS SECTION */}
      <Container className="p-0 flex flex-col min-h-0">
        <div className="flex items-center justify-between p-6 border-b border-ui-border-base">
          <Heading level="h2">Legacy Stats</Heading>
          <Button size="small" variant="secondary" onClick={() => navigate("/legacy/create-stat")}>
            Create Stat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoadingStats ? (
            <div className="p-6">
              <Text>Loading stats...</Text>
            </div>
          ) : (
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Count</Table.HeaderCell>
                  <Table.HeaderCell>Label</Table.HeaderCell>
                  <Table.HeaderCell>Order</Table.HeaderCell>
                  <Table.HeaderCell>Actions</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {statsData?.stats?.length ? (
                  statsData.stats.map((stat: any) => (
                    <Table.Row key={stat.id}>
                      <Table.Cell>{stat.count}</Table.Cell>
                      <Table.Cell>{stat.label}</Table.Cell>
                      <Table.Cell>{stat.order}</Table.Cell>
                      <Table.Cell>
                        <Button size="small" variant="transparent" onClick={() => navigate(`/legacy/stats/${stat.id}`)}>
                          Edit
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <td colSpan={4} className="text-center py-6">
                      <Text className="text-ui-fg-subtle">No stats found.</Text>
                    </td>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          )}
        </div>
      </Container>

      {/* ICONS SECTION */}
      <Container className="p-0 flex flex-col min-h-0">
        <div className="flex items-center justify-between p-6 border-b border-ui-border-base">
          <Heading level="h2">Legacy Floating Icons</Heading>
          <Button size="small" variant="secondary" onClick={() => navigate("/legacy/create-icon")}>
            Create Icon
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoadingIcons ? (
            <div className="p-6">
              <Text>Loading icons...</Text>
            </div>
          ) : (
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Icon / Image</Table.HeaderCell>
                  <Table.HeaderCell>Background Color</Table.HeaderCell>
                  <Table.HeaderCell>Size</Table.HeaderCell>
                  <Table.HeaderCell>Actions</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {iconsData?.icons?.length ? (
                  iconsData.icons.map((icon: any) => (
                    <Table.Row key={icon.id}>
                      <Table.Cell>
                        {icon.image_url ? (
                          <img src={icon.image_url} alt="icon" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <Text>{icon.icon_name || "N/A"}</Text>
                        )}
                      </Table.Cell>
                      <Table.Cell>{icon.bg_color}</Table.Cell>
                      <Table.Cell>{icon.size}</Table.Cell>
                      <Table.Cell>
                        <Button size="small" variant="transparent" onClick={() => navigate(`/legacy/icons/${icon.id}`)}>
                          Edit
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <td colSpan={4} className="text-center py-6">
                      <Text className="text-ui-fg-subtle">No icons found.</Text>
                    </td>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          )}
        </div>
      </Container>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Legacy",
  icon: ClockSolid,
})

export default LegacyPage
