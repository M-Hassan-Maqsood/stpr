"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { deleteSkill } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"

type SkillItemProps = {
  id: number
  studentId: number
  name: string
  onDelete?: () => void
}

export default function SkillItem({ id, studentId, name, onDelete }: SkillItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  // Handle deletion
  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const result = await deleteSkill(id, studentId)

      if (result.success) {
        toast({
          title: "Skill deleted",
          description: "Your skill has been deleted successfully.",
        })
        onDelete?.()
      } else {
        throw new Error(result.error || "Failed to delete skill")
      }
    } catch (error) {
      console.error("Error deleting skill:", error)
      toast({
        title: "Error",
        description: "Failed to delete skill. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-1">
      {name}
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-secondary-foreground/70 hover:text-secondary-foreground disabled:opacity-50"
      >
        <X className="w-3 h-3" />
        <span className="sr-only">Delete</span>
      </button>
    </div>
  )
}

