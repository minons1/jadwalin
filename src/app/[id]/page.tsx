'use client'
import { Button, Checkbox, Code, Container, Flex, Grid, PasswordInput, Table, Text, TextInput, Title } from '@mantine/core'
import { jadwal, participant, slot } from '@prisma/client'
import { ChangeEvent, useEffect, useState } from 'react'
import { getDateInterval, getTimeInterval } from '../../util/time'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'

type JadwalType = Omit<jadwal, 'start_date' | 'end_date' | 'start_time' | 'end_time'> & {
  // notes: prisma return type is Date, but it actually string because api return it as string
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  slots: (Omit<slot, 'epoch'> & {
    epoch: string,
    participants: {
      participant_id: string
    }[]
  })[]
}

type ParticipantForm = {
  name: string,
  password: string
}

type ParticipantType = Pick<participant, 'id' | 'name'>

export default function Jadwal({ params }: { params: { id: string } }) {
  const [jadwal, setJadwal] = useState<JadwalType | null>(null)
  const [slotMap, setSlotMap] = useState<Record<string, { id: string, participants: string[] }>>({})
  const [isLoading, setLoading] = useState(false)
  const [participant, setParticipant] = useState<ParticipantType | null>(null)
  const [participants, setParticipants] = useState<ParticipantType[]>([])
  const [loadingCheckboxesSet, setLoadingCheckboxesSet] = useState<Record<string, boolean>>({})

  const form = useForm<ParticipantForm>({
    initialValues: {
      name: '',
      password: ''
    }
  })

  const handleSubmitParticipant = async (values: ParticipantForm) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/jadwal/${params.id}/participant`, {
        method: 'POST',
        body: JSON.stringify({
          participant: {
            name: values.name.toLowerCase(),
            password: values.password
          }
        })
      })

      const resBody = await res.json()

      if (res.status >= 400) {
        notifications.show({
          title: 'Error',
          message: resBody.message,
          color: 'red'
        })
      }

      setParticipant(resBody.participant)
    } catch (err) { } finally {
      setLoading(false)
    }
  }

  const handleCheckboxChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!participant) return

    const epoch = e.target.value
    const slot = slotMap[epoch]

    if (!slot) return
    setLoadingCheckboxesSet(prev => ({ ...prev, [epoch]: true }))


    if (e.target.checked) {
      const res = await fetch('/api/jadwal/slot', {
        method: 'POST',
        body: JSON.stringify({
          slot: {
            slot_id: slot.id,
            participant_id: participant.id
          }
        })
      })

      if (res.status <= 299) {
        slot.participants.push(participant.id)
      }
    } else {
      const res = await fetch('/api/jadwal/slot', {
        method: 'DELETE',
        body: JSON.stringify({
          slot: {
            slot_id: slot.id,
            participant_id: participant.id
          }
        })
      })
      if (res.status <= 299) {
        slot.participants = slot.participants.filter(par => par !== participant.id)
      }
    }
    setSlotMap(prev => ({ ...prev, [epoch]: slot }))
    setLoadingCheckboxesSet(prev => ({ ...prev, [epoch]: false }))
  }

  useEffect(() => {
    if (!params.id) return

    const fetchJadwal = async () => {
      const res = await fetch(`/api/jadwal/${params.id}`)
      if (res.status >= 400) {
        notifications.show({
          title: 'Error',
          message: 'Jadwal not found',
          color: 'red'
        })
        return
      }

      const resBody = await res.json() as { jadwal: JadwalType}
      setJadwal(resBody.jadwal)

      console.log(resBody.jadwal)

      const participantRes = await fetch(`/api/jadwal/${params.id}/participants`)
      if (participantRes.status >= 400) return

      const participantResBody = await participantRes.json() as { participants: ParticipantType[] }
      setParticipants(participantResBody.participants)

      for (const slot of resBody.jadwal.slots) {
        slotMap[slot.epoch] = {
          id: slot.id,
          participants: slot.participants.map(par => par.participant_id)
        }
      }
    }

    fetchJadwal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container size='lg'>
      {jadwal &&
        <>
          <Flex mt='md' justify='center' align='center' direction='column'>
            <Title>{jadwal.title}</Title>
            {participant && <Text>Hello, {participant.name}, here&apos;s your availability</Text>}
            {participants && <Text>
              All participants: {participants.map(par => <Code color='teal.5' c='white' key={par.id}>{par.name}</Code>)}
            </Text>}
          </Flex>
          <Grid mt='md' align='center'>
            <Grid.Col span={{ base: 12, md: 6 }}>
            {participant ? <>
              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>↓ Time / Date →</Table.Th>
                    {getDateInterval(jadwal.start_date, jadwal.end_date, jadwal.timezone).map((date) => {
                      return date && <Table.Th key={date.toISO()}>
                          {date.toFormat('ccc d MMM')}
                        </Table.Th>
                    })}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {getTimeInterval(jadwal.start_time, jadwal.end_time).map((time) => {
                      return time && <Table.Tr key={time.toISO()}>
                        <Table.Td>{time.toString().slice(-13, -8)}</Table.Td>
                        {getDateInterval(jadwal.start_date, jadwal.end_date, jadwal.timezone).map((date) => {
                          return date && <Table.Td key={date.set({ hour: time.hour, minute: time.minute, second: time.second }).toUTC().toISO()}>
                              <Checkbox
                                value={date.set({ hour: time.hour, minute: time.minute, second: time.second }).toUTC().toISO() as string}
                                checked={slotMap[date.set({ hour: time.hour, minute: time.minute, second: time.second }).toUTC().toISO() as string]?.participants.includes(participant.id)}
                                onChange={handleCheckboxChange}
                                disabled={loadingCheckboxesSet[date.set({ hour: time.hour, minute: time.minute, second: time.second }).toUTC().toISO() as string]}
                              />
                            </Table.Td>
                        })}
                      </Table.Tr>
                    }
                  )}
                </Table.Tbody>
              </Table>
            </> : <>
              <Text fw={700}>Participate</Text>
              <form onSubmit={form.onSubmit(handleSubmitParticipant)}>
                <TextInput
                  size='sm'
                  mt='md'
                  placeholder='name'
                  w='50%'
                  {...form.getInputProps('name')}
                />
                <PasswordInput
                  size='sm'
                  mt='md'
                  placeholder='password (optional)'
                  w='50%'
                  {...form.getInputProps('password')}
                />
                <Button
                  loading={isLoading}
                  size='sm'
                  mt='md'
                  type='submit'
                >Sign In</Button>
              </form>
            </>}
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              This will show current participant
            </Grid.Col>
          </Grid>
        </>
      }
    </Container>
  )
}
