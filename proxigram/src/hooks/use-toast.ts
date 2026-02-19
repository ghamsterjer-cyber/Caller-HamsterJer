
"use client"
import * as React from "react"
import type { ToastProps } from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}

let count = 0
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

export function useToast() {
  const [toasts, setToasts] = React.useState<ToasterToast[]>([])
  const toast = React.useCallback(({ ...props }: Omit<ToasterToast, "id">) => {
    const id = genId()
    setToasts((prev) => [{ ...props, id, open: true }, ...prev].slice(0, TOAST_LIMIT))
    return id
  }, [])

  return { toasts, toast, dismiss: (id?: string) => setToasts((prev) => id ? prev.filter(t => t.id !== id) : []) }
}
