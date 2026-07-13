import { Container, Heading, Button, Input, Label } from "@medusajs/ui"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../../lib/sdk"
import { useNavigate } from "react-router-dom"

const CreateLegacyStatPage = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    count: "",
    label: "",
    order: 0,
  })

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      return sdk.client.fetch("/admin/legacy/stats", {
        method: "POST",
        body: payload as any,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["legacy-stats"] })
      navigate("/legacy")
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate({
      count: formData.count,
      label: formData.label,
      order: Number(formData.order),
    })
  }

  return (
    <Container className="p-6 max-w-2xl mx-auto">
      <Heading level="h1" className="mb-6">Create Legacy Stat</Heading>
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
          <Button type="submit" isLoading={createMutation.isPending}>
            Save Stat
          </Button>
        </div>
      </form>
    </Container>
  )
}

export default CreateLegacyStatPage
