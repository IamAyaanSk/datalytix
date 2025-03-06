'use client'

import { getCapitalCasedSlug, getIstDateTimeFromDate } from '@/lib/utils'
import { IGetDashboardResponseBody } from '@/types/types'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { TABLE_DATE_TIME_FORMAT } from '@/constants/global'

const recentComplaintTicketsDataColumnHelper =
  createColumnHelper<NonNullable<IGetDashboardResponseBody['recentComplaintTicketsData']['data']>[number]>()

export const recentComplaintTicketColumns = [
  recentComplaintTicketsDataColumnHelper.accessor('createdAt', {
    header: 'Date | time',
    cell: ({ row }) => {
      const formattedDateTime = getIstDateTimeFromDate(new Date(row.original.createdAt)).toFormat(
        TABLE_DATE_TIME_FORMAT
      )

      return <p>{formattedDateTime}</p>
    }
  }),

  recentComplaintTicketsDataColumnHelper.accessor('title', {
    header: 'Distribution Entity Name',
    cell: ({ row }) => {
      const title = row.original.title ?? 'N/A'

      return <p>{title}</p>
    },
    enableSorting: false
  }),

  recentComplaintTicketsDataColumnHelper.accessor('customer', {
    header: 'Amount',
    cell: ({ row }) => {
      const { name, email } = row.original.customer

      return (
        <p>
          {name} - {email}
        </p>
      )
    },
    enableSorting: false
  }),

  recentComplaintTicketsDataColumnHelper.accessor('description', {
    header: 'Description',
    cell: ({ row }) => {
      const description = row.original.description ?? 'N/A'

      return <p>{description}</p>
    },
    enableSorting: false
  }),

  recentComplaintTicketsDataColumnHelper.accessor('status', {
    header: 'Status',
    cell: ({ row }) => {
      const status = getCapitalCasedSlug(row.original.status, '_')

      return <p>{status}</p>
    },
    enableSorting: false
  })
] as ColumnDef<NonNullable<IGetDashboardResponseBody['recentComplaintTicketsData']['data']>[number]>[]
