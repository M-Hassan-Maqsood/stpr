import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const education = await prisma.education.findUnique({
      where: { id },
    })

    if (!education) {
      return NextResponse.json({ error: "Education record not found" }, { status: 404 })
    }

    return NextResponse.json(education)
  } catch (error) {
    console.error("Error fetching education record:", error)
    return NextResponse.json({ error: "Failed to fetch education record" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const data = await request.json()

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

    return NextResponse.json(education)
  } catch (error) {
    console.error("Error updating education record:", error)
    return NextResponse.json({ error: "Failed to update education record" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    await prisma.education.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Education record deleted successfully" })
  } catch (error) {
    console.error("Error deleting education record:", error)
    return NextResponse.json({ error: "Failed to delete education record" }, { status: 500 })
  }
}

