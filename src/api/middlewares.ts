import { defineMiddlewares } from "@medusajs/medusa";
import { validateAndTransformBody } from "@medusajs/framework/http";
import type { MedusaRequest, MedusaResponse, MedusaNextFunction } from "@medusajs/framework/http";
import { PostAdminCreateCapability, PostAdminUpdateCapability } from "./admin/capabilities/validators";
import sharp from "sharp";
import express from "express";

// Global patch to prevent Express from crashing with 500 Internal Server Error (URIError)
// when handling malformed URIs (e.g., URLs with unescaped '%' characters like '...%-3598.webp').
// Express's router uses decodeURIComponent internally on req.path and throws if it's invalid.
const originalDecode = global.decodeURIComponent;
global.decodeURIComponent = function(str) {
  try {
    return originalDecode(str);
  } catch (e) {
    if (e instanceof URIError) {
      // Safely escape invalid '%' characters and retry
      return originalDecode(str.replace(/%(?![0-9a-fA-F]{2})/g, '%25'));
    }
    throw e;
  }
};

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/capabilities",
      method: "POST",
      middlewares: [
        validateAndTransformBody(PostAdminCreateCapability),
      ],
    },
    {
      matcher: "/admin/capabilities/:id",
      method: "POST",
      middlewares: [
        validateAndTransformBody(PostAdminUpdateCapability),
      ],
    },
    {
      matcher: "/admin/uploads",
      method: "POST",
      middlewares: [
        async (req: MedusaRequest, res: MedusaResponse, next: MedusaNextFunction) => {
          try {
            // Check if req.files exists (populated by Medusa's multipart parser)
            // @ts-ignore
            if (req.files && Array.isArray(req.files)) {
              // @ts-ignore
              for (const file of req.files) {
                // Only process images
                if (file.mimetype && file.mimetype.startsWith("image/")) {
                  // Optimize with Sharp
                  const optimizedBuffer = await sharp(file.buffer)
                    .resize({ width: 1000, withoutEnlargement: true })
                    .webp({ quality: 80 })
                    .toBuffer();
                  
                  // Overwrite the file object properties
                  file.buffer = optimizedBuffer;
                  file.mimetype = "image/webp";
                  file.originalname = file.originalname.replace(/\.[^/.]+$/, "") + ".webp";
                  file.size = optimizedBuffer.length;
                }

                // Compress PDFs
                if (file.mimetype === "application/pdf") {
                  try {
                    const { compress } = await import("@quicktoolsone/pdf-compress");
                    const result = await compress(file.buffer, {
                      preset: 'balanced', 
                    });
                    
                    const compressedBuffer = Buffer.from(result.pdf);
                    
                    // Overwrite the file object properties with the compressed PDF
                    file.buffer = compressedBuffer;
                    file.size = compressedBuffer.length;
                  } catch (pdfError) {
                    console.error("PDF compression middleware failed:", pdfError);
                    // Let the upload proceed unoptimized if compression fails
                  }
                }
              }
            }
          } catch (error) {
            console.error("Upload optimization middleware failed:", error);
            // Let the upload proceed unoptimized if sharp fails
          }
          
          next();
        }
      ]
    },
    {
      matcher: "/static/*",
      middlewares: [
        (req: MedusaRequest, res: MedusaResponse, next: MedusaNextFunction) => {
          req.url = req.url.replace(/^\/static/, "");
          // Fix malformed URI encodings so express.static doesn't crash with 500
          req.url = req.url.replace(/%(?![0-9a-fA-F]{2})/g, "%25");
          next();
        },
        express.static("static")
      ]
    }
  ]
});
