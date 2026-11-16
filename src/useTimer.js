import { useCallback, useEffect, useRef, useState } from 'react'
import { MODES } from './data'

// Timestamp-based: the end time is fixed when started, so background-tab throttling can't cause drift.
export function useTimer(modeKey) {
  const total = MODES.find((m) => m.key === modeKey).minutes * 60000
  const [left, setLeft] = useState(total)
  const [running, setRunning] = useState(false)
  const endAt = useRef(0)

  useEffect(() => { setRunning(false); setLeft(total) }, [total])

  useEffect(() => {
    if (!running) return
    const tick = () => {
      const r = endAt.current - Date.now()
      if (r <= 0) { setLeft(0); setRunning(false) } else setLeft(r)
    }
    tick()
    const id = setInterval(tick, 250)
    document.addEventListener('visibilitychange', tick)
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', tick) }
  }, [running])

  const toggle = useCallback(() => {
    if (running) return setRunning(false)
    const start = left <= 0 ? total : left
    endAt.current = Date.now() + start
    setLeft(start); setRunning(true)
  }, [running, left, total])
  const reset = useCallback(() => { setRunning(false); setLeft(total) }, [total])
  return { left, total, running, toggle, reset }
}
