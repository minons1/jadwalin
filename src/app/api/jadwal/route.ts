import { Prisma as PrismaType } from "@prisma/client"
import { Prisma } from "../../../lib/prisma"
import { ulid } from "ulid"
import { NextRequest } from "next/server"
import haha from "../../../lib/jokes"

type CreateBody = {
  jadwal: {
    title: string,
    start_date: string,
    end_date: string,
    start_time: string,
    end_time: string
  }
}

export async function POST(req: Request) {
  const body: CreateBody = await req.json()
  const result = await Prisma.jadwal.create({
    data: {
      id: ulid().toLowerCase(),
      title: body.jadwal.title,
      start_date: body.jadwal.start_date,
      end_date: body.jadwal.end_date,
      start_time: body.jadwal.start_time,
      end_time: body.jadwal.end_time,
      timezone: 'Asia/Jakarta'
    }
  })


  const start_date = new Date(body.jadwal.start_date)
  const end_date = new Date(body.jadwal.end_date)
  const start_time = new Date(body.jadwal.start_time)
  const end_time = new Date(body.jadwal.end_time)

  let slot: PrismaType.slotCreateInput[] = []

  for (let i = start_date; i <= end_date; i = new Date(i.setDate(i.getDate() + 1))) {
    for (let j = start_time; j < end_time; j = new Date(j.setMinutes(j.getMinutes() + 30))) {
      slot.push({
        jadwal_id: result.id,
        epoch: new Date(i.setHours(j.getHours(), j.getMinutes())),
        participants_name_array: []
      })
    }
  }

  await Prisma.slot.createMany({
    data: slot
  })
  return Response.json({ jadwal: result }, { status: 201 })
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const idOnly = searchParams.get('id_only') === 'true'

  const auth = req.headers.get('x-api-key')
  if (!auth || auth !== process.env.API_KEY) {
    if (!idOnly) return Response.json({ uhu: haha() })
    return Response.json({ jadwals: []})
  }

  const jadwals = await Prisma.jadwal.findMany({
    orderBy: {
      created_at: 'desc'
    },
    ...idOnly && { select: { id: true }},
    ...!idOnly && { take: 10 }
  })

  return Response.json({ jadwals: jadwals })

}