'server-only'

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { MantineProvider } from '@mantine/core'
import type { Metadata } from 'next'
import Main from '../components/main';

export const metadata: Metadata = {
  title: 'Jadwal.in',
  description: 'Find the perfect time every time with Jadwal.in'
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel='icon' href='/favicon.ico' type='image/x-icon' sizes='16x16'></link>
      </head>
      <body>
        <MantineProvider theme={{
          primaryColor: 'teal'
        }}>
          <Main>
            {children}
          </Main>
        </MantineProvider>
      </body>
    </html>
  )
}
