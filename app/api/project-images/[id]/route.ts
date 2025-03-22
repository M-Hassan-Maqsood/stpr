import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const image = await prisma.projectImage.findUnique({
      where: { id },
    })

    if (!image) {
      return NextResponse.json({ error: "Project image not found" }, { status: 404 })
    }

    return NextResponse.json(image)
  } catch (error) {
    console.error("Error fetching project image:", error)
    return NextResponse.json({ error: "Failed to fetch project image" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const data = await request.json()

    const image = await prisma.projectImage.update({
      where: { id },
      data: {
        imageUrl: data.imageUrl,
      },
    })

    return NextResponse.json(image)
  } catch (error) {
    console.error("Error updating project image:", error)
    return NextResponse.json({ error: "Failed to update project image" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    await prisma.projectImage.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Project image deleted successfully" })
  } catch (error) {
    console.error("Error deleting project image:", error)
    return NextResponse.json({ error: "Failed to delete project image" }, { status: 500 })
  }
}

