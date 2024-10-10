import { Metadata } from 'next'

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const jadwal = await fetch(`${process.env.BASE_URL}/api/jadwal/${params.id}?simple=true`)

  const resBody = await jadwal.json()

  return {
    title: resBody?.jadwal?.title ? `${resBody.jadwal.title} - Jadwal.in` : 'Jadwal.in'
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>{children}</>
  )
}