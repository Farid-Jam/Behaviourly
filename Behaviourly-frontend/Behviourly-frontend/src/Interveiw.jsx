import { useState, useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import Camera from "./Camera"
import { speakText } from "./elevenLabs"
import "./Interview.css"

export default function Interview() {
  const { state } = useLocation()
  const company = state?.company
  const role = state?.role || "software engineer"

  const [questions, setQuestions] = useState([])
  const [currentQ, setCurrentQ] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [started, setStarted] = useState(false)
  const [ended, setEnded] = useState(false)
  const cameraRef = useRef(null)

  // Fetch 3 short, realistic questions for this company and role
  useEffect(() => {
    setError(null)
    fetch("http://127.0.0.1:8000/mock-interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, company: company || undefined, num_questions: 3 })
    })
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          setError(data?.error || data?.detail || "Backend error")
          setQuestions([])
        } else {
          setQuestions(Array.isArray(data.questions) ? data.questions : [])
        }
        setLoading(false)
      })
      .catch(err => {
        setError(err.message || "Failed to connect. Is the backend running on port 8000?")
        setQuestions([])
        setLoading(false)
      })
  }, [company, role])

  // Speak question when it changes (only after interview started, not when ended)
  useEffect(() => {
    if (started && !ended && questions.length > 0 && currentQ < questions.length) {
      speakText(questions[currentQ])
    }
  }, [started, ended, currentQ, questions])

  // Auto-start recording when advancing to next question (external controls mode)
  useEffect(() => {
    if (started && !ended && currentQ < questions.length) {
      cameraRef.current?.startRecording?.()
    }
  }, [started, ended, currentQ, questions.length])

  function handleNextQuestion() {
    if (currentQ >= questions.length) return
    setCurrentQ(prev => prev + 1)
  }

  function handleRecordingComplete(blob, url) {
    // Recording stopped — blob can be processed/uploaded here. Advancement is handled by the Next Question button.
  }

  const complete = ended || currentQ >= questions.length

  if (loading) return <div className="interview-loading">Generating your interview questions... 🤔</div>

  if (questions.length === 0) {
    return (
      <div className="interview-page">
        <div className="interview-error-box">
          <strong>No questions loaded</strong>
          {error && <p className="interview-error-text">{error}</p>}
          <p className="interview-error-hint">Make sure the backend is running on port 8000 and GEMINI_API_KEY is set in hackcanada-backend/.env</p>
        </div>
      </div>
    )
  }

  return (
    <div className="interview-page">
      {/* Practicing for — at top */}
      <div className="interview-header">
        <span className="interview-label">Practicing for</span>
        <span className="interview-context">{company && role ? `${company} · ${role}` : role}</span>
      </div>

      {/* Questions — only visible after Start interview */}
      {started && !complete && (
        <div className="interview-questions-card">
          <span className="interview-questions-label">Question {currentQ + 1} of {questions.length}</span>
          <p className="interview-current-question">
            {questions[currentQ]}
          </p>
        </div>
      )}

      {/* Camera — always shown, controls below via externalControls */}
      <div className="interview-section">
        <Camera ref={cameraRef} onRecordingComplete={handleRecordingComplete} externalControls />
        {!started ? (
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="interview-start-btn"
          >
            Start interview
          </button>
        ) : !complete ? (
          <div className="interview-actions">
            <button
              type="button"
              onClick={() => {
                cameraRef.current?.stopRecording?.()
                handleNextQuestion()
              }}
              className="interview-next-btn"
            >
              Next Question →
            </button>
            <button
              type="button"
              onClick={() => {
                setEnded(true)
                cameraRef.current?.stopRecording?.()
              }}
              className="interview-end-btn"
            >
              End interview
            </button>
          </div>
        ) : (
          <div className="interview-done">Interview complete!</div>
        )}
      </div>
    </div>
  )
}