import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")

    const where = studentId ? { studentId: Number.parseInt(studentId) } : {}

    const experience = await prisma.experience.findMany({
      where,
      orderBy: { startDate: "desc" },
    })

    return NextResponse.json(experience)
  } catch (error) {
    console.error("Error fetching experience records:", error)
    return NextResponse.json({ error: "Failed to fetch experience records" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const experience = await prisma.experience.create({
      data: {
        studentId: data.studentId,
        company: data.company,
        position: data.position,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        description: data.description,
      },
    })

    return NextResponse.json(experience, { status: 201 })
  } catch (error) {
    console.error("Error creating experience record:", error)
    return NextResponse.json({ error: "Failed to create experience record" }, { status: 500 })
  }
}

