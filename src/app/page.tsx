'use client'
import { Button, Container, Flex, Grid, Group, Paper, Select, Text, TextInput, Title } from "@mantine/core";
import { DatePicker, DatePickerInput, DatesRangeValue } from "@mantine/dates";
import '@mantine/dates/styles.css';
import { useForm } from "@mantine/form";
import { IconClock } from "@tabler/icons-react";
import { useState } from "react";
import { timeOptions } from "../util/time";

type Form = {
  title: string,
  startDate: Date,
  endDate: Date,
  startTime: string,
  endTime: string
}

export default function Home() {
  const [value, setValue] = useState<DatesRangeValue | undefined>([new Date(), new Date()]);
  const form = useForm<Form>({
    initialValues: {
      title: '',
      startDate: new Date(),
      endDate: new Date(),
      startTime: '09:00',
      endTime: '17:00'
    }
  })

  const onDateChange = (dates: DatesRangeValue) => {
    setValue(dates)
    if (dates[0]) {
      form.setFieldValue('startDate', dates[0])
      form.setFieldValue('endDate', dates[0])
    }

    if (dates[1]) {
      form.setFieldValue('endDate', dates[1])
    }
  }

  const handleSubmit = async (values: Form) => {
    const [startTimeHour, startTimeMinute] = values.startTime.split(':')
    const [endTimeHour, endTimeMinute] = values.endTime.split(':')

    const res = await fetch('/api/jadwal', {
      body: JSON.stringify({
        jadwal: {
          title: values.title,
          start_date: values.startDate,
          end_date: values.endDate,
          start_time: new Date(Date.UTC(1970, 0, 0, parseInt(startTimeHour), parseInt(startTimeMinute))),
          end_time: new Date(Date.UTC(1970, 0, 0, parseInt(endTimeHour), parseInt(endTimeMinute)))
        }
      }),
      method: 'POST'
    })

    console.debug(await res.json())

    form.reset()
  }

  return (
    <Container size="sm" mt='md'>
      <Group justify="center">
        <Title order={2}>Easily schedule events with <Text span inherit variant='gradient' gradient={{ from: 'green', to: 'teal', deg: 90 }}>Jadwal.in</Text></Title>
      </Group>
      <Paper shadow="xs" px='xl' pb='xl' mt='md'>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Flex justify="center" direction='column' align='center' gap='sm'>
            <TextInput
              size='lg'
              mt='md'
              placeholder="Event Title"
              w='50%'
              {...form.getInputProps('title')}
            />
          </Flex>
          <Grid mt='md' align="center">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Flex justify='center' direction='column' align='center'>
                <Text c='dimmed' size="xs">Date of the event</Text>
                <DatePickerInput
                  type="range"
                  disabled
                  value={value}
                />
                <DatePicker
                  mt='xs'
                  type='range'
                  value={value}
                  onChange={onDateChange}
                  allowSingleDateInRange
                />
              </Flex>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Flex justify='center' direction='column' align='center'>
                <Select
                  description='Not earlier than'
                  placeholder="-- : --"
                  leftSection={<IconClock size={18} />}
                  maxDropdownHeight={200}
                  data={timeOptions()}
                  {...form.getInputProps('startTime')}
                />

                <Select
                  mt='md'
                  description='Not later than'
                  placeholder="-- : --"
                  leftSection={<IconClock size={18} />}
                  maxDropdownHeight={200}
                  data={timeOptions()}
                  {...form.getInputProps('endTime')}
                />

              </Flex>
            </Grid.Col>
          </Grid>
          <Group mt='md' justify='center'>
            <Button type="submit">
              Schedule
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  )
}
