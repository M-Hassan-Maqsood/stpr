"use client"

import type React from "react"

import { CldUploadWidget } from "next-cloudinary"

type CloudinaryUploadWidgetProps = {
  onUpload: (url: string) => void
  children: React.ReactNode
}

export function CloudinaryUploadWidget({ onUpload, children }: CloudinaryUploadWidgetProps) {
  return (
    <CldUploadWidget
      uploadPreset="student_profiles"
      options={{
        maxFiles: 1,
        sources: ["local", "url", "camera"],
        styles: {
          palette: {
            window: "#F5F5F5",
            sourceBg: "#FFFFFF",
            windowBorder: "#90a0b3",
            tabIcon: "#0078FF",
            inactiveTabIcon: "#69778A",
            menuIcons: "#0078FF",
            link: "#0078FF",
            action: "#0078FF",
            inProgress: "#0078FF",
            complete: "#53A318",
            error: "#E53E3E",
            textDark: "#000000",
            textLight: "#FFFFFF",
          },
          fonts: {
            default: null,
            "'Poppins', sans-serif": {
              url: "https://fonts.googleapis.com/css?family=Poppins",
              active: true,
            },
          },
        },
      }}
      onUpload={(result: any) => {
        if (result.info && result.info.secure_url) {
          onUpload(result.info.secure_url)
        }
      }}
    >
      {children}
    </CldUploadWidget>
  )
}

