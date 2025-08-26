// faker.ts
import { faker } from '@faker-js/faker'
import type { Employee } from './types'

faker.seed(42)

const departments = ['Engineering', 'Sales', 'Support', 'HR', 'Marketing'] as const

function makeEmployee(depth = 0): Employee {
  const first = faker.person.firstName()
  const last = faker.person.lastName()
  const base: Employee = {
    id: faker.string.uuid(),
    firstName: first,
    lastName: last,
    email: faker.internet.email({ firstName: first, lastName: last }),
    department: faker.helpers.arrayElement(departments),
    role: faker.person.jobTitle(),
    country: faker.location.country(),
    city: faker.location.city(),
    salary: faker.number.int({ min: 30000, max: 180000 }),
  }

  if (depth < 1) {
    faker.helpers.maybe(() => {
      const n = faker.number.int({ min: 1, max: 4 })
      base.reports = Array.from({ length: n }, () => makeEmployee(depth + 1))
    }, { probability: 0.3 })
  }

  return base
}

export const DB: Employee[] = Array.from({ length: 500 }, () => makeEmployee())
