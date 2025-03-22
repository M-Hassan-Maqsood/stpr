import { z } from "zod"

// Student validation schema
export const studentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  profilePictureUrl: z.string().optional().nullable(),
  profession: z.string().optional().nullable(),
  batch: z.string().optional().nullable(),
  about: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  email: z.string().email("Invalid email address"),
  linkedinUrl: z.string().optional().nullable(),
})

// Education validation schema
export const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
})

// Experience validation schema
export const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
})

// Skill validation schema
export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
})

// Project validation schema
export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional().nullable(),
  githubUrl: z.string().optional().nullable(),
  images: z.array(z.string()).optional().default([]),
})

// Project image validation schema
export const projectImageSchema = z.object({
  imageUrl: z.string().min(1, "Image URL is required"),
})

