'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  TableMeta,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useEffect, useMemo, useState } from 'react'
import { ClientSideDataTableColumnHeader } from '@/components/client-side-data-table/ClientSideDataTableColumnHeader'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { DistributionChainEntities, TAuthorizationPermissionSatifactionCombination, UserRole } from '@/types/types'
import { cn, requirePermissionCombination } from '@/lib/utils'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  columnVisibilityConfig?: Record<string, TAuthorizationPermissionSatifactionCombination[]>
  caption?: string
  meta?: TableMeta<TData>
  showSearch?: boolean
  showTableFooter?: boolean
  className?: string
  initialSorting?: SortingState
}

export function ClientSideDataTable<TData, TValue>({
  columns,
  data,
  columnVisibilityConfig,
  showSearch = true,
  caption,
  initialSorting,
  meta,
  showTableFooter = true,
  className
}: DataTableProps<TData, TValue>) {
  const memoizedColumns = useMemo(() => columns, [columns])

  const userRole = UserRole.ADMIN
  const userdistributionEntityType = DistributionChainEntities.DISTRIBUTOR

  const [sorting, setSorting] = useState<SortingState>(initialSorting ?? [])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
    // Set all the hidden columns to false initially until session data is not loaded
    if (columnVisibilityConfig) {
      return Object.keys(columnVisibilityConfig).reduce((acc, key) => {
        acc[key.replace('.', '_')] = false
        return acc
      }, {} as VisibilityState)
    }
    return {}
  })

  // This effect sets the correct visibility of the column once session data is available
  useEffect(() => {
    if (columnVisibilityConfig && userRole && userdistributionEntityType) {
      const newVisibility = Object.keys(columnVisibilityConfig).reduce((acc, key) => {
        const isColumnAllowedForUser = requirePermissionCombination({
          distributionEntityType: userdistributionEntityType,
          userRole,
          acceptCombinations: columnVisibilityConfig[key]
        })

        if (!isColumnAllowedForUser) {
          acc[key.replace('.', '_')] = false
        }
        return acc
      }, {} as VisibilityState)

      setColumnVisibility(newVisibility)
    }
  }, [columnVisibilityConfig, userRole, userdistributionEntityType])

  const table = useReactTable({
    data,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnVisibility
    },
    meta,
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: 'includesString'
  })

  return (
    <div className="flex flex-col gap-1">
      {showSearch && (
        <div className="relative">
          <Search className="w-4 h-4 absolute top-2 left-4" />
          <Input
            className="h-8 w-[200px] lg:w-[250px] text-sm pl-10 bg-white border border-primary/50"
            placeholder="Search..."
            onChange={(event) => {
              table.setGlobalFilter(event.target.value)
            }}
          />
        </div>
      )}

      <div className={cn('rounded-md my-4 bg-white caption-bottom', className)}>
        <Table>
          {caption && <TableCaption>{caption}</TableCaption>}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-primary hover:bg-primary/90 transition-all">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="border border-black">
                      <ClientSideDataTableColumnHeader column={header.column}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </ClientSideDataTableColumnHeader>
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="border border-black" key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={memoizedColumns.length} className="h-24 text-center border border-black">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          {data.length > 0 && showTableFooter && (
            <TableFooter className="bg-gray-100 font-bold">
              {table.getFooterGroups().map((footerGroup) => (
                <TableRow key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <TableCell className="border border-black" key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableFooter>
          )}
        </Table>
      </div>
    </div>
  )
}
