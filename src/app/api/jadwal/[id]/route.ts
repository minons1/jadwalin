import { Prisma } from "../../../../lib/prisma"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const jadwal = await Prisma.jadwal.findFirst({
    where: {
      id
    }
  })

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



  return Response.json({ jadwal: {
    ...jadwal,
    slots: slotsWithParticipants
  } })
}