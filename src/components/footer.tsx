'use client'

import { Container, Group, ActionIcon, rem, Anchor, Title, Text } from '@mantine/core';
import { IconBrandYoutube, IconBrandGithub, IconBrandMedium, IconHeart } from '@tabler/icons-react';
import classes from './footer.module.css';
import { useRouter } from 'next/navigation';

export default function Footer() {
  const router = useRouter()

  return (
    <div className={classes.footer}>
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
          Made by <Anchor href="https://x.com/minons1_" target="_blank" underline='hover'>Salim</Anchor>
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
    <Anchor href={link} target="_blank" underline='never'>
      <ActionIcon size='lg' variant='subtle'>
        {icon}
      </ActionIcon>
    </Anchor>
  )
}