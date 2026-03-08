import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import Camera from "./Camera"
import { speakText } from "./elevenLabs"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"

export default function Interview() {
  const { state } = useLocation()
  const company = state?.company
  const role = state?.role || "software engineer"

  const [questions, setQuestions] = useState([])
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(100)
  const [tip, setTip] = useState(null)
  const [loading, setLoading] = useState(true)

  // Reset backend session + fetch questions from backend on load (uses role from InterviewContextPage)
  useEffect(() => {
    // Clear any previous scoring state on the backend (best-effort).
    fetch(`${API_BASE_URL}/reset-session`, { method: "POST" }).catch(() => {})

    fetch(`${API_BASE_URL}/mock-interview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, company: company || undefined, num_questions: 3 })
    })
      .then(res => res.json())
      .then(data => {
        setQuestions(data.questions)
        setLoading(false)
      })
  }, [])

  // Speak question when it changes
  useEffect(() => {
    if (questions.length > 0 && currentQ < questions.length) {
      speakText(questions[currentQ])
    }
  }, [currentQ, questions])

  function handleNextQuestion() {
    if (currentQ >= questions.length) return
    setCurrentQ(prev => prev + 1)
  }

  function handleRecordingComplete(blob, url) {
    // After they stop recording, automatically move to the next question.
    handleNextQuestion()
  }

  if (loading) return <div style={styles.loading}>Generating your interview questions... 🤔</div>

  return (
    <div style={styles.container}>
      {/* Context header (synced with InterviewContextPage) */}
      {(company || role) && (
        <div style={styles.contextHeader}>
          {company && <span>{company}</span>}
          {company && role && <span style={styles.contextDot}>·</span>}
          {role && <span>{role}</span>}
        </div>
      )}
      {/* Score bar */}
      <div style={styles.scoreBar}>
        <div style={styles.scoreLabel}>Score: {score}/100</div>
        <div style={styles.barBg}>
          <div style={{ ...styles.barFill, width: `${score}%` }} />
        </div>
        {tip && <div style={styles.tip}>{tip}</div>}
      </div>

      {/* Current question or completion summary */}
      <div style={styles.question}>
        {currentQ < questions.length
          ? `Q${currentQ + 1}: ${questions[currentQ]}`
          : "Interview complete! 🎉"}
      </div>

      {/* During the interview: show camera + next button */}
      {currentQ < questions.length && (
        <>
          <Camera onRecordingComplete={handleRecordingComplete} />
          <button onClick={handleNextQuestion} style={styles.nextBtn}>
            Next Question →
          </button>
        </>
      )}

      {/* After interview complete: placeholder for lowlight reel / summary */}
      {currentQ >= questions.length && (
        <div style={styles.summaryCard}>
          <h3 style={styles.summaryTitle}>Lowlight reel coming up</h3>
          <p style={styles.summaryText}>
            This is where we’d play back your toughest moments and coaching tips from the interview.
          </p>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif" },
  contextHeader: { fontSize: "14px", color: "#666", marginBottom: "16px", fontWeight: 500 },
  contextDot: { margin: "0 6px", opacity: 0.6 },
  loading: { textAlign: "center", padding: "40px", fontSize: "20px" },
  scoreBar: { marginBottom: "20px" },
  scoreLabel: { fontSize: "18px", fontWeight: "bold", marginBottom: "8px" },
  barBg: { background: "#eee", borderRadius: "10px", height: "20px", overflow: "hidden" },
  barFill: { background: "#4CAF50", height: "100%", borderRadius: "10px", transition: "width 0.5s" },
  tip: { marginTop: "8px", color: "#ff9800", fontWeight: "bold" },
  question: { fontSize: "22px", fontWeight: "bold", margin: "20px 0", padding: "20px", background: "#f5f5f5", borderRadius: "12px" },
  nextBtn: { marginTop: "16px", background: "#2196F3", color: "white", border: "none", padding: "12px 32px", borderRadius: "8px", fontSize: "16px", cursor: "pointer" },
  summaryCard: {
    marginTop: "24px",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    background: "#f9fafb"
  },
  summaryTitle: { fontSize: "18px", fontWeight: "bold", marginBottom: "8px" },
  summaryText: { fontSize: "14px", color: "#4b5563" }
}