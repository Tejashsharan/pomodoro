const u = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2000&q=80`
const t = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=240&q=60`
const bg = (key, name, id, from, to) => ({ key, name, full: u(id), thumb: t(id), fallback: `linear-gradient(135deg, ${from}, ${to})` })

export const MODES = [
  { key: 'focus', label: 'Focus', minutes: 25 },
  { key: 'short', label: 'Short Break', minutes: 5 },
  { key: 'long', label: 'Long Break', minutes: 15 },
  { key: 'deep', label: 'Deep Work', minutes: 50 },
]

// Swap any `id` for another Unsplash photo id to change a background.
export const BACKGROUNDS = [
  bg('mountains', 'Mountains', 'photo-1506905925346-21bda4d32df4', '#2b3a55', '#8fa6c4'),
  bg('forest', 'Forest', 'photo-1441974231531-c6227db76b6e', '#10281c', '#4f7a4a'),
  bg('rain', 'Rainy window', 'photo-1428592953211-077101b2021b', '#1c2733', '#5d7488'),
  bg('cozy', 'Cozy room', 'photo-1513694203232-719a280e022f', '#3b2616', '#c08a55'),
  bg('ocean', 'Ocean', 'photo-1505118380757-91f5f5632de0', '#0c2c44', '#3f8fb0'),
  bg('sunset', 'Sunset', 'photo-1507525428034-b723cf961d3e', '#4a1f3d', '#f08a4b'),
  bg('night', 'Night sky', 'photo-1419242902214-272b3f66ee7a', '#080c24', '#3a2f6b'),
  bg('japan', 'Japanese countryside', 'photo-1478436127897-769e1b3f0f36', '#2f4a2f', '#c9b98a'),
  bg('snow', 'Snowy landscape', 'photo-1483728642387-6c3bdd6c93e5', '#34465c', '#dbe6f0'),
  bg('cafe', 'Coffee shop', 'photo-1554118811-1e0d58224f24', '#2a1a10', '#a8794c'),
]

export const SOUNDS = [
  { key: 'lofi', label: 'Lo-fi Music', icon: 'Headphones' },
  { key: 'soft-piano', label: 'Soft Piano', icon: 'Piano' },
  { key: 'rain', label: 'Rain', icon: 'CloudRain' },
  { key: 'heavy-rain', label: 'Heavy Rain', icon: 'CloudRainWind' },
  { key: 'thunderstorm', label: 'Thunderstorm', icon: 'CloudLightning' },
  { key: 'ocean', label: 'Ocean Waves', icon: 'Waves' },
  { key: 'forest', label: 'Forest Sounds', icon: 'TreePine' },
  { key: 'fireplace', label: 'Fireplace', icon: 'Flame' },
  { key: 'white', label: 'White Noise', icon: 'Radio' },
  { key: 'brown', label: 'Brown Noise', icon: 'AudioLines' },
  { key: 'cafe', label: 'Café Ambience', icon: 'Coffee' },
]
