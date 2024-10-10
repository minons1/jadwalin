'use client'

import { Container, Group, ActionIcon, rem, Anchor, Title, Text, Flex } from '@mantine/core';
import { IconBrandYoutube, IconBrandGithub, IconBrandMedium, IconHeart } from '@tabler/icons-react';
import classes from './footer.module.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type AutoBacklinks = { url: string, label: string }[]
type WindowWithBacklinks = Window & typeof globalThis & { onBacklinksLoaded: (data: AutoBacklinks) => void, Backlinks: AutoBacklinks }


export default function Footer() {
  const [backlinks, setBacklinks] = useState<{ url: string, label: string }[]>([])
  const router = useRouter()

  useEffect(() => {
    (window as WindowWithBacklinks).onBacklinksLoaded = (data: { url: string, label: string }[]) => {
      setBacklinks(data)
    }
    const timer = setTimeout(() => {
      // fallback to global backlinks
      if ((window as WindowWithBacklinks).Backlinks?.length) {
        setBacklinks(links => links?.length ? links : (window as any).Backlinks)
      }
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const Groups = () => {
    const links = backlinks.map((link, index) => (
      <>
        <Anchor
          rel='noopener noreferrer'
          key={index}
          target='_blank'
          c='blue'
          href={link.url}
        >
          {link.label}
        </Anchor>
        {index !== backlinks.length - 1 && ' | '}
      </>
    ));

    return (
      <div className={classes.wrapper}>
        <Title order={4}>Awesome Products</Title>
        {links}
      </div>
    );
  };

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <div className={classes.groups}>
          <Groups />
        </div>
      </Container>
      <Container className={classes.inner}>
        <Anchor
          href='/'
          underline='never'
          onClick={(event) => {
            event.preventDefault()
            router.push('/')
          }}
        >
          <Title order={4}>
            <Text span inherit variant='gradient' gradient={{ from: 'green', to: 'teal', deg: 90 }}>Jadwal.in</Text>
          </Title>
        </Anchor>
        <Text c='dimmed'>
          Made by <Anchor href="https://x.com/minons1_" target="_blank" rel='noopener noreferrer' underline='hover'>Salim</Anchor>
          <Anchor target='_blank' href='https://t.me/minonz1?text=Hi 👋🏽, loving jadwal.in'>
            <ActionIcon variant='subtle' size='md'><IconHeart size={14} /></ActionIcon>
          </Anchor>
        </Text>
        <Group gap={0} className={classes.links} align='center' wrap="nowrap">
          <TheBrandIcon icon={<IconBrandGithub style={{ width: rem(18), height: rem(18) }} stroke={1.5} />} link="https://github.com/minons1" />
          <TheBrandIcon icon={<IconBrandYoutube style={{ width: rem(18), height: rem(18) }} stroke={1.5} />} link="https://youtube.com/@ngodingrandom" />
          <TheBrandIcon icon={<IconBrandMedium style={{ width: rem(18), height: rem(18) }} stroke={1.5} />} link="https://medium.com/@salimbinusman" />
        </Group>
      </Container>
    </div>
  );
}

function TheBrandIcon({ icon, link }: { icon: React.ReactNode, link: string }) {
  return (
    <Anchor href={link} target="_blank" underline='never' rel='noopener noreferrer'>
      <ActionIcon size='lg' variant='subtle'>
        {icon}
      </ActionIcon>
    </Anchor>
  )
}