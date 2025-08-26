import { useDebouncedValue } from '@mantine/hooks'
import { useMemo, useState } from 'react'

export function useServerState() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [q, setQ] = useState('')
  const [qDebounced] = useDebouncedValue(q, 300)
  const [sortBy, setSortBy] = useState<string>()
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [filters, setFilters] = useState<Record<string, string>>({})

  const params = useMemo(() => {
    const usp = new URLSearchParams()
    usp.set('page', String(page))
    usp.set('pageSize', String(pageSize))
    if (qDebounced) usp.set('q', qDebounced)
    if (sortBy) {
      usp.set('sortBy', sortBy)
      usp.set('sortDir', sortDir)
    }
    for (const [k, v] of Object.entries(filters)) {
      if (v) usp.set(`filter.${k}`, v)
    }
    return usp
  }, [page, pageSize, qDebounced, sortBy, sortDir, filters])

  return {
    page, setPage,
    pageSize, setPageSize,
    q, setQ,
    sortBy, setSortBy,
    sortDir, setSortDir,
    filters, setFilters,
    params,
  }
}