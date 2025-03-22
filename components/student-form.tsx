"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CloudinaryUploadWidget } from "@/lib/cloudinary"
import { PlusCircle, Trash2, X, ImageIcon } from "lucide-react"

type Education = {
  institution: string
  degree: string
  fieldOfStudy?: string
  startDate?: string
  endDate?: string
  description?: string
}

type Experience = {
  company: string
  position: string
  startDate?: string
  endDate?: string
  description?: string
}

type Project = {
  name: string
  description?: string
  githubUrl?: string
  images: string[]
}

export default function StudentForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Personal Information
  const [name, setName] = useState("")
  const [profilePictureUrl, setProfilePictureUrl] = useState("")
  const [profession, setProfession] = useState("")
  const [batch, setBatch] = useState("")
  const [about, setAbout] = useState("")

  // Portfolio
  const [education, setEducation] = useState<Education[]>([])
  const [experience, setExperience] = useState<Experience[]>([])
  const [skills, setSkills] = useState<string[]>([])
  const [currentSkill, setCurrentSkill] = useState("")

  // Projects
  const [projects, setProjects] = useState<Project[]>([])

  // Contact Information
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [linkedinUrl, setLinkedinUrl] = useState("")

  // Add empty education field
  const addEducation = () => {
    setEducation([
      ...education,
      {
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ])
  }

  // Update education field
  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updatedEducation = [...education]
    updatedEducation[index] = { ...updatedEducation[index], [field]: value }
    setEducation(updatedEducation)
  }

  // Remove education field
  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index))
  }

  // Add empty experience field
  const addExperience = () => {
    setExperience([
      ...experience,
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ])
  }

  // Update experience field
  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const updatedExperience = [...experience]
    updatedExperience[index] = { ...updatedExperience[index], [field]: value }
    setExperience(updatedExperience)
  }

  // Remove experience field
  const removeExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index))
  }

  // Add skill
  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()])
      setCurrentSkill("")
    }
  }

  // Remove skill
  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill))
  }

  // Add empty project
  const addProject = () => {
    setProjects([
      ...projects,
      {
        name: "",
        description: "",
        githubUrl: "",
        images: [],
      },
    ])
  }

  // Update project field
  const updateProject = (index: number, field: keyof Omit<Project, "images">, value: string) => {
    const updatedProjects = [...projects]
    updatedProjects[index] = { ...updatedProjects[index], [field]: value }
    setProjects(updatedProjects)
  }

  // Add project image
  const addProjectImage = (index: number, url: string) => {
    const updatedProjects = [...projects]
    updatedProjects[index] = {
      ...updatedProjects[index],
      images: [...updatedProjects[index].images, url],
    }
    setProjects(updatedProjects)
  }

  // Remove project image
  const removeProjectImage = (projectIndex: number, imageIndex: number) => {
    const updatedProjects = [...projects]
    updatedProjects[projectIndex].images = updatedProjects[projectIndex].images.filter((_, i) => i !== imageIndex)
    setProjects(updatedProjects)
  }

  // Remove project
  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          profilePictureUrl,
          profession,
          batch,
          about,
          education,
          experience,
          skills,
          projects,
          phoneNumber,
          email,
          linkedinUrl,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/students/${data.id}`)
      } else {
        throw new Error("Failed to create student profile")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Failed to submit form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Student Profile Form</h1>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Enter your basic information to create your profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label>Profile Picture</Label>
                <div className="flex items-center gap-4">
                  {profilePictureUrl ? (
                    <div className="relative w-24 h-24 rounded-full overflow-hidden">
                      <img
                        src={profilePictureUrl || "/placeholder.svg"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setProfilePictureUrl("")}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <CloudinaryUploadWidget onUpload={setProfilePictureUrl}>
                      <Button type="button" variant="outline" className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Upload Photo
                      </Button>
                    </CloudinaryUploadWidget>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profession">Profession</Label>
                <Input id="profession" value={profession} onChange={(e) => setProfession(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="batch">Batch</Label>
                <Input id="batch" value={batch} onChange={(e) => setBatch(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about">About</Label>
                <Textarea id="about" value={about} onChange={(e) => setAbout(e.target.value)} rows={5} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio</CardTitle>
              <CardDescription>Add your education, experience, and skills</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Education Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Education</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addEducation}
                    className="flex items-center gap-1"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Add Education
                  </Button>
                </div>

                {education.map((edu, index) => (
                  <Card key={index} className="p-4 relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEducation(index)}
                      className="absolute top-2 right-2 text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor={`edu-institution-${index}`}>Institution</Label>
                        <Input
                          id={`edu-institution-${index}`}
                          value={edu.institution}
                          onChange={(e) => updateEducation(index, "institution", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`edu-degree-${index}`}>Degree</Label>
                        <Input
                          id={`edu-degree-${index}`}
                          value={edu.degree}
                          onChange={(e) => updateEducation(index, "degree", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`edu-field-${index}`}>Field of Study</Label>
                        <Input
                          id={`edu-field-${index}`}
                          value={edu.fieldOfStudy}
                          onChange={(e) => updateEducation(index, "fieldOfStudy", e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`edu-start-${index}`}>Start Date</Label>
                          <Input
                            id={`edu-start-${index}`}
                            type="date"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`edu-end-${index}`}>End Date</Label>
                          <Input
                            id={`edu-end-${index}`}
                            type="date"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(index, "endDate", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`edu-desc-${index}`}>Description</Label>
                        <Textarea
                          id={`edu-desc-${index}`}
                          value={edu.description}
                          onChange={(e) => updateEducation(index, "description", e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  </Card>
                ))}

                {education.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    No education added yet. Click the button above to add your education.
                  </p>
                )}
              </div>

              {/* Experience Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Experience</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addExperience}
                    className="flex items-center gap-1"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Add Experience
                  </Button>
                </div>

                {experience.map((exp, index) => (
                  <Card key={index} className="p-4 relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeExperience(index)}
                      className="absolute top-2 right-2 text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor={`exp-company-${index}`}>Company</Label>
                        <Input
                          id={`exp-company-${index}`}
                          value={exp.company}
                          onChange={(e) => updateExperience(index, "company", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`exp-position-${index}`}>Position</Label>
                        <Input
                          id={`exp-position-${index}`}
                          value={exp.position}
                          onChange={(e) => updateExperience(index, "position", e.target.value)}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`exp-start-${index}`}>Start Date</Label>
                          <Input
                            id={`exp-start-${index}`}
                            type="date"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`exp-end-${index}`}>End Date</Label>
                          <Input
                            id={`exp-end-${index}`}
                            type="date"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`exp-desc-${index}`}>Description</Label>
                        <Textarea
                          id={`exp-desc-${index}`}
                          value={exp.description}
                          onChange={(e) => updateExperience(index, "description", e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  </Card>
                ))}

                {experience.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    No experience added yet. Click the button above to add your experience.
                  </p>
                )}
              </div>

              {/* Skills Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Skills</h3>

                <div className="flex gap-2">
                  <Input
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    placeholder="Enter a skill"
                  />
                  <Button type="button" onClick={addSkill} className="shrink-0">
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-1"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-secondary-foreground/70 hover:text-secondary-foreground"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {skills.length === 0 && (
                    <p className="text-muted-foreground">No skills added yet. Add your skills above.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Add your projects with images and descriptions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button type="button" variant="outline" onClick={addProject} className="flex items-center gap-1">
                <PlusCircle className="w-4 h-4" />
                Add Project
              </Button>

              {projects.map((project, index) => (
                <Card key={index} className="p-4 relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeProject(index)}
                    className="absolute top-2 right-2 text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>

                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor={`project-name-${index}`}>Project Name</Label>
                      <Input
                        id={`project-name-${index}`}
                        value={project.name}
                        onChange={(e) => updateProject(index, "name", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`project-desc-${index}`}>Description</Label>
                      <Textarea
                        id={`project-desc-${index}`}
                        value={project.description}
                        onChange={(e) => updateProject(index, "description", e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`project-github-${index}`}>GitHub URL</Label>
                      <Input
                        id={`project-github-${index}`}
                        value={project.githubUrl}
                        onChange={(e) => updateProject(index, "githubUrl", e.target.value)}
                        placeholder="https://github.com/username/repo"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Project Images</Label>
                      <div className="flex flex-wrap gap-4">
                        {project.images.map((url, imgIndex) => (
                          <div key={imgIndex} className="relative w-24 h-24 rounded overflow-hidden">
                            <img
                              src={url || "/placeholder.svg"}
                              alt={`Project ${index + 1} image ${imgIndex + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeProjectImage(index, imgIndex)}
                              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}

                        <CloudinaryUploadWidget onUpload={(url) => addProjectImage(index, url)}>
                          <Button
                            type="button"
                            variant="outline"
                            className="h-24 w-24 flex flex-col items-center justify-center gap-1"
                          >
                            <ImageIcon className="w-4 h-4" />
                            <span className="text-xs">Add Image</span>
                          </Button>
                        </CloudinaryUploadWidget>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {projects.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No projects added yet. Click the button above to add your projects.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Add your contact details so others can reach you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input
                  id="linkedin"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Submitting..." : "Submit Profile"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  )
}

