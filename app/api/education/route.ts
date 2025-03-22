import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")

    const where = studentId ? { studentId: Number.parseInt(studentId) } : {}

    const education = await prisma.education.findMany({
      where,
      orderBy: { startDate: "desc" },
    })

    return NextResponse.json(education)
  } catch (error) {
    console.error("Error fetching education records:", error)
    return NextResponse.json({ error: "Failed to fetch education records" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const education = await prisma.education.create({
      data: {
        studentId: data.studentId,
        institution: data.institution,
        degree: data.degree,
        fieldOfStudy: data.fieldOfStudy,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        description: data.description,
      },
    })

    return NextResponse.json(education, { status: 201 })
  } catch (error) {
    console.error("Error creating education record:", error)
    return NextResponse.json({ error: "Failed to create education record" }, { status: 500 })
  }
}

