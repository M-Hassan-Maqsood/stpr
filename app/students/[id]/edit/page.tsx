import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import StudentEditForm from "@/components/student-edit-form"

export const metadata = {
  title: "Edit Student Profile",
  description: "Edit your student profile information",
}

export default async function EditProfilePage({ params }: { params: { id: string } }) {
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
    notFound()
  }

  return <StudentEditForm student={student} />
}

