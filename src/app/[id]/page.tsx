'use client'

import { Button, Checkbox, Code, Container, Flex, Grid, PasswordInput, Pill, Table, Text, TextInput, Title, Tooltip } from '@mantine/core'
import { jadwal, participant, slot } from '@prisma/client'
import { ChangeEvent, forwardRef, useEffect, useState } from 'react'
import { getDateInterval, getTimeInterval } from '../../util/time'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconCopy, IconShare3 } from '@tabler/icons-react'
import { DateTime } from 'luxon'

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
        throw new Error(resBody.message)
      }

      setParticipant(resBody.participant)
      setParticipants(prev => {
        const exists = prev.find(p => p.id === resBody.participant.id)
        if (exists) return prev

        return [...prev, { id: resBody.participant.id, name: resBody.participant.name }]
      })
    } catch (err) {
      if (err instanceof Error) {
        notifications.show({
          title: 'Error',
          message: err.message,
          color: 'red'
        })
      }
    } finally {
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

  const handleClickShareButton = async () => {
    if (!jadwal) {
      return
    }

    navigator.clipboard.writeText(`📅  "${jadwal.title}"
${DateTime.fromISO(jadwal.start_date, { zone: jadwal.timezone }).toFormat('LLLL d yyyy')} - ${DateTime.fromISO(jadwal.end_date, { zone: jadwal.timezone }).toFormat('LLLL d yyyy')}
Help us find the best time! Share your availability via Jadwalin
${process.env.BASE_URL}/${jadwal.id}`)

    notifications.show({
      title: 'Copied',
      message: 'Share this to your teammates',
      color: 'teal',
      icon: <IconCopy size={16} />
    })
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

      setSlotMap(prev => ({ ...prev, ...slotMap }))
    }

    fetchJadwal()
      .then(() => { })
      .catch(console.error)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container size='xl'>
      {jadwal &&
        <>
          <Flex mt='md' justify='center' align='center' direction='column'>
            <Title>{jadwal.title}</Title>
            {participant && <Text>Hello, {participant.name}, here&apos;s the availability</Text>}
            {participants && <Text>
              All participants: {participants.map(par => <Code color='teal.5' c='white' key={par.id}>{par.name}</Code>)}
            </Text>}
            <Button mt='sm' size='compact-sm' variant='subtle' onClick={handleClickShareButton}><IconShare3 size={14}/>&nbsp;Share</Button>
          </Flex>
          <Grid mt='md' align='flex-start'>
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
              <Table withColumnBorders>
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
                          const epoch = date.set({ hour: time.hour, minute: time.minute, second: time.second }).toUTC().toISO() as string
                          const participantsEpoch = slotMap[epoch]?.participants || []
                          const participantCounts = participantsEpoch.length
                          const opacity = participantCounts / participants.length
                          return date && participantCounts > 0 ?
                            <Tooltip label={participantsEpoch.map(par => participants.find(p => p.id === par)?.name).join(', ')}>
                              <TableDataComponent epoch={epoch} opacity={opacity} />
                            </Tooltip> :
                            <TableDataComponent epoch={epoch} opacity={opacity} />
                        })}
                      </Table.Tr>
                    }
                  )}
                </Table.Tbody>
                <Table.Caption>Darker color show higher availability</Table.Caption>
              </Table>
              {/* {JSON.stringify(slotMap)} */}
            </Grid.Col>
          </Grid>
        </>
      }
    </Container>
  )
}

const TableDataComponent = forwardRef<HTMLTableCellElement, { epoch: string, opacity: number}>(({ epoch, opacity }, ref) => (
  <Table.Td
      key={epoch}
      align='center'
      ref={ref}
    >
      <Pill
        size='sm'
        bg={`rgba(59, 223, 112, ${opacity})`}
      >&nbsp;&nbsp;&nbsp;</Pill>
    </Table.Td>
))

TableDataComponent.displayName = 'TableDataComponent'
