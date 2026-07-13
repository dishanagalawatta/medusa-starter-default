import { Container, Heading, Button, Input, Label } from "@medusajs/ui"
import { useNavigate } from "react-router-dom"
import { sdk } from "../../../lib/sdk"
import { useState } from "react"

const CreatePortfolioCategory = () => {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await sdk.client.fetch("/admin/portfolio-categories", {
        method: "POST",
        body: { name },
      })
      navigate("/portfolio-categories")
    } catch (error) {
      console.error(error)
      alert("Failed to create category")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Heading level="h2">Create Category</Heading>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input 
            id="name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. PCB Design" 
            required 
          />
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button type="button" variant="secondary" onClick={() => navigate("/portfolio-categories")}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Create
          </Button>
        </div>
      </form>
    </Container>
  )
}

export default CreatePortfolioCategory
