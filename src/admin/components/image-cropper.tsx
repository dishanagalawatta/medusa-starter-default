import React, { useState, useRef } from "react"
import ReactCrop, { type Crop, centerCrop, makeAspectCrop, PixelCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import imageCompression from "browser-image-compression"
import { Button, Text, Heading } from "@medusajs/ui"

interface ImageCropperProps {
  imageFile: File
  onCropComplete: (file: File) => void
  onCancel: () => void
}

export const ImageCropper: React.FC<ImageCropperProps> = ({ imageFile, onCropComplete, onCancel }) => {
  const [imgSrc, setImgSrc] = useState<string>("")
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const reader = new FileReader()
    reader.addEventListener("load", () => setImgSrc(reader.result?.toString() || ""))
    reader.readAsDataURL(imageFile)
  }, [imageFile])

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        1, // 1:1 aspect ratio
        width,
        height
      ),
      width,
      height
    )
    setCrop(crop)
  }

  const handleCrop = async () => {
    if (!completedCrop || !imgRef.current || !canvasRef.current) return

    setIsProcessing(true)

    try {
      const image = imgRef.current
      const canvas = canvasRef.current
      const crop = completedCrop

      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        throw new Error("No 2d context")
      }

      const pixelRatio = window.devicePixelRatio
      canvas.width = crop.width * scaleX * pixelRatio
      canvas.height = crop.height * scaleY * pixelRatio

      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      ctx.imageSmoothingQuality = "high"

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      )

      canvas.toBlob(async (blob) => {
        if (!blob) {
          console.error("Canvas is empty")
          setIsProcessing(false)
          return
        }

        const croppedFile = new File([blob], imageFile.name, {
          type: "image/jpeg",
          lastModified: Date.now(),
        })

        // Compress
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        }
        
        const compressedFile = await imageCompression(croppedFile, options)
        onCropComplete(compressedFile)
        setIsProcessing(false)
      }, "image/jpeg", 0.95)
    } catch (e) {
      console.error(e)
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-ui-bg-base rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-auto shadow-elevation-modal">
        <Heading level="h2" className="mb-4">Crop Image</Heading>
        <Text className="text-ui-fg-subtle mb-4">Please crop the image to a 1:1 square ratio for the Orbiting Showcase.</Text>
        
        <div className="flex justify-center mb-6 max-h-[50vh] overflow-hidden bg-ui-bg-subtle rounded-md">
          {!!imgSrc && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                onLoad={onImageLoad}
                style={{ maxHeight: "50vh" }}
              />
            </ReactCrop>
          )}
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleCrop} isLoading={isProcessing}>
            Apply & Compress
          </Button>
        </div>
      </div>
    </div>
  )
}
