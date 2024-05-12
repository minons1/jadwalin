'use client'

import { Checkbox, CheckboxGroup, Text } from '@mantine/core'
import { useState } from 'react'

export default function Experiment() {
  const [value, setValue] = useState(['2'])

  return <>
    <Text>{JSON.stringify(value)}</Text>
    <Checkbox.Group value={value} onChange={(e) => {
      console.log(e)
      setValue(e)
    }}>
      <Checkbox value='1'>Checkbox 1</Checkbox>
      <Checkbox value='2'>Checkbox 2</Checkbox>
      <Checkbox value='3'>Checkbox 3</Checkbox>
    </Checkbox.Group>
  </>
}