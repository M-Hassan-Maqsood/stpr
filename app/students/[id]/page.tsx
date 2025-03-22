import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Linkedin, Mail, Phone } from "lucide-react"
import prisma from "@/lib/prisma"
import EducationItem from "@/components/education-item"
import ExperienceItem from "@/components/experience-item"
import SkillItem from "@/components/skill-item"
import ProjectItem from "@/components/project-item"
import AddEducation from "@/components/add-education"
import AddExperience from "@/components/add-experience"
import AddSkill from "@/components/add-skill"
import AddProject from "@/components/add-project"

export async function generateMetadata({ params }: { params: { id: string } }) {
  const student = await prisma.student.findUnique({
    where: { id: Number.parseInt(params.id) },
  })

  if (!student) {
    return {
      title: "Student Not Found",
      description: "The requested student profile could not be found",
    }
  }

  return {
    title: `${student.name} | Student Profile`,
    description: student.about || `View ${student.name}'s student profile`,
  }
}

export default async function StudentProfilePage({ params }: { params: { id: string } }) {
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

  // Get initials for avatar fallback
  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-6 flex justify-between items-center">
        <Button variant="outline" asChild>
          <Link href="/">Back to All Profiles</Link>
        </Button>

        <Button asChild>
          <Link href={`/students/${id}/edit`}>Edit Profile</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={student.profilePictureUrl || ""} alt={student.name} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                <h1 className="text-2xl font-bold">{student.name}</h1>

                {student.profession && <p className="text-muted-foreground mt-1">{student.profession}</p>}

                {student.batch && (
                  <Badge variant="outline" className="mt-2">
                    {student.batch}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {student.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span>{student.email}</span>
                </div>
              )}

              {student.phoneNumber && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span>{student.phoneNumber}</span>
                </div>
              )}

              {student.linkedinUrl && (
                <div className="flex items-center gap-3">
                  <Linkedin className="h-5 w-5 text-muted-foreground" />
                  <a
                    href={student.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AddSkill studentId={student.id} />

                <div className="flex flex-wrap gap-2">
                  {student.skills.map((skill) => (
                    <SkillItem key={skill.id} id={skill.id} studentId={student.id} name={skill.name} />
                  ))}

                  {student.skills.length === 0 && <p className="text-muted-foreground">No skills listed</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          {student.about && (
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{student.about}</p>
              </CardContent>
            </Card>
          )}

          {/* Education */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Education</CardTitle>
              <AddEducation studentId={student.id} />
            </CardHeader>
            <CardContent className="space-y-4">
              {student.education.map((edu) => (
                <div key={edu.id}>
                  <EducationItem
                    id={edu.id}
                    studentId={student.id}
                    institution={edu.institution}
                    degree={edu.degree}
                    fieldOfStudy={edu.fieldOfStudy}
                    startDate={edu.startDate}
                    endDate={edu.endDate}
                    description={edu.description}
                  />
                  <Separator className="my-4" />
                </div>
              ))}

              {student.education.length === 0 && <p className="text-muted-foreground">No education listed</p>}
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Experience</CardTitle>
              <AddExperience studentId={student.id} />
            </CardHeader>
            <CardContent className="space-y-4">
              {student.experience.map((exp) => (
                <div key={exp.id}>
                  <ExperienceItem
                    id={exp.id}
                    studentId={student.id}
                    company={exp.company}
                    position={exp.position}
                    startDate={exp.startDate}
                    endDate={exp.endDate}
                    description={exp.description}
                  />
                  <Separator className="my-4" />
                </div>
              ))}

              {student.experience.length === 0 && <p className="text-muted-foreground">No experience listed</p>}
            </CardContent>
          </Card>

          {/* Projects */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Projects</CardTitle>
              <AddProject studentId={student.id} />
            </CardHeader>
            <CardContent className="space-y-6">
              {student.projects.map((project) => (
                <div key={project.id}>
                  <ProjectItem
                    id={project.id}
                    studentId={student.id}
                    name={project.name}
                    description={project.description}
                    githubUrl={project.githubUrl}
                    images={project.images}
                  />
                  <Separator className="my-4" />
                </div>
              ))}

              {student.projects.length === 0 && <p className="text-muted-foreground">No projects listed</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

