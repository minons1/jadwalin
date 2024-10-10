'use client'

import { Notifications } from '@mantine/notifications'
import Header from './header'
import Footer from './footer'
import { AppShell } from '@mantine/core'

export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      header={{ height: 56 }}
      footer={{ height: 100 }}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Main>
        <Notifications />
        {children}
      </AppShell.Main>
      <AppShell.Footer>
        <Footer />
      </AppShell.Footer>
    </AppShell>
  )
}