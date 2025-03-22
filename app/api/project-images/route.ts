import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")

    const where = projectId ? { projectId: Number.parseInt(projectId) } : {}

    const images = await prisma.projectImage.findMany({
      where,
    })

    return NextResponse.json(images)
  } catch (error) {
    console.error("Error fetching project images:", error)
    return NextResponse.json({ error: "Failed to fetch project images" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const image = await prisma.projectImage.create({
      data: {
        projectId: data.projectId,
        imageUrl: data.imageUrl,
      },
    })

    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    console.error("Error creating project image:", error)
    return NextResponse.json({ error: "Failed to create project image" }, { status: 500 })
  }
}

