import { Prisma } from '../../../../lib/prisma'

type Body = {
  slot: {
    slot_id: string,
    participant_id: string
  }
}

export async function POST(req: Request) {
  const body: Body = await req.json()

  await Prisma.slot_participant.create({
    data: {
      slot_id: body.slot.slot_id,
      participant_id: body.slot.participant_id
    }
  })

  return Response.json({ message: 'Success' })
}

export async function DELETE(req: Request) {
  const body: Body = await req.json()

  await Prisma.slot_participant.delete({
    where: {
      slot_id_participant_id: {
        slot_id: body.slot.slot_id,
        participant_id: body.slot.participant_id
      }
    }
  })

  return Response.json({ message: 'Success' })
}