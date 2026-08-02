import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { DataTable, type ColumnDef } from './DataTable'

interface TestItem {
  id: string
  name: string
  role: string
}

describe('DataTable Component', () => {
  const columns: ColumnDef<TestItem>[] = [
    { key: 'name', header: 'Name', renderCell: (item) => item.name },
    { key: 'role', header: 'Role', renderCell: (item) => item.role },
  ]

  const data: TestItem[] = [
    { id: '1', name: 'Alice', role: 'Developer' },
    { id: '2', name: 'Bob', role: 'Architect' },
  ]

  it('renders column headers and row data', () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        keyExtractor={(item) => item.id}
      />,
    )

    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Role')).toBeInTheDocument()

    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Developer')).toBeInTheDocument()

    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Architect')).toBeInTheDocument()
  })

  it('renders custom emptyState element when data array is empty', () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        keyExtractor={(item) => item.id}
        emptyState={<div>No data records found.</div>}
      />,
    )

    expect(screen.getByText('No data records found.')).toBeInTheDocument()
  })
})
