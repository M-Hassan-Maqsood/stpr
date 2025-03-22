"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Trash2 } from "lucide-react"
import { updateEducation, deleteEducation } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"

type EducationItemProps = {
  id: number
  studentId: number
  institution: string
  degree: string
  fieldOfStudy?: string | null
  startDate?: Date | null
  endDate?: Date | null
  description?: string | null
  onDelete?: () => void
}

export default function EducationItem({
  id,
  studentId,
  institution,
  degree,
  fieldOfStudy,
  startDate,
  endDate,
  description,
  onDelete,
}: EducationItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    institution,
    degree,
    fieldOfStudy: fieldOfStudy || "",
    startDate: startDate ? new Date(startDate).toISOString().split("T")[0] : "",
    endDate: endDate ? new Date(endDate).toISOString().split("T")[0] : "",
    description: description || "",
  })

  // Format date for display
  const formatDate = (dateString?: Date | null) => {
    if (!dateString) return "Present"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

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
      const result = await updateEducation(id, studentId, formData)

      if (result.success) {
        toast({
          title: "Education updated",
          description: "Your education record has been updated successfully.",
        })
        setIsEditing(false)
      } else {
        throw new Error(result.error || "Failed to update education")
      }
    } catch (error) {
      console.error("Error updating education:", error)
      toast({
        title: "Error",
        description: "Failed to update education record. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle deletion
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this education record?")) {
      return
    }

    setIsDeleting(true)

    try {
      const result = await deleteEducation(id, studentId)

      if (result.success) {
        toast({
          title: "Education deleted",
          description: "Your education record has been deleted successfully.",
        })
        onDelete?.()
      } else {
        throw new Error(result.error || "Failed to delete education")
      }
    } catch (error) {
      console.error("Error deleting education:", error)
      toast({
        title: "Error",
        description: "Failed to delete education record. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (isEditing) {
    return (
      <Card className="p-4 relative">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="degree">Degree</Label>
              <Input id="degree" name="degree" value={formData.degree} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fieldOfStudy">Field of Study</Label>
              <Input id="fieldOfStudy" name="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
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
    <div className="space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{institution}</h3>
          <p>
            {degree}
            {fieldOfStudy ? ` in ${fieldOfStudy}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center text-muted-foreground text-sm">
            <Calendar className="h-4 w-4 mr-1" />
            <span>
              {formatDate(startDate)} - {formatDate(endDate)}
            </span>
          </div>
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

      {description && <p className="text-muted-foreground text-sm">{description}</p>}
    </div>
  )
}

