import { Container, Heading, Button, Input, Select, Textarea, Label, Text } from "@medusajs/ui"
import { useState, useRef } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../../lib/sdk"
import { useNavigate } from "react-router-dom"
// @ts-ignore - Vite handles the ESM import for the admin UI
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import imageCompression from "browser-image-compression"

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  )
}

const CreateReviewPage = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    text: "",
    time: "10:00 AM",
    type: "received",
  })
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Crop State
  const [imgSrc, setImgSrc] = useState("")
  const [crop, setCrop] = useState<Crop>()
  const imgRef = useRef<HTMLImageElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      return sdk.client.fetch("/admin/reviews", {
        method: "POST",
        body: payload as any,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] })
      navigate("/reviews")
    },
  })

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined) 
      const reader = new FileReader()
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      )
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, 1))
  }

  const getCroppedImg = async (image: HTMLImageElement, crop: Crop): Promise<File | null> => {
    const canvas = document.createElement("canvas")
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    
    const pixelRatio = window.devicePixelRatio
    canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

    const ctx = canvas.getContext("2d")
    if (!ctx) return null

    ctx.scale(pixelRatio, pixelRatio)
    ctx.imageSmoothingQuality = "high"

    const cropX = crop.x * scaleX
    const cropY = crop.y * scaleY
    const cropWidth = crop.width * scaleX
    const cropHeight = crop.height * scaleY

    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    )

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return resolve(null)
          resolve(new File([blob], "avatar.jpg", { type: "image/jpeg" }))
        },
        "image/jpeg",
        1 
      )
    })
  }

  const handleConfirmCrop = async () => {
    if (!imgRef.current || !crop) return
    setIsUploading(true)
    try {
      const croppedFile = await getCroppedImg(imgRef.current, crop)
      if (!croppedFile) throw new Error("Failed to crop image")

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 512,
        useWebWorker: true,
      }
      const optimizedFile = await imageCompression(croppedFile, options)
      setAvatarFile(optimizedFile)
      setImgSrc("") // Close crop UI
    } catch (error) {
      console.error("Compression failed", error)
    }
    setIsUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    let uploadedUrl = ""
    
    if (avatarFile) {
      const uploadRes = await sdk.admin.upload.create({
        files: [avatarFile]
      }) as any
      uploadedUrl = uploadRes.files[0].url
    }

    createMutation.mutate({
      name: formData.name,
      role: formData.role,
      text: formData.text,
      time: formData.time,
      type: formData.type,
      avatar: uploadedUrl,
    })
  }

  return (
    <Container className="p-6 max-w-2xl mx-auto">
      <Heading level="h1" className="mb-6">Create Review</Heading>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            placeholder="e.g. Kasun Perera"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Role</Label>
          <Input 
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            required
            placeholder="e.g. Startup Founder"
          />
        </div>

        <div className="space-y-2">
          <Label>Review Text</Label>
          <Textarea 
            value={formData.text}
            onChange={(e) => setFormData({...formData, text: e.target.value})}
            required
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(val) => setFormData({...formData, type: val})}
            >
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="received">Received (Left)</Select.Item>
                <Select.Item value="sent">Sent (Right)</Select.Item>
              </Select.Content>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Time</Label>
            <Input 
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              required
              placeholder="e.g. 09:41 AM"
            />
          </div>
        </div>

        <div className="space-y-2 border p-4 rounded-md bg-ui-bg-subtle">
          <Label className="block mb-2 font-bold">Avatar Image (Optional)</Label>
          
          {!imgSrc && (
            <>
              <Input 
                type="file" 
                accept="image/*"
                ref={fileInputRef}
                onChange={onSelectFile}
              />
              {avatarFile && (
                <Text className="text-ui-fg-subtle text-sm mt-2 text-emerald-600">
                  ✓ Cropped & optimized image ready to upload.
                </Text>
              )}
            </>
          )}

          {imgSrc && (
            <div className="flex flex-col items-center gap-4 bg-white p-4 rounded-md shadow-sm border border-ui-border-base mt-4">
              <Text className="font-medium text-ui-fg-base">Crop your avatar to a square</Text>
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                aspect={1}
                circularCrop
                className="max-h-[60vh] object-contain rounded-md overflow-hidden bg-black/5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imgRef}
                  alt="Crop preview"
                  src={imgSrc}
                  onLoad={onImageLoad}
                  className="max-w-full max-h-[60vh] object-contain"
                />
              </ReactCrop>
              <div className="flex gap-2 w-full justify-end mt-4">
                <Button 
                  variant="secondary" 
                  type="button"
                  onClick={() => {
                    setImgSrc("")
                    if (fileInputRef.current) fileInputRef.current.value = ""
                  }}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button 
                  type="button"
                  onClick={handleConfirmCrop}
                  disabled={!crop || isUploading}
                >
                  {isUploading ? "Optimizing..." : "Confirm Crop"}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={() => navigate("/reviews")}>
            Cancel
          </Button>
          <Button type="submit" isLoading={createMutation.isPending || isUploading}>
            Save Review
          </Button>
        </div>
      </form>
    </Container>
  )
}

export default CreateReviewPage
