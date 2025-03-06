'use client'

import { AlertTriangle } from 'lucide-react'

interface ErrorFeedbackProps {
  message?: string
  refreshRoute?: string
}

export function ErrorFeedback({ message = 'Something went wrong', refreshRoute }: ErrorFeedbackProps) {
  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <AlertTriangle className="w-8 h-8" />
      <div className="flex flex-col gap-2 justify-center items-center">
        <h2>{message}</h2>
        {refreshRoute && (
          <button
            type="button"
            className={'px-4 py-2 m-0 bg-primary hover:bg-primary/80 rounded-md text-white text-sm'}
            onClick={() => {
              location.replace(refreshRoute)
            }}
          >
            Refresh Query
          </button>
        )}
      </div>
    </div>
  )
}
