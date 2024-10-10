import { NextRequest } from 'next/server'
import { Prisma } from "../../../../lib/prisma"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const searchParams = req.nextUrl.searchParams
  const simple = searchParams.get('simple') === 'true'

  const { id } = params
  const jadwal = await Prisma.jadwal.findFirst({
    where: {
      id
    }
  })

  if (simple) {
    return Response.json({
      jadwal
    })
  }

  const slots = await Prisma.slot.findMany({
    where: {
      jadwal_id: id
    }
  })

  const slotsWithParticipants = await Promise.all(slots.map(async slot => {
    return {
      ...slot,
      participants: await Prisma.slot_participant.findMany({
        where: {
          slot_id: slot.id
        },
        select: {
          participant_id: true
        }
      })
    }
  }))

  return Response.json({
    jadwal: {
      ...jadwal,
      slots: slotsWithParticipants
    }
  })
}