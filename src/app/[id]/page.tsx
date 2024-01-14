"use client"
import { Button, Checkbox, Container, Flex, Grid, PasswordInput, Table, Text, TextInput, Title } from "@mantine/core"
import { jadwal, slot } from "@prisma/client"
import { useEffect, useState } from "react"
import { getDateInterval, getTimeInterval } from "../../util/time"
import { useForm } from "@mantine/form"

type JadwalType = Omit<
  jadwal,
  "start_date" | "end_date" | "start_time" | "end_time"
> & {
  // notes: prisma return type is Date, but it actually string
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  slots: (Omit<slot, "epoch"> & {
    epoch: string
    participants_name_array: string[]
  })[]
}

type ParticipantForm = {
  name: string,
  password: string
}

export default function Jadwal({ params }: { params: { id: string } }) {
  const [jadwal, setJadwal] = useState<JadwalType | null>(null)
  const [slotMap] = useState<Map<string, { id: string, participants_name_array: string[] }>>(new Map())
  const [participant, setParticipant] = useState<ParticipantForm>({ name: '', password: ''})

  const form = useForm<ParticipantForm>({
    initialValues: {
      name: '',
      password: ''
    }
  })

  const handleSubmitParticipant = async (values: ParticipantForm) => {
    setParticipant(values)
  }

  useEffect(() => {
    if (!params.id) return
    fetch(`/api/jadwal/${params.id}`)
      .then((res) => res.json())
      .then((res: { jadwal: JadwalType }) => {
        setJadwal(res.jadwal)

        for (const slot of res.jadwal.slots) {
          slotMap.set(slot.epoch, {
            id: slot.id,
            participants_name_array: slot.participants_name_array,
          })
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container size="lg">
      {jadwal && (
        <>
          <Flex mt='md' justify="center" align="center" direction="column">
            <Title>{jadwal.title}</Title>
            <Text>{JSON.stringify(participant)}</Text>

          </Flex>
          <Grid mt='md' align='center'>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <form onSubmit={form.onSubmit(handleSubmitParticipant)}>
                <TextInput
                  size='sm'
                  mt='md'
                  placeholder='Name'
                  w='50%'
                  {...form.getInputProps('name')}
                />
                <PasswordInput
                  size='sm'
                  mt='md'
                  placeholder='Password'
                  w='50%'
                  {...form.getInputProps('password')}
                />
                <Button
                  size='sm'
                  mt='md'
                  type='submit'
                >Submit</Button>
              </form>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Time / Date</Table.Th>
                    {getDateInterval(
                      jadwal.start_date,
                      jadwal.end_date,
                      jadwal.timezone
                    ).map((date) => {
                      return (
                        date && (
                          <Table.Th key={date.toISO()}>
                            {date.toFormat("ccc d MMM ")}
                          </Table.Th>
                        )
                      )
                    })}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {getTimeInterval(jadwal.start_time, jadwal.end_time).map(
                    (time) => {
                      return (
                        time && (
                          <Table.Tr key={time.toISO()}>
                            <Table.Td>{time.toString().slice(-13, -8)}</Table.Td>
                            {getDateInterval(
                              jadwal.start_date,
                              jadwal.end_date,
                              jadwal.timezone
                            ).map((date) => {
                              return (
                                date && (
                                  <Table.Td key={`${date.toISO()}${time.toISO()}`}>
                                    <Checkbox
                                      value={
                                        slotMap.get(
                                          date
                                            .set({
                                              hour: time.hour,
                                              minute: time.minute,
                                              second: time.second,
                                            })
                                            .toUTC()
                                            .toISO() as string
                                        )?.id
                                      }
                                      onChange={(e) => {
                                        if (e.currentTarget.checked) {
                                        }
                                      }}
                                    />
                                  </Table.Td>
                                )
                              )
                            })}
                          </Table.Tr>
                        )
                      )
                    }
                  )}
                </Table.Tbody>
              </Table>
            </Grid.Col>
          </Grid>
        </>
      )}
    </Container>
  )
}
