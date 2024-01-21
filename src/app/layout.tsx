'server-only'
// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { MantineProvider } from '@mantine/core'
import type { Metadata } from 'next'
import Header from '../components/header'
import { Notifications } from '@mantine/notifications';

export const metadata: Metadata = {
  title: 'Jadwal.in',
  description: 'Decide your team schedule easily with Jadwal.in'
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      </head>
      <body>
        <MantineProvider theme={{
          primaryColor: 'teal'
        }}>
          <Header />
          <Notifications />
          {children}
        </MantineProvider>
      </body>
    </html>
  )
}
