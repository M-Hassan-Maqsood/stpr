import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")

    const where = studentId ? { studentId: Number.parseInt(studentId) } : {}

    const projects = await prisma.project.findMany({
      where,
      include: {
        images: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const project = await prisma.project.create({
      data: {
        studentId: data.studentId,
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

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}

