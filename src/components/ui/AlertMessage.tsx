"use client"

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export function AlertMessage() {
  const searchParams = useSearchParams()
  const successMsg = searchParams.get('success')
  const errorMsg = searchParams.get('error')

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (successMsg || errorMsg) {
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [successMsg, errorMsg])

  if (!visible) return null

  if (successMsg) {
    return (
      <div className="fixed top-4 right-4 bg-primary text-on-primary px-6 py-4 rounded shadow-lg z-50 flex items-center gap-2 animate-in slide-in-from-top-2">
        <span className="material-symbols-outlined">check_circle</span>
        <span className="font-medium text-sm">{successMsg}</span>
      </div>
    )
  }

  if (errorMsg) {
    return (
      <div className="fixed top-4 right-4 bg-error-container text-on-error-container px-6 py-4 rounded shadow-lg z-50 flex items-center gap-2 animate-in slide-in-from-top-2">
        <span className="material-symbols-outlined">error</span>
        <span className="font-medium text-sm">{errorMsg}</span>
      </div>
    )
  }

  return null
}
