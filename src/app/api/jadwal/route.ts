export const runtime = "edge"

import { Prisma as PrismaType } from "@prisma/client"
import { Prisma } from "../../../lib/prisma"
import { ulid } from "ulid"
import { NextRequest } from "next/server"
import haha from "../../../lib/jokes"
import { DateTime } from "luxon"
import { getDateInterval, getTimeInterval } from "../../../util/time"

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

  const timezone = 'Asia/Jakarta'
  const result = await Prisma.jadwal.create({
    data: {
      id: ulid().toLowerCase(),
      title: body.jadwal.title,
      start_date: body.jadwal.start_date,
      end_date: body.jadwal.end_date,
      start_time: body.jadwal.start_time,
      end_time: body.jadwal.end_time,
      timezone: timezone
    }
  })

  const dateInterval = getDateInterval(body.jadwal.start_date, body.jadwal.end_date, timezone)

  const timeInterval = getTimeInterval(body.jadwal.start_time, body.jadwal.end_time)

  let slots: PrismaType.slotCreateManyInput[] = []

  dateInterval.forEach(date => {
    timeInterval.forEach(time => {
      slots.push({
        jadwal_id: result.id,
        epoch: DateTime.fromObject({ year: date.year, month: date.month, day: date.day, hour: time.hour, minute: time.minute }).toISO() as string
      })
    })
  })

  await Prisma.slot.createMany({
    data: slots
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