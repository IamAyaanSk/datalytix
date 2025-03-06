import { NextRequest, NextResponse } from 'next/server'
import { getUtcTimestampsForSelectedDates } from '@/lib/utils'
import { DateTime } from 'luxon'
import { DistributionChainEntities, UserRole } from '@/types/types'

const addDateParams = (url: URL) => {
  const todayDates = getUtcTimestampsForSelectedDates({
    from: new Date(),
    to: new Date()
  })

  url.searchParams.set('startDate', todayDates.from)
  url.searchParams.set('endDate', todayDates.to)

  return url
}

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect('/dashboard')
  }

  // Add date params to specific routes
  const routesNeedingDateParams = ['/dashboard']

  if (routesNeedingDateParams.includes(req.nextUrl.pathname)) {
    const { searchParams } = req.nextUrl
    const url = new URL(req.nextUrl.href)

    let urlWithDateParams = new URL(url)

    if (!searchParams.get('startDate') || !searchParams.get('endDate')) {
      urlWithDateParams = addDateParams(urlWithDateParams)
    }

    if (!searchParams.get('compareStartDate') || !searchParams.get('compareEndDate')) {
      const previousMonthDates = getUtcTimestampsForSelectedDates({
        from: DateTime.now().setZone('Asia/Kolkata').minus({ months: 1 }).startOf('day').toJSDate(),
        to: DateTime.now().setZone('Asia/Kolkata').minus({ months: 1 }).endOf('day').toJSDate()
      })

      urlWithDateParams.searchParams.set('compareStartDate', previousMonthDates.from)
      urlWithDateParams.searchParams.set('compareEndDate', previousMonthDates.to)
    }

    const entity = searchParams.get('entity')
    const userRole = searchParams.get('role')

    if (!entity || !userRole) {
      urlWithDateParams.searchParams.set('entity', DistributionChainEntities.ADMIN)
      urlWithDateParams.searchParams.set('role', UserRole.ADMIN)
    }

    // This validation should be typically done on backend, but since it is frontend focused app, we will do it  here using conditionals
    if (!Object.keys(DistributionChainEntities).includes(entity!) || !Object.keys(UserRole).includes(userRole!)) {
      urlWithDateParams.searchParams.set('entity', DistributionChainEntities.ADMIN)
      urlWithDateParams.searchParams.set('role', UserRole.ADMIN)
    }

    if (url.href !== urlWithDateParams.href) {
      return NextResponse.redirect(urlWithDateParams)
    }
  }
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|assets|web|media|fonts|favicon.ico|favicon.png).*)'
    }
  ]
}
