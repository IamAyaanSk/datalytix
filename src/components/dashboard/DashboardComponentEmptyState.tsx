import { CircleOff } from 'lucide-react'

type TDashboardComponentEmptyStateProps = {
  message?: string
  children?: React.ReactNode
}

export const DashboardComponentEmptyState = ({ message, children }: TDashboardComponentEmptyStateProps) => {
  return (
    <div className="flex flex-col gap-3 justify-center items-center border border-primary/60 w-full h-full p-10 bg-muted my-4 rounded-md">
      <CircleOff className="w-8 h-8 text-primary" />
      <div className="flex flex-col gap-2 justify-center items-center">
        <h2 className="text-primary/70">{message}</h2>
        {children}
      </div>
    </div>
  )
}
