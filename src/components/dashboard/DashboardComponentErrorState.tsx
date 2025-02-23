import { ErrorFeedback } from '@/components/ErrorFeedback'
import { Card, CardContent } from '@/components/ui/card'

type TDashboardComponentErrorStateProps = {
  message?: string
}

export const DashboardComponentErrorState = ({ message }: TDashboardComponentErrorStateProps) => {
  return (
    <Card className="max-w-screen-2xl w-full p-8 mx-auto bg-red-50 border border-red-600 border-dashed rounded-md">
      <CardContent>
        <ErrorFeedback message={message} refreshRoute="/dashboard" />
      </CardContent>
    </Card>
  )
}
