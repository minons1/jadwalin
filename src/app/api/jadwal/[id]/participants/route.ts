export const runtime = "edge"

import { Prisma } from '../../../../../lib/prisma'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params

  const jadwal = await Prisma.jadwal.findUnique({
    where: {
      id
    }
  })

  if (!jadwal) {
    return Response.json({ message: 'Jadwal not found' }, { status: 404 })
  }

  const participants = await Prisma.participant.findMany({
    where: {
      jadwal_id: id
    },
    select: {
      id: true,
      name: true
    }
  })

  return Response.json({ participants })
}