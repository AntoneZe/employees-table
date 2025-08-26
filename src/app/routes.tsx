import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { PageEmployees } from '@widgets/EmployeesTablePage/PageEmployees'

const router = createBrowserRouter(
  [{ path: '/', element: <PageEmployees /> }],
  { basename: import.meta.env.BASE_URL } 
)

export function AppRoutes() {
  return <RouterProvider router={router} />
}