import { jadwal } from "@prisma/client"
import { Prisma } from "../../../lib/prisma"
import { ulid } from "ulid"
import { NextRequest } from "next/server"
import haha from "../../../lib/jokes"

type CreateBody = { 
  jadwal: Pick<jadwal, 'title' | 'start_date' | 'end_date' | 'start_time' | 'end_time'>
}

export async function POST(req: Request) {
  const body: CreateBody = await req.json()
  const result = await Prisma.jadwal.create({
    data: {
      id: ulid(),
      title: body.jadwal.title,
      start_date: body.jadwal.start_date,
      end_date: body.jadwal.end_date,
      start_time: body.jadwal.start_time,
      end_time: body.jadwal.end_time,
      timezone: 'Asia/Jakarta'
    }
  })
  return Response.json({ jadwal: result }, { status: 201 })
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('x-api-key')
  if (!auth || auth !== process.env.API_KEY) {
    return Response.json({ uhu: haha() })
  }

  const jadwals = await Prisma.jadwal.findMany({
    orderBy: {
      created_at: 'desc'
    },
    take: 10
  })

  return Response.json({ jadwals: jadwals })

}