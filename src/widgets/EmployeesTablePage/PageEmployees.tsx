import { Page } from '@shared/ui/Page'
import { DataTable } from '@features/dataTable/components/DataTable'
import { useServerState } from '@features/dataTable/lib/useServerState'
import { Group } from '@mantine/core'
import { SearchInput } from '@shared/ui/SearchInput'

export function PageEmployees() {
  const {
    page, setPage,
    pageSize, setPageSize,
    q, setQ,
    setSortBy, setSortDir,
    setFilters,
    params,
  } = useServerState()

  return (
    <Page title="Employees">
      <Group mb="md" justify="space-between">
        <SearchInput value={q} onChange={setQ} placeholder="Search name, email, role, city..." />
      </Group>

      <DataTable
        params={params}
        page={page}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={setPageSize}
        setSortBy={setSortBy}
        setSortDir={setSortDir}
        setFilters={setFilters}
        onSearchChange={setQ}
      />
    </Page>
  )
}