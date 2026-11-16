import { useEffect, useState } from 'react'
import { BACKGROUNDS } from './data'
import { load, save } from './storage'
import { useTimer } from './useTimer'
import { useMixer } from './useMixer'
import { ModeTabs, Timer, BackgroundPanel, SoundPanel, Dock } from './components'

export default function App() {
  const [mode, setMode] = useState(() => load('mode', 'focus'))
  const [bgKey, setBgKey] = useState(() => load('bg', 'mountains'))
  const [open, setOpen] = useState(null)
  const timer = useTimer(mode)
  const mixer = useMixer()
  const bg = BACKGROUNDS.find((b) => b.key === bgKey) || BACKGROUNDS[0]

  useEffect(() => save('mode', mode), [mode])
  useEffect(() => save('bg', bgKey), [bgKey])
  useEffect(() => { const i = new Image(); i.src = bg.full }, [bg])

  return (
    <div className="app" style={{ background: bg.fallback }}>
      {BACKGROUNDS.map((b) => (
        <div key={b.key} className={`bg ${b.key === bg.key ? 'show' : ''}`} style={{ backgroundImage: `url(${b.full})` }} />
      ))}
      <div className="overlay" />
      <main>
        <div className="card">
          <ModeTabs mode={mode} onChange={setMode} />
          <Timer {...timer} onToggle={timer.toggle} onReset={timer.reset} />
        </div>
      </main>
      <div className="side">
        {open === 'bg' && <BackgroundPanel selected={bg.key} onSelect={setBgKey} />}
        {open === 'snd' && <SoundPanel mixer={mixer} />}
        <Dock open={open} onOpen={(k) => setOpen(open === k ? null : k)} soundCount={mixer.count} />
      </div>
    </div>
  )
}
