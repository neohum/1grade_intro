let audioCtx: AudioContext | null = null;

function getCtx() {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

/** 풍선 클릭 – 귀여운 "뽁" 버블 팝 */
export function playBubblePop() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  // Primary pop tone
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.exponentialRampToValueAtTime(1200, now + 0.06);
  osc.frequency.exponentialRampToValueAtTime(400, now + 0.15);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.2);

  // Tiny high sparkle overtone
  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(1800, now + 0.02);
  osc2.frequency.exponentialRampToValueAtTime(2400, now + 0.08);

  const gain2 = ctx.createGain();
  gain2.gain.setValueAtTime(0.08, now + 0.02);
  gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

  osc2.connect(gain2).connect(ctx.destination);
  osc2.start(now + 0.02);
  osc2.stop(now + 0.14);
}

/** 활동 완료 – 밝은 "띵!" 성공음 */
export function playComplete() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const notes = [523, 659, 784]; // C5, E5, G5 – 밝은 메이저 아르페지오
  notes.forEach((freq, i) => {
    const t = now + i * 0.08;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.28);
  });
}

/** 활동 취소 – 부드러운 "뿅" 되돌림 */
export function playUndo() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(350, now + 0.15);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.2);
}
