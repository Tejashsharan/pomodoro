export const load = (k, d) => { try { const v = localStorage.getItem('pomo:' + k); return v == null ? d : JSON.parse(v) } catch { return d } }
export const save = (k, v) => { try { localStorage.setItem('pomo:' + k, JSON.stringify(v)) } catch {} }
