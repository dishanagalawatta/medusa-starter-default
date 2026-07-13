import { Container, Heading, Button, Input, Select, Textarea, Label, Text } from "@medusajs/ui"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../../lib/sdk"
import { useNavigate } from "react-router-dom"
import imageCompression from "browser-image-compression"

const CreateCapabilityPage = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    detailed_desc: "",
    tab: "electronics",
    icon: "Cpu",
    price: "",
    benefits: "", // comma separated temporarily
  })
  
  const [images, setImages] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      return sdk.client.fetch("/admin/capabilities", {
        method: "POST",
        body: payload as any,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["capabilities"] })
      navigate("/capabilities")
    },
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)
    
    setIsUploading(true)
    const optimizedFiles = await Promise.all(
      files.map(async (file) => {
        try {
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          }
          return await imageCompression(file, options)
        } catch (error) {
          console.error("Compression failed", error)
          return file
        }
      })
    )
    setImages(optimizedFiles)
    setIsUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    let uploadedUrls: string[] = []
    
    // If images are selected, upload them first
    if (images.length > 0) {
      const uploadRes = await sdk.admin.upload.create({
        files: images
      }) as any
      uploadedUrls = uploadRes.files.map((f: any) => f.url)
    }

    // Process benefits from comma separated string
    const benefitsArray = formData.benefits.split(",").map(b => b.trim()).filter(b => b)

    createMutation.mutate({
      title: formData.title,
      desc: formData.desc,
      detailed_desc: formData.detailed_desc,
      tab: formData.tab,
      icon: formData.icon,
      price: formData.price,
      benefits: benefitsArray,
      images: uploadedUrls,
    })
  }

  return (
    <Container className="p-6 max-w-2xl mx-auto">
      <Heading level="h1" className="mb-6">Create Capability</Heading>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input 
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label>Description (Short)</Label>
          <Textarea 
            value={formData.desc}
            onChange={(e) => setFormData({...formData, desc: e.target.value})}
            required
            placeholder="Appears on the card overview"
          />
        </div>

        <div className="space-y-2">
          <Label>Detailed Description</Label>
          <Textarea 
            value={formData.detailed_desc}
            onChange={(e) => setFormData({...formData, detailed_desc: e.target.value})}
            placeholder="Appears in the detailed view popup"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label>Category (Tab)</Label>
          <Select 
            value={formData.tab} 
            onValueChange={(val) => setFormData({...formData, tab: val})}
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="electronics">Electronics & Design</Select.Item>
              <Select.Item value="automation">Automation & IoT</Select.Item>
              <Select.Item value="installations">Installations</Select.Item>
              <Select.Item value="services">Technical Services</Select.Item>
            </Select.Content>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Lucide Icon Name</Label>
            <Input 
              value={formData.icon}
              onChange={(e) => setFormData({...formData, icon: e.target.value})}
              placeholder="e.g. Cpu, Server, Home"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Starting Price</Label>
            <Input 
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              placeholder="e.g. LKR 6,500"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Key Client Benefits (Comma separated)</Label>
          <Textarea 
            value={formData.benefits}
            onChange={(e) => setFormData({...formData, benefits: e.target.value})}
            placeholder="Seamless integration, Reduces energy, Real-time monitoring"
          />
        </div>

        <div className="space-y-2">
          <Label>Images (Multiple)</Label>
          <Input 
            type="file" 
            multiple 
            accept="image/*"
            onChange={handleFileChange}
          />
          {isUploading && <Text className="text-ui-fg-subtle text-sm">Optimizing images...</Text>}
          {images.length > 0 && !isUploading && (
             <Text className="text-ui-fg-subtle text-sm">{images.length} images ready to upload.</Text>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={() => navigate("/capabilities")}>
            Cancel
          </Button>
          <Button type="submit" isLoading={createMutation.isPending || isUploading}>
            Save Capability
          </Button>
        </div>
      </form>
    </Container>
  )
}

export default CreateCapabilityPage
