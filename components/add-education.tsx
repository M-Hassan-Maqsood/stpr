"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle } from "lucide-react"
import { createEducation } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"

type AddEducationProps = {
  studentId: number
  onAdd?: () => void
}

export default function AddEducation({ studentId, onAdd }: AddEducationProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    description: "",
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
      const result = await createEducation(studentId, formData)

      if (result.success) {
        toast({
          title: "Education added",
          description: "Your education record has been added successfully.",
        })
        setFormData({
          institution: "",
          degree: "",
          fieldOfStudy: "",
          startDate: "",
          endDate: "",
          description: "",
        })
        setIsAdding(false)
        onAdd?.()
      } else {
        throw new Error(result.error || "Failed to add education")
      }
    } catch (error) {
      console.error("Error adding education:", error)
      toast({
        title: "Error",
        description: "Failed to add education record. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAdding) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setIsAdding(true)}
        className="flex items-center gap-1"
      >
        <PlusCircle className="w-4 h-4" />
        Add Education
      </Button>
    )
  }

  return (
    <Card className="p-4 relative">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="institution">Institution</Label>
            <Input id="institution" name="institution" value={formData.institution} onChange={handleChange} required />
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
          <Button type="button" variant="outline" onClick={() => setIsAdding(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Education"}
          </Button>
        </div>
      </form>
    </Card>
  )
}

