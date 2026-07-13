import { Container, Heading, Button, Input, Select, Textarea, Label, Text } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../../lib/sdk"
import { useNavigate, useParams } from "react-router-dom"
import imageCompression from "browser-image-compression"

const EditCapabilityPage = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  
  const { data, isLoading } = useQuery<any>({
    queryKey: ["capability", id],
    queryFn: async () => {
      const response = await sdk.client.fetch(`/admin/capabilities/${id}`, { method: "GET" }) as any
      return response.capability
    }
  })

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
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title || "",
        desc: data.desc || "",
        detailed_desc: data.detailed_desc || "",
        tab: data.tab || "electronics",
        icon: data.icon || "Cpu",
        price: data.price || "",
        benefits: (data.benefits || []).join(", "),
      })
      setExistingImages(data.images || [])
    }
  }, [data])

  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      return sdk.client.fetch(`/admin/capabilities/${id}`, {
        method: "POST",
        body: payload as any,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["capabilities"] })
      queryClient.invalidateQueries({ queryKey: ["capability", id] })
      navigate("/capabilities")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return sdk.client.fetch(`/admin/capabilities/${id}`, {
        method: "DELETE",
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
    
    let uploadedUrls: string[] = [...existingImages]
    
    // If new images are selected, upload them and APPEND to existing
    if (images.length > 0) {
      const uploadRes = await sdk.admin.upload.create({
        files: images
      }) as any
      
      const newUrls = uploadRes.files.map((f: any) => f.url)
      uploadedUrls = [...existingImages, ...newUrls]
    }

    // Process benefits from comma separated string
    const benefitsArray = formData.benefits.split(",").map(b => b.trim()).filter(b => b)

    updateMutation.mutate({
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

  if (isLoading) {
    return (
      <Container className="p-6 max-w-2xl mx-auto text-center">
        <Text>Loading capability details...</Text>
      </Container>
    )
  }

  return (
    <Container className="p-6 max-w-2xl mx-auto">
      <Heading level="h1" className="mb-6">Edit Capability</Heading>
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
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Starting Price</Label>
            <Input 
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Key Client Benefits (Comma separated)</Label>
          <Textarea 
            value={formData.benefits}
            onChange={(e) => setFormData({...formData, benefits: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <Label>Existing Images</Label>
          {existingImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
              {existingImages.map((imgUrl, idx) => (
                <div key={idx} className="relative group rounded-md overflow-hidden border border-ui-border-base aspect-square">
                  <img src={imgUrl} alt={`Capability ${idx}`} className="object-cover w-full h-full" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button 
                      type="button" 
                      variant="danger" 
                      size="small" 
                      onClick={() => setExistingImages(prev => prev.filter((_, i) => i !== idx))}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Text className="text-ui-fg-subtle text-sm">No existing images.</Text>
          )}
        </div>

        <div className="space-y-2">
          <Label>Add New Images</Label>
          <Input 
            type="file" 
            multiple 
            accept="image/*"
            onChange={handleFileChange}
          />
          {isUploading && <Text className="text-ui-fg-subtle text-sm">Optimizing images...</Text>}
          {images.length > 0 && !isUploading && (
             <Text className="text-ui-fg-subtle text-sm">{images.length} new images ready to upload.</Text>
          )}
        </div>

        <div className="flex justify-between pt-4 border-t border-ui-border-base mt-6">
          <Button 
            type="button" 
            variant="danger" 
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this capability?")) {
                deleteMutation.mutate()
              }
            }}
            isLoading={deleteMutation.isPending}
          >
            Delete Capability
          </Button>

          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => navigate("/capabilities")}>
              Cancel
            </Button>
            <Button type="submit" isLoading={updateMutation.isPending || isUploading}>
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </Container>
  )
}

export default EditCapabilityPage
