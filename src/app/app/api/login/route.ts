import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function POST(req: Request) {
  const body = await req.json()
  const { email, password } = body

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    return new Response("Invalid email", { status: 400 })
  }

  const passwordValid = await bcrypt.compare(password, user.password)

  if (!passwordValid) {
    return new Response("Invalid password", { status: 400 })
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET as string
  )

  return Response.json({ token })
}