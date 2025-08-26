import type { MRT_ColumnDef } from 'mantine-react-table'
import type { Employee } from '@shared/api/types'

export const employeeColumns: MRT_ColumnDef<Employee>[] = [
  { accessorKey: 'firstName', header: 'First name' },
  { accessorKey: 'lastName',  header: 'Last name'  },
  { accessorKey: 'email',     header: 'Email'      },
  { accessorKey: 'department',header: 'Department' },
  { accessorKey: 'role',      header: 'Role'       },
  { accessorKey: 'country',   header: 'Country'    },
  { accessorKey: 'city',      header: 'City'       },
  { accessorKey: 'salary',    header: 'Salary', aggregationFn: 'mean', enableGrouping: false },
]


export const reportColumns: MRT_ColumnDef<Report>[] = [
    { accessorKey: 'code', header: 'Code' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'createdAt', header: 'Created' },
];