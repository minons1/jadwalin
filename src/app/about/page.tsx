'use client'
import { Container, Text, Button, Group } from '@mantine/core'
import { GithubIcon } from '@mantinex/dev-icons'
import classes from './page.module.css'
import { useRouter } from 'next/navigation'

export default function About() {
  const router = useRouter()
  return (
    <div className={classes.wrapper}>
      <Container size={700} className={classes.inner}>
        <h1 className={classes.title}>
          Find the{' '}
          <Text component="span" variant="gradient" gradient={{ from: 'green', to: 'cyan' }} inherit>
            perfect time
          </Text>{' '}
          every time with Jadwal.in
        </h1>

        <Text className={classes.description} c="dimmed">
          Take full control and stress-free on setting up your group activities. Built with collaboration in mind
          just click-click, share and let others know everyone&apos;s schedule.
        </Text>

        <Group className={classes.controls}>
          <Button
            size="xl"
            className={classes.control}
            variant="gradient"
            gradient={{ from: 'green', to: 'cyan' }}
            onClick={() => router.push('/')}
          >
            Get started
          </Button>

          <Button
            component="a"
            href="https://github.com/minons1/jadwalin"
            size="xl"
            variant="default"
            className={classes.control}
            leftSection={<GithubIcon size={20} />}
          >
            GitHub
          </Button>
        </Group>
      </Container>
    </div>
  )
}