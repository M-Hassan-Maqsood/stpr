"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, ImageIcon, X } from "lucide-react"
import { createProject } from "@/lib/actions"
import { CloudinaryUploadWidget } from "@/lib/cloudinary"
import { toast } from "@/components/ui/use-toast"

type AddProjectProps = {
  studentId: number
  onAdd?: () => void
}

export default function AddProject({ studentId, onAdd }: AddProjectProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    githubUrl: "",
    images: [] as string[],
  })

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle image upload
  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, url],
    }))
  }

  // Handle image removal
  const handleImageRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await createProject(studentId, formData)

      if (result.success) {
        toast({
          title: "Project added",
          description: "Your project has been added successfully.",
        })
        setFormData({
          name: "",
          description: "",
          githubUrl: "",
          images: [],
        })
        setIsAdding(false)
        onAdd?.()
      } else {
        throw new Error(result.error || "Failed to add project")
      }
    } catch (error) {
      console.error("Error adding project:", error)
      toast({
        title: "Error",
        description: "Failed to add project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAdding) {
    return (
      <Button type="button" variant="outline" onClick={() => setIsAdding(true)} className="flex items-center gap-1">
        <PlusCircle className="w-4 h-4" />
        Add Project
      </Button>
    )
  }

  return (
    <Card className="p-4 relative">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input
              id="githubUrl"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div className="space-y-2">
            <Label>Project Images</Label>
            <div className="flex flex-wrap gap-4">
              {formData.images.map((url, index) => (
                <div key={index} className="relative w-24 h-24 rounded overflow-hidden">
                  <img
                    src={url || "/placeholder.svg"}
                    alt={`Project image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <CloudinaryUploadWidget onUpload={handleImageUpload}>
                <Button
                  type="button"
                  variant="outline"
                  className="h-24 w-24 flex flex-col items-center justify-center gap-1"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-xs">Add Image</span>
                </Button>
              </CloudinaryUploadWidget>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setIsAdding(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Project"}
          </Button>
        </div>
      </form>
    </Card>
  )
}

