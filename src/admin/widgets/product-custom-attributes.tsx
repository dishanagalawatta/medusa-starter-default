import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Table, Input, Drawer, IconButton, Select } from "@medusajs/ui"
import { useState, useEffect, useRef } from "react"
import type { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"

// Simple SVG icons
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="19" cy="12" r="1"></circle>
    <circle cx="5" cy="12" r="1"></circle>
  </svg>
)

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
)

const ProductCustomAttributesWidget = ({ data: product }: DetailWidgetProps<AdminProduct>) => {
  const [attributes, setAttributes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [value, setValue] = useState("")
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  
  // PDF upload state
  const [inputType, setInputType] = useState<"text" | "pdf">("text")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchAttributes = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/admin/products/${product.id}/custom-attributes`)
      const data = await res.json()
      setAttributes(data.product_attributes || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttributes()
  }, [product.id])

  const handleUpload = async (file: File) => {
    const formData = new FormData()
    formData.append("files", file)

    const res = await fetch(`/admin/uploads`, {
      method: "POST",
      body: formData,
    })
    
    if (!res.ok) throw new Error("Upload failed")
      
    const data = await res.json()
    return data.files[0].url
  }

  const handleAdd = async () => {
    if (!name) return
    if (inputType === "text" && !value) return
    if (inputType === "pdf" && !selectedFile) return

    try {
      setIsUploading(true)
      
      let finalValue = value
      if (inputType === "pdf" && selectedFile) {
        // Upload the PDF (it will be automatically compressed by our middleware)
        finalValue = await handleUpload(selectedFile)
      }

      await fetch(`/admin/products/${product.id}/custom-attributes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, value: finalValue }),
      })
      
      setName("")
      setValue("")
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
      fetchAttributes()
    } catch (e) {
      console.error(e)
      alert("Failed to add attribute. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (attributeId: string) => {
    try {
      await fetch(`/admin/products/${product.id}/custom-attributes/${attributeId}`, {
        method: "DELETE",
      })
      fetchAttributes()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Custom Attributes</Heading>
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <Drawer.Trigger asChild>
            <IconButton variant="transparent">
              <EditIcon />
            </IconButton>
          </Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Edit Custom Attributes</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body className="p-4 flex flex-col gap-y-6 overflow-y-auto">
              <div className="flex flex-col gap-y-4">
                <Text size="small" className="text-ui-fg-subtle">
                  Manage the custom attributes associated with this product.
                </Text>
                
                {/* Add new attribute form */}
                <div className="flex flex-col gap-y-3 p-4 bg-ui-bg-subtle border rounded-lg">
                  <Text size="small" weight="plus">Add New Attribute</Text>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant={inputType === "text" ? "primary" : "secondary"} 
                      onClick={() => setInputType("text")}
                      size="small"
                    >
                      Text Value
                    </Button>
                    <Button 
                      variant={inputType === "pdf" ? "primary" : "secondary"} 
                      onClick={() => setInputType("pdf")}
                      size="small"
                    >
                      PDF Document
                    </Button>
                  </div>

                  <Input 
                    placeholder="Attribute Name (e.g. Brand or Manual)" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    disabled={isUploading}
                  />
                  
                  {inputType === "text" ? (
                    <Input 
                      placeholder="Value (e.g. Sony)" 
                      value={value} 
                      onChange={(e) => setValue(e.target.value)} 
                      disabled={isUploading}
                    />
                  ) : (
                    <input 
                      type="file" 
                      accept="application/pdf"
                      ref={fileInputRef}
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="text-sm text-ui-fg-base file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-ui-bg-base file:text-ui-fg-base hover:file:bg-ui-bg-subtle border border-ui-border-base rounded-md p-1"
                      disabled={isUploading}
                    />
                  )}
                  
                  <Button 
                    variant="secondary" 
                    onClick={handleAdd}
                    isLoading={isUploading}
                  >
                    {isUploading ? "Uploading & Adding..." : "Add Attribute"}
                  </Button>
                </div>

                {/* Existing attributes list */}
                {attributes.length > 0 && (
                  <div className="flex flex-col gap-y-2 mt-4">
                    <Text size="small" weight="plus">Existing Attributes</Text>
                    <div className="flex flex-col gap-y-2">
                      {attributes.map(attr => (
                        <div key={attr.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex flex-col">
                            <Text size="small" weight="plus">{attr.name}</Text>
                            {attr.value.startsWith("http") && attr.value.includes(".pdf") ? (
                              <a href={attr.value} target="_blank" rel="noreferrer" className="text-small text-ui-fg-interactive hover:underline truncate max-w-[200px]">
                                View Document
                              </a>
                            ) : (
                              <Text size="small" className="text-ui-fg-subtle">{attr.value}</Text>
                            )}
                          </div>
                          <IconButton variant="transparent" className="text-ui-fg-error hover:text-ui-fg-error-hover" onClick={() => handleDelete(attr.id)}>
                            <TrashIcon />
                          </IconButton>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer>
      </div>
      <Table>
        <Table.Body>
          {loading ? (
             <Table.Row>
                <Table.Cell className="text-ui-fg-subtle">Loading...</Table.Cell>
                <Table.Cell>-</Table.Cell>
             </Table.Row>
          ) : attributes.length === 0 ? (
            <Table.Row>
              <Table.Cell className="text-ui-fg-subtle">-</Table.Cell>
              <Table.Cell>-</Table.Cell>
            </Table.Row>
          ) : (
            attributes.map((attr) => (
              <Table.Row key={attr.id}>
                <Table.Cell className="text-ui-fg-subtle font-medium">{attr.name}</Table.Cell>
                <Table.Cell className="text-ui-fg-base">
                  {attr.value.startsWith("http") && attr.value.includes(".pdf") ? (
                    <a href={attr.value} target="_blank" rel="noreferrer" className="text-ui-fg-interactive hover:underline">
                      View PDF
                    </a>
                  ) : (
                    attr.value
                  )}
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
    </Container>
  )
}

// Move to the bottom of the details page
export const config = defineWidgetConfig({
  zone: "product.details.side.after",
})

export default ProductCustomAttributesWidget
