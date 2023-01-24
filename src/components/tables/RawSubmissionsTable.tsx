import {
  ExpandedState,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import React, { useState } from 'react'
import { CaretDownFill, CaretRightFill, CaretUpFill, Icon } from 'react-bootstrap-icons'
import { useParams } from 'react-router-dom'

import { endpoints } from '../../constants/endpoints'
import { Exercise, SubmissionDataRow } from '../../constants/types'
import { AnchorButton } from '../../styles/_app.style'
import { Table, Td, Th, ThContainer } from '../../styles/table.style'

const DATE_PATTERN = /\d{2}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}/g

const RawSubmissionsTable = ({
  exercise,
  data,
}: {
  exercise: Exercise
  data: SubmissionDataRow[]
}) => {
  const { year } = useParams()

  function caretIcon(rowIsExpanded: boolean): Icon {
    return rowIsExpanded ? CaretDownFill : CaretRightFill
  }

  const columnHelper = createColumnHelper<SubmissionDataRow>()
  const columns = [
    columnHelper.accessor((row) => {}, {
      id: 'expander',
      cell: ({ row, getValue }) => {
        const Caret = caretIcon(row.getIsExpanded())
        return (
          row.getCanExpand() && (
            <Caret onClick={row.getToggleExpandedHandler()} style={{ cursor: 'pointer' }} />
          )
        )
      },
      header: ({ table }) => {
        const Caret = caretIcon(table.getIsAllRowsExpanded())
        return <Caret onClick={table.getToggleAllRowsExpandedHandler()} />
      },
      enableSorting: false,
    }),
    columnHelper.accessor((row) => row.login, {
      id: 'login',
      cell: (info) => info.getValue(),
      header: 'Login',
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.fullName, {
      id: 'fullName',
      cell: (info) => info.getValue(),
      header: 'Name',
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.latestSubmission, {
      id: 'latestSubmission',
      cell: (info) => {
        let cellValue = info.getValue()
        return cellValue.match(DATE_PATTERN) ? (
          <AnchorButton
            thin
            href={endpoints.submissionZipped(
              year!,
              exercise.moduleCode,
              exercise.number,
              info.row.original.login
            )}
          >
            {cellValue}
          </AnchorButton>
        ) : (
          cellValue
        )
      },
      header: 'Latest Submission',
      footer: (info) => info.column.id,
    }),
  ]

  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
      sorting,
    },
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <Table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header, headerIndex) => (
              <Th key={header.id} expander={headerIndex === 0}>
                {header.isPlaceholder ? null : (
                  <ThContainer
                    {...{
                      className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                      onClick: header.column.getToggleSortingHandler(),
                    }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: <CaretUpFill />,
                      desc: <CaretDownFill />,
                    }[header.column.getIsSorted() as string] ?? null}
                  </ThContainer>
                )}
              </Th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell, cellIndex) => (
              <Td key={cell.id} expander={cellIndex === 0} subRow={cellIndex > 0 && row.depth > 0}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default RawSubmissionsTable
