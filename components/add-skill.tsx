"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createSkill } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"

type AddSkillProps = {
  studentId: number
  onAdd?: () => void
}

export default function AddSkill({ studentId, onAdd }: AddSkillProps) {
  const [skill, setSkill] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!skill.trim()) {
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createSkill(studentId, skill.trim())

      if (result.success) {
        toast({
          title: "Skill added",
          description: "Your skill has been added successfully.",
        })
        setSkill("")
        onAdd?.()
      } else {
        throw new Error(result.error || "Failed to add skill")
      }
    } catch (error) {
      console.error("Error adding skill:", error)
      toast({
        title: "Error",
        description: "Failed to add skill. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={skill}
        onChange={(e) => setSkill(e.target.value)}
        placeholder="Enter a skill"
        disabled={isSubmitting}
      />
      <Button type="submit" disabled={isSubmitting || !skill.trim()} className="shrink-0">
        {isSubmitting ? "Adding..." : "Add"}
      </Button>
    </form>
  )
}

