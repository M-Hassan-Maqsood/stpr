import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const students = await prisma.student.findMany({
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

    return NextResponse.json(students)
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Create student with nested data
    const student = await prisma.student.create({
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

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error("Error creating student:", error)
    return NextResponse.json({ error: "Failed to create student profile" }, { status: 500 })
  }
}

