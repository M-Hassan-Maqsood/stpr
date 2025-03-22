import Link from "next/link"
import { Button } from "@/components/ui/button"
import prisma from "@/lib/prisma"
import StudentCard from "@/components/student-card"

export default async function Home() {
  const students = await prisma.student.findMany({
    include: {
      skills: true,
    },
  })

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold">Student Profiles</h1>
          <p className="text-muted-foreground mt-2">Browse and discover talented students</p>
        </div>

        <Button asChild>
          <Link href="/create">Create Profile</Link>
        </Button>
      </div>

      {students.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {students.map((student) => (
            <StudentCard
              key={student.id}
              id={student.id}
              name={student.name}
              profilePictureUrl={student.profilePictureUrl}
              profession={student.profession}
              batch={student.batch}
              skills={student.skills}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">No profiles yet</h2>
          <p className="text-muted-foreground mb-6">Be the first to create your student profile</p>
          <Button asChild>
            <Link href="/create">Create Profile</Link>
          </Button>
        </div>
      )}
    </main>
  )
}

