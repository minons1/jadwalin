'use client'
import { ActionIcon, Button, Combobox, Container, Flex, Grid, Group, Input, Paper, Text, TextInput, Title, rem, useCombobox } from "@mantine/core";
import { DatePicker, DatePickerInput, DateTimePicker, DatesRangeValue, TimeInput } from "@mantine/dates";
import '@mantine/dates/styles.css';
import { useForm } from "@mantine/form";
import { IconArrowsSplit, IconClock } from "@tabler/icons-react";
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

  const timeOption = timeOptions().map(item => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ))

  const comboboxStartTime = useCombobox()
  const comboboxEndTime = useCombobox()

  const onDateChange = (dates: DatesRangeValue) => {
    setValue(dates)
    if (dates[0])
    form.setFieldValue('startDate', dates[0])
    if (dates[1])
    form.setFieldValue('endDate', dates[1])
  }

  return (
    <Container size="sm" mt='md'>
      <Group justify="center">
        <Title order={2}>Easily schedule events with <Text span inherit variant='gradient' gradient={{ from: 'green', to: 'teal', deg: 90 }}>Jadwal.in</Text></Title>
      </Group>
      <Paper shadow="xs" px='xl' pb='xl' mt='md'>
        <form>
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
                <DatePicker
                  type='range'
                  value={value}
                  onChange={setValue}
                  allowSingleDateInRange
                />
              </Flex>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Flex justify='center' direction='column' align='center'>
                <Combobox
                  store={comboboxStartTime}
                  onOptionSubmit={(value) => form.setFieldValue('startTime', value)}
                >
                  <Combobox.Target>
                    <TimeInput
                      description="Not early than"
                      w='50%'
                      rightSection={<Combobox.Chevron />}
                      onClick={() => comboboxStartTime.toggleDropdown()}
                      leftSection={<IconClock size={18} />}
                      {...form.getInputProps('startTime')}
                    />
                  </Combobox.Target>
                  <Combobox.Dropdown>
                    <Combobox.Options>{timeOption}</Combobox.Options>
                  </Combobox.Dropdown>
                </Combobox>

                <Combobox
                  store={comboboxEndTime}
                  onOptionSubmit={(value) => form.setFieldValue('endTime', value)}
                >
                  <Combobox.Target>
                    <TimeInput
                      description="Not later than"
                      mt='md'
                      w='50%'
                      onClick={() => comboboxEndTime.toggleDropdown()}
                      rightSection={<Combobox.Chevron />}
                      leftSection={<IconClock size={18} />}
                      {...form.getInputProps('endTime')}
                    />
                  </Combobox.Target>
                  <Combobox.Dropdown>
                    <Combobox.Options>{timeOption}</Combobox.Options>
                  </Combobox.Dropdown>
                </Combobox>
                
                
              </Flex>
              
            </Grid.Col>
          </Grid>
        </form>
      </Paper>
      
    </Container>
  )
}
