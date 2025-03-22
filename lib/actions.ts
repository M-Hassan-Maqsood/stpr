"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Education CRUD operations
export async function createEducation(studentId: number, data: any) {
  try {
    const education = await prisma.education.create({
      data: {
        studentId,
        institution: data.institution,
        degree: data.degree,
        fieldOfStudy: data.fieldOfStudy,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        description: data.description,
      },
    })

    revalidatePath(`/students/${studentId}`)
    return { success: true, data: education }
  } catch (error) {
    console.error("Error creating education:", error)
    return { success: false, error: "Failed to create education record" }
  }
}

export async function updateEducation(id: number, studentId: number, data: any) {
  try {
    const education = await prisma.education.update({
      where: { id },
      data: {
        institution: data.institution,
        degree: data.degree,
        fieldOfStudy: data.fieldOfStudy,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        description: data.description,
      },
    })

    revalidatePath(`/students/${studentId}`)
    return { success: true, data: education }
  } catch (error) {
    console.error("Error updating education:", error)
    return { success: false, error: "Failed to update education record" }
  }
}

export async function deleteEducation(id: number, studentId: number) {
  try {
    await prisma.education.delete({
      where: { id },
    })

    revalidatePath(`/students/${studentId}`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting education:", error)
    return { success: false, error: "Failed to delete education record" }
  }
}

// Experience CRUD operations
export async function createExperience(studentId: number, data: any) {
  try {
    const experience = await prisma.experience.create({
      data: {
        studentId,
        company: data.company,
        position: data.position,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        description: data.description,
      },
    })

    revalidatePath(`/students/${studentId}`)
    return { success: true, data: experience }
  } catch (error) {
    console.error("Error creating experience:", error)
    return { success: false, error: "Failed to create experience record" }
  }
}

export async function updateExperience(id: number, studentId: number, data: any) {
  try {
    const experience = await prisma.experience.update({
      where: { id },
      data: {
        company: data.company,
        position: data.position,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        description: data.description,
      },
    })

    revalidatePath(`/students/${studentId}`)
    return { success: true, data: experience }
  } catch (error) {
    console.error("Error updating experience:", error)
    return { success: false, error: "Failed to update experience record" }
  }
}

export async function deleteExperience(id: number, studentId: number) {
  try {
    await prisma.experience.delete({
      where: { id },
    })

    revalidatePath(`/students/${studentId}`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting experience:", error)
    return { success: false, error: "Failed to delete experience record" }
  }
}

// Skills CRUD operations
export async function createSkill(studentId: number, name: string) {
  try {
    const skill = await prisma.skill.create({
      data: {
        studentId,
        name,
      },
    })

    revalidatePath(`/students/${studentId}`)
    return { success: true, data: skill }
  } catch (error) {
    console.error("Error creating skill:", error)
    return { success: false, error: "Failed to create skill record" }
  }
}

export async function deleteSkill(id: number, studentId: number) {
  try {
    await prisma.skill.delete({
      where: { id },
    })

    revalidatePath(`/students/${studentId}`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting skill:", error)
    return { success: false, error: "Failed to delete skill record" }
  }
}

// Projects CRUD operations
export async function createProject(studentId: number, data: any) {
  try {
    const project = await prisma.project.create({
      data: {
        studentId,
        name: data.name,
        description: data.description,
        githubUrl: data.githubUrl,
        images: {
          create: data.images?.map((url: string) => ({ imageUrl: url })) || [],
        },
      },
      include: {
        images: true,
      },
    })

    revalidatePath(`/students/${studentId}`)
    return { success: true, data: project }
  } catch (error) {
    console.error("Error creating project:", error)
    return { success: false, error: "Failed to create project record" }
  }
}

export async function updateProject(id: number, studentId: number, data: any) {
  try {
    // First delete existing images to avoid duplicates
    await prisma.projectImage.deleteMany({
      where: { projectId: id },
    })

    const project = await prisma.project.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        githubUrl: data.githubUrl,
        images: {
          create: data.images?.map((url: string) => ({ imageUrl: url })) || [],
        },
      },
      include: {
        images: true,
      },
    })

    revalidatePath(`/students/${studentId}`)
    return { success: true, data: project }
  } catch (error) {
    console.error("Error updating project:", error)
    return { success: false, error: "Failed to update project record" }
  }
}

export async function deleteProject(id: number, studentId: number) {
  try {
    // Images will be automatically deleted due to cascade delete
    await prisma.project.delete({
      where: { id },
    })

    revalidatePath(`/students/${studentId}`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting project:", error)
    return { success: false, error: "Failed to delete project record" }
  }
}

// Project Images CRUD operations
export async function addProjectImage(projectId: number, studentId: number, imageUrl: string) {
  try {
    const image = await prisma.projectImage.create({
      data: {
        projectId,
        imageUrl,
      },
    })

    revalidatePath(`/students/${studentId}`)
    return { success: true, data: image }
  } catch (error) {
    console.error("Error adding project image:", error)
    return { success: false, error: "Failed to add project image" }
  }
}

export async function deleteProjectImage(id: number, studentId: number) {
  try {
    await prisma.projectImage.delete({
      where: { id },
    })

    revalidatePath(`/students/${studentId}`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting project image:", error)
    return { success: false, error: "Failed to delete project image" }
  }
}

