import { useEffect, useState } from 'react'
import { load, save } from './storage'

// Sounds that use bundled mp3 files; everything else is a .wav
const MP3 = new Set(['forest', 'soft-piano'])
const fileFor = (key) => `${import.meta.env.BASE_URL}audio/${key}.${MP3.has(key) ? 'mp3' : 'wav'}`

// Audio elements live outside React so playback survives every re-render.
const els = {}
const el = (key) => {
  if (!els[key]) { const a = new Audio(fileFor(key)); a.loop = true; a.preload = 'none'; els[key] = a }
  return els[key]
}

export function useMixer() {
  const [playing, setPlaying] = useState({})
  const [vols, setVols] = useState(() => load('vols', {}))
  const [master, setMaster] = useState(() => load('master', 0.7))

  useEffect(() => {
    Object.keys(playing).forEach((k) => { el(k).volume = Math.min(1, (vols[k] ?? 0.6) * master) })
    save('vols', vols); save('master', master)
  }, [vols, master, playing])

  const toggle = (key) => {
    const a = el(key)
    if (playing[key]) { a.pause(); setPlaying((p) => { const n = { ...p }; delete n[key]; return n }) }
    else { a.volume = Math.min(1, (vols[key] ?? 0.6) * master); a.play().catch(() => {}); setPlaying((p) => ({ ...p, [key]: true })) }
  }
  const stopAll = () => { Object.keys(playing).forEach((k) => el(k).pause()); setPlaying({}) }
  return { playing, vols, master, toggle, stopAll, setMaster, setVol: (k, v) => setVols((o) => ({ ...o, [k]: v })), count: Object.keys(playing).length }
}