"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle } from "lucide-react"
import { createExperience } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"

type AddExperienceProps = {
  studentId: number
  onAdd?: () => void
}

export default function AddExperience({ studentId, onAdd }: AddExperienceProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    company: "",
    position: "",
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
      const result = await createExperience(studentId, formData)

      if (result.success) {
        toast({
          title: "Experience added",
          description: "Your experience record has been added successfully.",
        })
        setFormData({
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        })
        setIsAdding(false)
        onAdd?.()
      } else {
        throw new Error(result.error || "Failed to add experience")
      }
    } catch (error) {
      console.error("Error adding experience:", error)
      toast({
        title: "Error",
        description: "Failed to add experience record. Please try again.",
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
        Add Experience
      </Button>
    )
  }

  return (
    <Card className="p-4 relative">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" value={formData.company} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input id="position" name="position" value={formData.position} onChange={handleChange} required />
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
            {isSubmitting ? "Adding..." : "Add Experience"}
          </Button>
        </div>
      </form>
    </Card>
  )
}

