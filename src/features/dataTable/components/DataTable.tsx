import {
    MantineReactTable,
    type MRT_ColumnDef,
    useMantineReactTable,
} from 'mantine-react-table'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { Employee, Paged } from '@shared/api/types'
import { Loader, Group, Select, Button, Text } from '@mantine/core'
import { employeeColumns, reportColumns } from '../lib/columns'
import type { Dispatch, SetStateAction } from 'react'
import {
    IconArrowsSort,
    IconSortAscending,
    IconSortDescending,
    IconFilter,
    IconGripHorizontal,
    IconDotsVertical,
} from '@tabler/icons-react'
import { Global } from '@emotion/react'


const ICON_PROPS = { size: 14, stroke: 1.75, color: 'white' } as const


type Props = {
    columns?: MRT_ColumnDef<Employee>[]
    params: URLSearchParams
    page: number
    pageSize: number
    setPage: (p: number) => void
    setPageSize: (n: number) => void
    setSortBy: (k?: string) => void
    setSortDir: (d: 'asc' | 'desc') => void
    setFilters: Dispatch<SetStateAction<Record<string, string>>>
    onSearchChange: (v: string) => void
}

export function DataTable({
    columns = employeeColumns,
    params,
    page, pageSize, setPage, setPageSize,
    setSortBy, setSortDir, setFilters, onSearchChange,
}: Props) {
    const url = useMemo(() => '/api/employees?' + params.toString(), [params])

    const { data, isLoading, isFetching } = useQuery<Paged<Employee>>({
        queryKey: ['employees', params.toString()] as const,
        queryFn: async (): Promise<Paged<Employee>> => {
            const res = await fetch(url)
            if (!res.ok) throw new Error('Failed to fetch')
            return res.json() as Promise<Paged<Employee>>
        },
        placeholderData: (prev) => prev,
        staleTime: 60_000,
        refetchOnWindowFocus: false,
    })

    function ReportsSubtable({ parentId }: { parentId: string }) {
        const { data, isLoading } = useQuery({
            queryKey: ['reports', parentId],
            queryFn: async (): Promise<Report[]> => {
                const r = await fetch(`/api/employees/${parentId}/reports`);
                if (!r.ok) throw new Error('load reports failed');
                return r.json();
            },
            placeholderData: (prev) => prev,
        });



        const subTable = useMantineReactTable<Report>({
            columns: reportColumns,
            data: data ?? [],
            enableTopToolbar: false,
            enableBottomToolbar: false,
            enableColumnActions: false,
            enableColumnDragging: false,
            enableColumnFilters: false,
            enableHiding: false,
            state: { isLoading },
            mantinePaperProps: { withBorder: true, radius: 'md', shadow: 'xs', p: 0 },
            mantineTableProps: { striped: 'odd', highlightOnHover: true, withRowBorders: false },
            initialState: { density: 'xs' },
        });

        return <MantineReactTable table={subTable} />;
    }


    const table = useMantineReactTable<Employee>({
        columns,
        data: data?.items ?? [],
        enableExpanding: true,
        getRowCanExpand: () => true,
        mantinePaperProps: {
            withBorder: true,
            radius: 'lg',
            shadow: 'sm',
            p: 'xs',
            className: 'employees-table',
            style: { overflow: 'hidden' },
        },
        mantineTableHeadCellProps: {
            style: { background: '#1a1a1c', color: 'white' },
        },
        mantineTableContainerProps: {
            style: { maxHeight: '68vh', overflow: 'auto' },
        },
        positionToolbarAlertBanner: 'none',
        mantineTableProps: { striped: 'odd', highlightOnHover: true, withRowBorders: false },
        mantineTopToolbarProps: { p: 'xs', style: { background: 'var(--mantine-color-dark-6)' } },
        mantineBottomToolbarProps: {
            p: 'xs',
            style: {
                background: 'var(--mantine-color-dark-6)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
                marginBottom: 12,
            },
        },
        mantinePaginationProps: {
            withEdges: true,
            styles: {
                root: { marginLeft: 'auto', marginTop: 8 },
            },
        },
        icons: {
            IconArrowsSort: (p: any) => <IconArrowsSort     {...ICON_PROPS} {...p} />,
            IconSortAscending: (p: any) => <IconSortAscending  {...ICON_PROPS} {...p} />,
            IconSortDescending: (p: any) => <IconSortDescending {...ICON_PROPS} {...p} />,
            IconFilter: (p: any) => <IconFilter         {...ICON_PROPS} {...p} />,
            IconGripHorizontal: (p: any) => <IconGripHorizontal {...ICON_PROPS} {...p} />,
            IconDotsVertical: (p: any) => <IconDotsVertical   {...ICON_PROPS} {...p} />,
        },

        enableColumnOrdering: true,
        enableColumnFilters: true,
        columnFilterDisplayMode: 'popover',
        positionGlobalFilter: 'left',
        enableGrouping: true,
        enablePinning: true,
        enableColumnResizing: true,
        enableStickyHeader: true,
        enableDensityToggle: false,
        enableFullScreenToggle: true,
        enableRowSelection: true,
        enableGlobalFilter: false,
        manualPagination: true,
        rowCount: data?.total ?? 0,
        positionPagination: 'bottom',
        paginationDisplayMode: 'pages',
        renderDetailPanel: ({ row }) => (
            <div style={{ padding: 12 }}>
                <ReportsSubtable parentId={row.original.id} />
            </div>
        ),
        state: {
            isLoading,
            showProgressBars: isFetching,
            pagination: { pageIndex: page - 1, pageSize },
        },
        onPaginationChange: (updater) => {
            const next = typeof updater === 'function'
                ? updater({ pageIndex: page - 1, pageSize })
                : updater
            setPage(next.pageIndex + 1)
            setPageSize(next.pageSize)
        },

        onSortingChange: (updater) => {
            const next = typeof updater === 'function' ? updater([]) : updater
            const sort = next[0]
            if (!sort) {
                setSortBy(undefined)
                setSortDir('asc')
            } else {
                setSortBy(sort.id)
                setSortDir(sort.desc ? 'desc' : 'asc')
            }
        },

        renderTopToolbarCustomActions: ({ table }) => (
            <Group gap="xs">
                <Select
                    placeholder="Department"
                    data={['Engineering', 'Sales', 'Support', 'HR', 'Marketing']}
                    clearable
                    onChange={(v) => {
                        const has = v ? { department: v } : {}
                        setFilters((prev) => ({ ...prev, ...has, ...(v ? {} : { department: '' }) }))
                    }}
                    w={220}
                />
                <Button
                    variant="light" size="xs"
                    onClick={() => { table.resetColumnFilters(); table.resetSorting(); onSearchChange(''); }}
                >
                    Reset
                </Button>
                <Text size="xs" c="dimmed">
                    Total: {data?.total ?? 0}
                </Text>
            </Group>
        ),

        initialState: {
            density: 'xs',
            expanded: {},
            columnVisibility: { email: true, salary: true },
            sorting: [],
            pagination: { pageIndex: 0, pageSize: 20 },
            grouping: ['department'],
            columnPinning: { left: ['mrt-row-expand', 'department'], right: [] },
        },

        defaultColumn: { minSize: 80, maxSize: 400, size: 140 },
    })

    return (
        <>
            {isLoading && !data ? <Loader /> : null}
            <Global
                styles={{
                    '.employees-table th .mantine-ActionIcon-root': { width: 22, height: 22 },
                    '.employees-table th .mantine-ActionIcon-root svg': { width: 14, height: 14 },
                    '.employees-table th svg': { width: 14, height: 14 },
                }}
            />
            <MantineReactTable table={table} />
        </>
    )
}
