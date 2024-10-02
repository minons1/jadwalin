export const runtime = "edge"

import { Prisma } from "../../../../../lib/prisma"
import bcrypt from 'bcryptjs'

type CreateParticipantBody = {
  participant: {
    name: string,
    password: string
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const body: CreateParticipantBody = await req.json()

  const jadwal = await Prisma.jadwal.findUnique({
    where: {
      id
    }
  })

  if (!jadwal) {
    return Response.json({ message: 'Jadwal not found' }, { status: 404 })
  }

  let participant = await Prisma.participant.findFirst({
    where: {
      jadwal_id: id,
      name: body.participant.name
    }
  })

  let hashedPassword: string | undefined
  if (body.participant.password) {
    hashedPassword = await bcrypt.hash(body.participant.password, 10)
  }

  if (participant) {
    if (participant.password) {
      const valid = await bcrypt.compare(body.participant.password, participant.password)
      if (!valid) {
        return Response.json({ message: 'Wrong password' }, { status: 401 })
      }
    } else {
      if (body.participant.password) {
        participant = await Prisma.participant.update({
          where: {
            id: participant.id,
          },
          data: {
            password: hashedPassword
          }
        })
      }
    }

    return Response.json({ participant: {
      id: participant.id,
      name: participant.name
    } }, { status: 200 })
  }

  participant = await Prisma.participant.create({
    data: {
      jadwal_id: id,
      name: body.participant.name,
      password: hashedPassword
    }
  })

  return Response.json({ participant: {
    id: participant.id,
    name: participant.name
  } }, { status: 201 })
}