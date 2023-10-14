'use client'
import { Container, Text } from "@mantine/core"
import { jadwal } from "@prisma/client"
import { useEffect, useState } from "react"

export default function Jadwal({ params }: { params: { id: string }}) {
  const [jadwal, setJadwal] = useState<jadwal | null>(null)
  useEffect(() => {
    if (!params.id) return
    fetch(`/api/jadwal/${params.id}`).then((res) => res.json()).then((res) => {
      setJadwal(res.jadwal)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container size='md'>
      {jadwal?.title && <Text>{JSON.stringify(jadwal)}</Text>}
    </Container>
  )
}