"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Github, Trash2, X, ImageIcon } from "lucide-react"
import { updateProject, deleteProject, addProjectImage, deleteProjectImage } from "@/lib/actions"
import { CloudinaryUploadWidget } from "@/lib/cloudinary"
import { toast } from "@/components/ui/use-toast"

type ProjectImage = {
  id: number
  imageUrl: string
}

type ProjectItemProps = {
  id: number
  studentId: number
  name: string
  description?: string | null
  githubUrl?: string | null
  images: ProjectImage[]
  onDelete?: () => void
}

export default function ProjectItem({
  id,
  studentId,
  name,
  description,
  githubUrl,
  images,
  onDelete,
}: ProjectItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name,
    description: description || "",
    githubUrl: githubUrl || "",
    images: images.map((img) => img.imageUrl),
  })

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await updateProject(id, studentId, formData)

      if (result.success) {
        toast({
          title: "Project updated",
          description: "Your project has been updated successfully.",
        })
        setIsEditing(false)
      } else {
        throw new Error(result.error || "Failed to update project")
      }
    } catch (error) {
      console.error("Error updating project:", error)
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle deletion
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return
    }

    setIsDeleting(true)

    try {
      const result = await deleteProject(id, studentId)

      if (result.success) {
        toast({
          title: "Project deleted",
          description: "Your project has been deleted successfully.",
        })
        onDelete?.()
      } else {
        throw new Error(result.error || "Failed to delete project")
      }
    } catch (error) {
      console.error("Error deleting project:", error)
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Handle image upload
  const handleImageUpload = async (url: string) => {
    setIsUploadingImage(true)

    try {
      const result = await addProjectImage(id, studentId, url)

      if (result.success) {
        toast({
          title: "Image added",
          description: "Your project image has been added successfully.",
        })
        // Update local state
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, url],
        }))
      } else {
        throw new Error(result.error || "Failed to add project image")
      }
    } catch (error) {
      console.error("Error adding project image:", error)
      toast({
        title: "Error",
        description: "Failed to add project image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploadingImage(false)
    }
  }

  // Handle image deletion
  const handleImageDelete = async (imageId: number, index: number) => {
    try {
      const result = await deleteProjectImage(imageId, studentId)

      if (result.success) {
        toast({
          title: "Image deleted",
          description: "Your project image has been deleted successfully.",
        })
        // Update local state
        setFormData((prev) => ({
          ...prev,
          images: prev.images.filter((_, i) => i !== index),
        }))
      } else {
        throw new Error(result.error || "Failed to delete project image")
      }
    } catch (error) {
      console.error("Error deleting project image:", error)
      toast({
        title: "Error",
        description: "Failed to delete project image. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isEditing) {
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
                {images.map((image, index) => (
                  <div key={image.id} className="relative w-24 h-24 rounded overflow-hidden">
                    <img
                      src={image.imageUrl || "/placeholder.svg"}
                      alt={`Project image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageDelete(image.id, index)}
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
                    disabled={isUploadingImage}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span className="text-xs">{isUploadingImage ? "Uploading..." : "Add Image"}</span>
                  </Button>
                </CloudinaryUploadWidget>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg">{name}</h3>

        <div className="flex items-center gap-2">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-primary hover:underline"
            >
              <Github className="h-4 w-4 mr-1" />
              <span>GitHub</span>
            </a>
          )}

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} className="h-8 w-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-pencil"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-8 w-8 text-red-500"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      </div>

      {description && <p className="text-muted-foreground">{description}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {images.map((image) => (
            <div key={image.id} className="rounded-md overflow-hidden aspect-video">
              <img
                src={image.imageUrl || "/placeholder.svg"}
                alt={`${name} screenshot`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

