'use client'

import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDown } from 'lucide-react'
import { Column, RowData } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  children: React.ReactNode
}

// Type for table meta data
declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    computedFooterData?: {
      totalSoldProductCount?: number
      totalSoldProductAmount?: number
      totalDistributionChainEntitiesOnboarded?: number
    }
  }
}

export function ClientSideDataTableColumnHeader<TData, TValue>({
  column,
  children,
  className
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <span className="font-semibold text-white text-xs">{children}</span>
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 data-[state=open]:bg-accent data-[state=open]:text-primary group"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        <span className="font-semibold text-white text-xs group-hover:text-primary">{children}</span>
        {column.getIsSorted() === 'desc' ? (
          <ArrowDownIcon className="text-white ml-2 h-4 w-4 group-hover:text-primary" />
        ) : column.getIsSorted() === 'asc' ? (
          <ArrowUpIcon className="text-white ml-2 h-4 w-4 group-hover:text-primary" />
        ) : (
          <ChevronsUpDown className="text-white ml-2 h-4 w-4 group-hover:text-primary" />
        )}
      </Button>
    </div>
  )
}
