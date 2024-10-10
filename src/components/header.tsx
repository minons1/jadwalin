'use client'
import { useEffect, useState } from 'react'
import { Container, Group, Burger, Text, Title, Anchor } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import classes from './header.module.css'
import { IconCalendar } from '@tabler/icons-react'
import { usePathname, useRouter } from 'next/navigation'

const links = [
  { link: '/about', label: 'About' }
]

export default function Header() {
  const [opened, { toggle }] = useDisclosure(false)
  const [active, setActive] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setActive(pathname)
  }, [pathname])

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={(event) => {
        event.preventDefault()
        setActive(link.link)
        router.push(link.link)
      }}
    >
      {link.label}
    </a>
  ))

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Group gap={5}>
          <IconCalendar size={28} color="var(--mantine-color-teal-filled)"/>
          <Anchor
            href='/'
            underline='never'
            onClick={(event) => {
              event.preventDefault()
              setActive(null)
              router.push('/')
            }}
          >
            <Title order={2}>
              <Text span inherit variant='gradient' gradient={{ from: 'green', to: 'teal', deg: 90 }}>Jadwal.in</Text>
            </Title>
          </Anchor>
        </Group>

        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  )
}