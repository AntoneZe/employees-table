import { MantineProvider, ColorSchemeScript } from '@mantine/core'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@shared/api/client'
import { theme } from './theme'
import type { PropsWithChildren } from 'react'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="dark" />
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </MantineProvider>
    </>
  )
}