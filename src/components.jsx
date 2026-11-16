import { Play, Pause, RotateCcw, Image, Music2, Square, Volume2, Headphones, Piano, CloudRain, CloudRainWind, CloudLightning, Waves, TreePine, Flame, Radio, AudioLines, Coffee } from 'lucide-react'
const Icons = { Headphones, Piano, CloudRain, CloudRainWind, CloudLightning, Waves, TreePine, Flame, Radio, AudioLines, Coffee }
import { MODES, BACKGROUNDS, SOUNDS } from './data'

const R = 118, C = 2 * Math.PI * R
const fmt = (ms) => { const s = Math.ceil(ms / 1000); return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}` }

export function ModeTabs({ mode, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {MODES.map((m) => (
        <button key={m.key} role="tab" aria-selected={mode === m.key} className={mode === m.key ? 'on' : ''} onClick={() => onChange(m.key)}>{m.label}</button>
      ))}
    </div>
  )
}

export function Timer({ left, total, running, onToggle, onReset }) {
  const progress = 1 - left / total
  return (
    <div className="timer">
      <div className="ring">
        <svg viewBox="0 0 260 260" aria-hidden>
          <circle className="track" cx="130" cy="130" r={R} />
          <circle className="bar" cx="130" cy="130" r={R} strokeDasharray={C} strokeDashoffset={C * (1 - progress)} />
        </svg>
        <div className="time" role="timer" aria-live="off">{fmt(left)}</div>
      </div>
      <div className="controls">
        <button className="round" onClick={onReset} aria-label="Reset"><RotateCcw size={20} /></button>
        <button className="primary" onClick={onToggle}>{running ? <Pause size={20} /> : <Play size={20} />}{running ? 'Pause' : 'Start'}</button>
      </div>
    </div>
  )
}

export function BackgroundPanel({ selected, onSelect }) {
  return (
    <section className="panel" aria-label="Backgrounds">
      <h2>Backgrounds</h2>
      <div className="thumbs">
        {BACKGROUNDS.map((b) => (
          <button key={b.key} className={`thumb ${selected === b.key ? 'on' : ''}`} onClick={() => onSelect(b.key)} title={b.name} aria-label={b.name} aria-pressed={selected === b.key}
            style={{ background: b.fallback }}>
            <img src={b.thumb} alt="" loading="lazy" onError={(e) => (e.currentTarget.style.display = 'none')} />
          </button>
        ))}
      </div>
    </section>
  )
}

export function SoundPanel({ mixer }) {
  return (
    <section className="panel sounds" aria-label="Music and sounds">
      <div className="panel-head">
        <h2>Sounds</h2>
        <button className="ghost" onClick={mixer.stopAll} disabled={!mixer.count}><Square size={14} />Stop all</button>
      </div>
      <label className="master"><Volume2 size={16} />
        <input type="range" min="0" max="1" step="0.01" value={mixer.master} onChange={(e) => mixer.setMaster(+e.target.value)} aria-label="Master volume" />
      </label>
      <ul>
        {SOUNDS.map((s) => {
          const Icon = Icons[s.icon] || Music2, on = !!mixer.playing[s.key]
          return (
            <li key={s.key} className={on ? 'on' : ''}>
              <button className="snd" onClick={() => mixer.toggle(s.key)} aria-pressed={on}>
                <span className="ico"><Icon size={16} /></span><span>{s.label}</span>
                <span className="pp">{on ? <Pause size={14} /> : <Play size={14} />}</span>
              </button>
              <input type="range" min="0" max="1" step="0.01" value={mixer.vols[s.key] ?? 0.6} onChange={(e) => mixer.setVol(s.key, +e.target.value)} aria-label={`${s.label} volume`} />
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export function Dock({ open, onOpen, soundCount }) {
  return (
    <div className="dock">
      <button className={open === 'bg' ? 'on' : ''} onClick={() => onOpen('bg')} aria-label="Backgrounds"><Image size={20} /></button>
      <button className={open === 'snd' ? 'on' : ''} onClick={() => onOpen('snd')} aria-label="Sounds"><Music2 size={20} />{soundCount > 0 && <i />}</button>
    </div>
  )
}
