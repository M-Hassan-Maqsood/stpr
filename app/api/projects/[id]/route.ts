import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        images: true,
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const data = await request.json()

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

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // Images will be automatically deleted due to cascade delete
    await prisma.project.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}

