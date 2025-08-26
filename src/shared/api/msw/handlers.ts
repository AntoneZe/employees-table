// handlers.ts
import { http, HttpResponse } from 'msw'
import { DB } from '../faker'
import type { Employee, Paged } from '../types'
import { faker } from '@faker-js/faker'

function str(v: unknown) {
  return (v ?? '').toString()
}

function applySearch(items: Employee[], q?: string) {
  if (!q) return items
  const s = q.toLowerCase()
  return items.filter(e =>
    [
      e.firstName, e.lastName, e.email, e.role,
      e.department, e.city, e.country,
    ]
      .map(str)
      .some(x => x.toLowerCase().includes(s)),
  )
}

function applyFilters(items: Employee[], filters?: Record<string, string>) {
  if (!filters) return items
  let res = items
  for (const [key, value] of Object.entries(filters)) {
    if (!value) continue
    const v = value.toLowerCase()
    res = res.filter((i: any) => str(i[key]).toLowerCase() === v)
  }
  return res
}

function cmp(a: unknown, b: unknown) {
  if (typeof a === 'number' && typeof b === 'number') return a - b
  const as = str(a), bs = str(b)
  return as.localeCompare(bs, undefined, { numeric: true, sensitivity: 'base' })
}

function applySort<T extends Record<string, any>>(
  items: T[],
  sortBy?: string,
  sortDir: 'asc' | 'desc' = 'asc',
) {
  if (!sortBy) return items
  const dir = sortDir === 'desc' ? -1 : 1
  return [...items].sort((a, b) => dir * cmp(a[sortBy], b[sortBy]))
}

export const handlers = [
  http.get('/api/employees', ({ request }) => {
    const url = new URL(request.url)
    const page = Math.max(1, Number(url.searchParams.get('page') ?? 1))
    const pageSize = Math.max(1, Number(url.searchParams.get('pageSize') ?? 20))
    const q = url.searchParams.get('q') ?? undefined
    const sortBy = url.searchParams.get('sortBy') ?? undefined
    const sortDir = (url.searchParams.get('sortDir') ?? 'asc') as 'asc' | 'desc'

    const filters: Record<string, string> = {}
    url.searchParams.forEach((v, k) => {
      if (k.startsWith('filter.')) {
        filters[k.replace('filter.', '')] = v
      }
    })

    let rows = DB
    rows = applySearch(rows, q)
    rows = applyFilters(rows, filters)
    rows = applySort(rows, sortBy, sortDir)

    const total = rows.length
    const start = (page - 1) * pageSize
    const items = rows.slice(start, start + pageSize)

    const body: Paged<Employee> = { items, page, pageSize, total }
    return HttpResponse.json(body)
  }),

  http.get('/api/employees/:id/reports', ({ params }) => {
    const { id } = params as { id: string }
    const n = faker.number.int({ min: 3, max: 10 })
    const items = Array.from({ length: n }).map(() => ({
      id: faker.string.uuid(),
      code: faker.string.alphanumeric(6).toUpperCase(),
      status: faker.helpers.arrayElement(['OK', 'WARN', 'ERR'] as const),
      createdAt: faker.date.past().toISOString(),
    }))
    return HttpResponse.json(items)
  }),
]
