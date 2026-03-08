/**
 * Text-to-speech for interview questions.
 * Uses browser Speech Synthesis. Set VITE_ELEVENLABS_* in .env for ElevenLabs when CORS allows.
 */

let currentAbortController = null
let currentAudio = null

export async function speakText(text) {
  if (!text || typeof text !== "string") return

  stopSpeaking()
  fallbackSpeak(text)
}

function fallbackSpeak(text) {
  if (!("speechSynthesis" in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 0.9
  utterance.pitch = 1
  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking() {
  if (currentAbortController) {
    currentAbortController.abort()
    currentAbortController = null
  }
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
    currentAudio = null
  }
  if ("speechSynthesis" in window) window.speechSynthesis.cancel()
}
