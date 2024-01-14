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

  return Response.json({ jadwal: {
    ...jadwal,
    slots
    }
  })
}