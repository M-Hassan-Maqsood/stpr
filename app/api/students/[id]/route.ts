import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        education: true,
        experience: true,
        skills: true,
        projects: {
          include: {
            images: true,
          },
        },
      },
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json(student)
  } catch (error) {
    console.error("Error fetching student:", error)
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const data = await request.json()

    // First, delete existing related records to avoid duplicates
    await prisma.$transaction([
      prisma.education.deleteMany({ where: { studentId: id } }),
      prisma.experience.deleteMany({ where: { studentId: id } }),
      prisma.skill.deleteMany({ where: { studentId: id } }),
      prisma.projectImage.deleteMany({
        where: { project: { studentId: id } },
      }),
      prisma.project.deleteMany({ where: { studentId: id } }),
    ])

    // Then update the student with new data
    const student = await prisma.student.update({
      where: { id },
      data: {
        name: data.name,
        profilePictureUrl: data.profilePictureUrl,
        profession: data.profession,
        batch: data.batch,
        about: data.about,
        phoneNumber: data.phoneNumber,
        email: data.email,
        linkedinUrl: data.linkedinUrl,
        education: {
          create: data.education || [],
        },
        experience: {
          create: data.experience || [],
        },
        skills: {
          create: data.skills?.map((skill: string) => ({ name: skill })) || [],
        },
        projects: {
          create:
            data.projects?.map((project: any) => ({
              name: project.name,
              description: project.description,
              githubUrl: project.githubUrl,
              images: {
                create: project.images?.map((url: string) => ({ imageUrl: url })) || [],
              },
            })) || [],
        },
      },
      include: {
        education: true,
        experience: true,
        skills: true,
        projects: {
          include: {
            images: true,
          },
        },
      },
    })

    return NextResponse.json(student)
  } catch (error) {
    console.error("Error updating student:", error)
    return NextResponse.json({ error: "Failed to update student profile" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    await prisma.student.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Student deleted successfully" })
  } catch (error) {
    console.error("Error deleting student:", error)
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 })
  }
}

