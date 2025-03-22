import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const experience = await prisma.experience.findUnique({
      where: { id },
    })

    if (!experience) {
      return NextResponse.json({ error: "Experience record not found" }, { status: 404 })
    }

    return NextResponse.json(experience)
  } catch (error) {
    console.error("Error fetching experience record:", error)
    return NextResponse.json({ error: "Failed to fetch experience record" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const data = await request.json()

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

    return NextResponse.json(experience)
  } catch (error) {
    console.error("Error updating experience record:", error)
    return NextResponse.json({ error: "Failed to update experience record" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    await prisma.experience.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Experience record deleted successfully" })
  } catch (error) {
    console.error("Error deleting experience record:", error)
    return NextResponse.json({ error: "Failed to delete experience record" }, { status: 500 })
  }
}

