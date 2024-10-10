import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About - Jadwal.in',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>{children}</>
  )
}