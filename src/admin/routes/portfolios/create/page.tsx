import { Container, Heading, Button, Input, Label, Textarea, Select } from "@medusajs/ui"
import { useNavigate } from "react-router-dom"
import { sdk } from "../../../lib/sdk"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import imageCompression from "browser-image-compression"

const CreatePortfolio = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [overview, setOverview] = useState("")
  const [specs, setSpecs] = useState("")
  const [projectUrl, setProjectUrl] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const { data: categoriesData } = useQuery<any>({
    queryKey: ["portfolio_categories"],
    queryFn: () => sdk.client.fetch("/admin/portfolio-categories", { method: "GET" })
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryId) {
      alert("Please select a category.")
      return
    }
    setIsLoading(true)
    try {
      let imageUrls: string[] = []

      if (files.length > 0) {
        // Optimize images
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        }
        
        const compressedFiles = await Promise.all(
          files.map(async (file) => {
            const blob = await imageCompression(file, options)
            return new File([blob], file.name, { type: file.type })
          })
        )

        // Upload to Medusa
        const uploadRes = await sdk.admin.upload.create({
          files: compressedFiles
        }) as any
        
        if (uploadRes.files && uploadRes.files.length > 0) {
          imageUrls = uploadRes.files.map((f: any) => f.url)
        }
      }

      // Convert specs comma separated string to JSON array
      const specsArray = specs.split(",").map(s => s.trim()).filter(s => s)

      await sdk.client.fetch("/admin/portfolios", {
        method: "POST",
        body: { 
          title, 
          category_id: categoryId || null, 
          overview, 
          specs: specsArray,
          images: imageUrls,
          project_url: projectUrl || null,
          icon: "Wrench", // default
          gradient: "bg-gradient-to-br from-emerald-600 to-teal-900" // default
        },
      })
      navigate("/portfolios")
    } catch (error) {
      console.error(error)
      alert("Failed to create portfolio")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Heading level="h2">Create Portfolio</Heading>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Title</Label>
          <Input 
            id="title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Portfolio Title" 
            required 
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="category">Category</Label>
          <Select onValueChange={(val) => setCategoryId(val)} value={categoryId}>
            <Select.Trigger>
              <Select.Value placeholder="Select a category" />
            </Select.Trigger>
            <Select.Content>
              {categoriesData?.portfolio_categories?.map((c: any) => (
                <Select.Item key={c.id} value={c.id}>{c.name}</Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="overview">Overview</Label>
          <Textarea 
            id="overview" 
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            placeholder="Portfolio overview..." 
            required 
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="specs">Technical Specs (comma separated)</Label>
          <Textarea 
            id="specs" 
            value={specs}
            onChange={(e) => setSpecs(e.target.value)}
            placeholder="Custom PCB, Real-time firmware, ..." 
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="projectUrl">Project URL (Optional)</Label>
          <Input 
            id="projectUrl" 
            type="url"
            value={projectUrl}
            onChange={(e) => setProjectUrl(e.target.value)}
            placeholder="https://github.com/..." 
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="images">Images (Will be optimized before upload)</Label>
          <Input 
            id="images" 
            type="file" 
            accept="image/*"
            multiple
            onChange={(e) => setFiles(e.target.files ? Array.from(e.target.files) : [])}
          />
          {files.length > 0 && (
            <p className="text-xs text-ui-fg-subtle">{files.length} file(s) selected</p>
          )}
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button type="button" variant="secondary" onClick={() => navigate("/portfolios")}>
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

export default CreatePortfolio
