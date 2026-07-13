import { Container, Heading, Button, Input, Label, Text } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../../../lib/sdk"
import { useNavigate, useParams } from "react-router-dom"

const EditLegacyStatPage = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    count: "",
    label: "",
    order: 0,
  })

  const { data, isLoading } = useQuery({
    queryKey: ["legacy-stat", id],
    queryFn: async () => {
      const res = await sdk.client.fetch(`/admin/legacy/stats/${id}`, { method: "GET" }) as any
      return res.stat
    },
    enabled: !!id,
  })

  useEffect(() => {
    if (data) {
      setFormData({
        count: data.count || "",
        label: data.label || "",
        order: data.order || 0,
      })
    }
  }, [data])

  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      return sdk.client.fetch(`/admin/legacy/stats/${id}`, {
        method: "POST",
        body: payload as any,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["legacy-stats"] })
      queryClient.invalidateQueries({ queryKey: ["legacy-stat", id] })
      navigate("/legacy")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return sdk.client.fetch(`/admin/legacy/stats/${id}`, {
        method: "DELETE",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["legacy-stats"] })
      navigate("/legacy")
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate({
      count: formData.count,
      label: formData.label,
      order: Number(formData.order),
    })
  }

  if (isLoading) {
    return <Container className="p-6"><Text>Loading...</Text></Container>
  }

  return (
    <Container className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Heading level="h1">Edit Legacy Stat</Heading>
        <Button 
          variant="danger" 
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this stat?")) {
              deleteMutation.mutate()
            }
          }}
          isLoading={deleteMutation.isPending}
        >
          Delete
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label>Count (e.g. "300+")</Label>
          <Input 
            value={formData.count}
            onChange={(e) => setFormData({...formData, count: e.target.value})}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label>Label (e.g. "Projects Delivered")</Label>
          <Input 
            value={formData.label}
            onChange={(e) => setFormData({...formData, label: e.target.value})}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Order</Label>
          <Input 
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({...formData, order: Number(e.target.value)})}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={() => navigate("/legacy")}>
            Cancel
          </Button>
          <Button type="submit" isLoading={updateMutation.isPending}>
            Save Changes
          </Button>
        </div>
      </form>
    </Container>
  )
}

export default EditLegacyStatPage
