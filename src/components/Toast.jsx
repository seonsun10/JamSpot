import { useState, useCallback } from 'react'
import './Toast.css'

export function useToast() {
  const [toast, setToast] = useState({ show: false, message: '' })

  const showToast = useCallback((message, duration = 2000) => {
    setToast({ show: true, message })
    setTimeout(() => {
      setToast({ show: false, message: '' })
    }, duration)
  }, [])

  return { toast, showToast }
}

export function Toast({ show, message }) {
  if (!show) return null
  
  return (
    <div className="toast-container">
      <div className="toast-message">
        {message}
      </div>
    </div>
  )
}
