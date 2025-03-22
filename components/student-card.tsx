import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type StudentCardProps = {
  id: number
  name: string
  profilePictureUrl?: string | null
  profession?: string | null
  batch?: string | null
  skills: { name: string }[]
}

export default function StudentCard({ id, name, profilePictureUrl, profession, batch, skills }: StudentCardProps) {
  // Get initials for avatar fallback
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={profilePictureUrl || ""} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <h3 className="text-xl font-bold">{name}</h3>

          {profession && <p className="text-muted-foreground mt-1">{profession}</p>}

          {batch && (
            <Badge variant="outline" className="mt-2">
              {batch}
            </Badge>
          )}

          <div className="flex flex-wrap gap-1 justify-center mt-4">
            {skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill.name}
              </Badge>
            ))}
            {skills.length > 3 && <Badge variant="secondary">+{skills.length - 3}</Badge>}
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/50 p-4">
        <Button asChild className="w-full">
          <Link href={`/students/${id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

