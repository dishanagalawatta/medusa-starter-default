import { Container, Heading, Button, Input, Label, Text } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../../../lib/sdk"
import { useNavigate, useParams } from "react-router-dom"
import { ImageCropper } from "../../../../components/image-cropper"

const EditLegacyIconPage = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    icon_name: "",
    bg_color: "",
    size: 40,
  })

  const [rawImageFile, setRawImageFile] = useState<File | null>(null)
  const [croppedImageFile, setCroppedImageFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ["legacy-icon", id],
    queryFn: async () => {
      const res = await sdk.client.fetch(`/admin/legacy/icons/${id}`, { method: "GET" }) as any
      return res.icon
    },
    enabled: !!id,
  })

  useEffect(() => {
    if (data) {
      setFormData({
        icon_name: data.icon_name || "",
        bg_color: data.bg_color || "",
        size: data.size || 40,
      })
    }
  }, [data])

  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      return sdk.client.fetch(`/admin/legacy/icons/${id}`, {
        method: "POST",
        body: payload as any,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["legacy-icons"] })
      queryClient.invalidateQueries({ queryKey: ["legacy-icon", id] })
      navigate("/legacy")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return sdk.client.fetch(`/admin/legacy/icons/${id}`, {
        method: "DELETE",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["legacy-icons"] })
      navigate("/legacy")
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRawImageFile(e.target.files[0])
    }
  }

  const handleCropComplete = (file: File) => {
    setCroppedImageFile(file)
    setRawImageFile(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    let uploadedUrl = data.image_url
    
    // If a new image is ready, upload it first
    if (croppedImageFile) {
      setIsUploading(true)
      try {
        const uploadRes = await sdk.admin.upload.create({
          files: [croppedImageFile]
        }) as any
        if (uploadRes.files && uploadRes.files.length > 0) {
          uploadedUrl = uploadRes.files[0].url
        }
      } catch (err) {
        console.error("Upload failed", err)
      }
      setIsUploading(false)
    }

    updateMutation.mutate({
      icon_name: formData.icon_name || null,
      image_url: uploadedUrl,
      bg_color: formData.bg_color,
      size: Number(formData.size),
    })
  }

  if (isLoading) {
    return <Container className="p-6"><Text>Loading...</Text></Container>
  }

  return (
    <Container className="p-6 max-w-2xl mx-auto relative">
      <div className="flex items-center justify-between mb-6">
        <Heading level="h1">Edit Legacy Icon</Heading>
        <Button 
          variant="danger" 
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this icon?")) {
              deleteMutation.mutate()
            }
          }}
          isLoading={deleteMutation.isPending}
        >
          Delete
        </Button>
      </div>
      
      {rawImageFile && (
        <ImageCropper 
          imageFile={rawImageFile} 
          onCropComplete={handleCropComplete} 
          onCancel={() => setRawImageFile(null)} 
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="space-y-2">
          <Label>Current Image</Label>
          <div className="flex items-center gap-4">
            {data?.image_url ? (
              <img src={data.image_url} alt="Current" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <Text className="text-ui-fg-subtle">No custom image uploaded.</Text>
            )}
          </div>
          <Label className="mt-4">Upload New Image</Label>
          <Input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
          />
          {croppedImageFile && (
            <Text className="text-ui-fg-success text-sm font-medium">New image cropped and ready to upload: {croppedImageFile.name}</Text>
          )}
          <Text className="text-ui-fg-subtle text-xs">A custom image will override the Lucide icon.</Text>
        </div>
        
        <div className="space-y-2">
          <Label>Or use Lucide Icon Name</Label>
          <Input 
            value={formData.icon_name}
            onChange={(e) => setFormData({...formData, icon_name: e.target.value})}
            placeholder="e.g. Cpu, Shield, Globe"
            disabled={!!croppedImageFile}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Background Tailwind Color</Label>
            <Input 
              value={formData.bg_color}
              onChange={(e) => setFormData({...formData, bg_color: e.target.value})}
              placeholder="e.g. bg-blue-500/10"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Size (px)</Label>
            <Input 
              type="number"
              value={formData.size}
              onChange={(e) => setFormData({...formData, size: Number(e.target.value)})}
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={() => navigate("/legacy")}>
            Cancel
          </Button>
          <Button type="submit" isLoading={updateMutation.isPending || isUploading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Container>
  )
}

export default EditLegacyIconPage
