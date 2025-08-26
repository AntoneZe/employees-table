import { Container, Title, Paper } from '@mantine/core'
import type { PropsWithChildren } from 'react'

export function Page({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <Container fluid px="lg" py="md">
      <Title order={2} mb="md">{title}</Title>
      <Paper p="md" radius="lg" withBorder>
        {children}
      </Paper>
    </Container>
  )
}