export const WHATSAPP_BEEP_URL = "/sounds/whatsapp-message.wav";
export const LOAN_ADVISOR_BEEP_ID = "loan-advisor-beep";

let audioContext: AudioContext | null = null;
let fallbackAudio: HTMLAudioElement | null = null;
let pageLoadBeepDone = false;

function isBeepDone(): boolean {
  if (pageLoadBeepDone) return true;
  if (typeof window !== "undefined" && window.__azWaBeepDone) return true;
  return false;
}

function markBeepDone(): void {
  pageLoadBeepDone = true;
  if (typeof window !== "undefined") window.__azWaBeepDone = true;
}

function getDomBeepAudio(): HTMLAudioElement | null {
  if (typeof document === "undefined") return null;
  const el = document.getElementById(LOAN_ADVISOR_BEEP_ID);
  return el instanceof HTMLAudioElement ? el : null;
}

function getFallbackBeepAudio(): HTMLAudioElement {
  if (!fallbackAudio) {
    fallbackAudio = new Audio(WHATSAPP_BEEP_URL);
    fallbackAudio.preload = "auto";
    fallbackAudio.volume = 0.8;
  }
  return fallbackAudio;
}

function getBeepAudio(): HTMLAudioElement {
  return getDomBeepAudio() ?? getFallbackBeepAudio();
}

/**
 * Same <audio> element: muted play unlocks browser, then unmuted beep.
 * This is the most reliable autoplay pattern on refresh.
 */
async function unlockAndPlaySameElement(audio: HTMLAudioElement): Promise<boolean> {
  try {
    audio.muted = true;
    audio.volume = 0.001;
    audio.currentTime = 0;
    await audio.play();
    audio.pause();
    audio.currentTime = 0;
    audio.muted = false;
    audio.volume = 0.8;
    await audio.play();
    return true;
  } catch {
    try {
      audio.muted = false;
      audio.volume = 0.8;
      audio.currentTime = 0;
      await audio.play();
      return true;
    } catch {
      return false;
    }
  }
}

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctx =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!audioContext) audioContext = new Ctx();
  return audioContext;
}

const WA_MESSAGE_TONES = [
  { freq: 587.33, start: 0, duration: 0.09 },
  { freq: 783.99, start: 0.11, duration: 0.12 },
] as const;

async function playWithWebAudio(): Promise<boolean> {
  const ctx = getAudioContext();
  if (!ctx) return false;

  if (ctx.state === "suspended") {
    await ctx.resume();
  }

  const now = ctx.currentTime;

  for (const tone of WA_MESSAGE_TONES) {
    const start = now + tone.start;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "triangle";
    osc.frequency.setValueAtTime(tone.freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.42, start + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + tone.duration);
    osc.start(start);
    osc.stop(start + tone.duration + 0.04);
  }

  return true;
}

/** WhatsApp-style beep (after click or unlock) */
export async function playLoanHelperBeep(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const audio = getBeepAudio();
  let ok = await unlockAndPlaySameElement(audio);
  if (!ok) {
    try {
      ok = await playWithWebAudio();
    } catch {
      ok = false;
    }
  }
  return ok;
}

/** Once per refresh — runs on page load without click */
export async function playLoanHelperBeepOnPageLoad(): Promise<boolean> {
  if (typeof window === "undefined" || isBeepDone()) return false;

  const dom = getDomBeepAudio();
  let ok = false;

  if (dom) {
    ok = await unlockAndPlaySameElement(dom);
  } else {
    ok = await unlockAndPlaySameElement(getFallbackBeepAudio());
  }

  if (!ok) {
    try {
      const ctx = getAudioContext();
      if (ctx?.state === "suspended") await ctx.resume();
      ok = await playWithWebAudio();
    } catch {
      ok = false;
    }
  }

  if (ok) markBeepDone();
  return ok;
}

export function primeLoanHelperBeep(): void {
  if (typeof window === "undefined") return;
  const dom = getDomBeepAudio();
  if (dom) {
    dom.load();
  } else {
    getFallbackBeepAudio();
  }
  void getAudioContext()?.resume();
}

declare global {
  interface Window {
    __azWaBeepDone?: boolean;
  }
}
