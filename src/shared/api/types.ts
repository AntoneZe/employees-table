export type Employee = {
    id: string
    firstName: string
    lastName: string
    email: string
    department: 'Engineering' | 'Sales' | 'Support' | 'HR' | 'Marketing'
    role: string
    country: string
    city: string
    salary: number
    reports?: Employee[]
  }
  
  export type Paged<T> = {
    items: T[]
    page: number
    pageSize: number
    total: number
  }
  
  type Report = { id: string; code: string; status: 'OK' | 'WARN' | 'ERR'; createdAt: string };
