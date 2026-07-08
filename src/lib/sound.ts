// Lightweight Web Audio SFX — no assets, generated on the fly.
let ctx: AudioContext | null = null;
let enabled = true;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq: number, duration = 0.12, type: OscillatorType = 'sine', gain = 0.08, sweepTo?: number) {
  if (!enabled) return;
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime);
  if (sweepTo) osc.frequency.exponentialRampToValueAtTime(sweepTo, c.currentTime + duration);
  g.gain.setValueAtTime(0, c.currentTime);
  g.gain.linearRampToValueAtTime(gain, c.currentTime + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
  osc.connect(g).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration + 0.02);
}

export const sfx = {
  key: () => tone(880, 0.04, 'square', 0.03),
  pop: () => tone(600, 0.15, 'sine', 0.1, 1200),
  hit: () => tone(180, 0.18, 'sawtooth', 0.09, 60),
  damage: () => tone(120, 0.28, 'sawtooth', 0.12, 40),
  streak: () => {
    tone(660, 0.1, 'triangle', 0.08, 990);
    setTimeout(() => tone(990, 0.12, 'triangle', 0.08, 1320), 80);
  },
  win: () => {
    [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.18, 'triangle', 0.09), i * 90));
  },
  lose: () => {
    [400, 320, 240, 160].forEach((f, i) => setTimeout(() => tone(f, 0.22, 'sawtooth', 0.09), i * 100));
  },
  setEnabled: (v: boolean) => { enabled = v; },
  isEnabled: () => enabled,
};
