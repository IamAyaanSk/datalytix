import { ErrorFeedback } from '@/components/ErrorFeedback'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type TDashboardComponentErrorStateProps = {
  message?: string
  className?: string
}

export const DashboardComponentErrorState = ({ message, className }: TDashboardComponentErrorStateProps) => {
  return (
    <Card
      className={cn(
        'max-w-screen-2xl w-full p-8 flex flex-col items-center justify-center mx-auto bg-red-50 border border-red-600 border-dashed rounded-md',
        className
      )}
    >
      <CardContent className="p-0">
        <ErrorFeedback message={message} refreshRoute="/dashboard" />
      </CardContent>
    </Card>
  )
}
