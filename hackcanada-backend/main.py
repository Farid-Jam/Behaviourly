from google import genai
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import json
from typing import Optional
from datetime import datetime
from interview_context import router as interview_context_router

app = FastAPI()

#allows us to connect to apps
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(interview_context_router)

# Configure Gemini
client = genai.Client(api_key="AIzaSyDgSDjEuMgYk6eaPOvBdjcpc2gp4POwUrM")


#how are we gonna score them
SCORING_RULES = {
    "filler_word": -2,
    "eye_contact_lost": -3,
    "high_stress": -2,
    "low_focus": -2,
    "good_posture": +2,
    "strong_answer": +5,
    "mediocre_answer": +2,
    "weak_answer": -3,
}

# In-memory session log
session_log = []


#generating a mock interview
@app.post("/mock-interview")
async def mock_interview(body: dict):
    role = body.get("role", "software engineer")
    num_questions = body.get("num_questions", 5)

    prompt = f"""
    Generate {num_questions} common interview questions for a {role} position.
    Mix behavioral, technical, and situational questions.
    Return ONLY a JSON array of strings, no extra text, no markdown.
    Example: ["Tell me about yourself.", "Describe a challenge you overcame."]
    """
    try:
        response = client.models.generate_content(
            model="gemini-3.1-pro-preview", contents=prompt
        )
        text = response.text.strip().replace("```json", "").replace("```", "")
        questions = json.loads(text)
        return JSONResponse({"questions": questions})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
    
def _get_tip(triggered: list) -> Optional[str]:
    if "eye_contact_lost" in triggered:
        return "Look at the camera 👀"
    if "filler_word" in triggered:
        return "Take a breath before answering 🧘"
    if "high_stress" in triggered:
        return "Slow down, you've got this 💪"
    if "low_focus" in triggered:
        return "Stay present, almost there 🎯"
    if "weak_answer" in triggered:
        return "Use a concrete example next time 💡"
    return None

@app.post("/live-score")
async def live_score(signals: dict):
    delta = 0
    triggered = []

    for signal, active in signals.items():
        if active and signal in SCORING_RULES:
            delta += SCORING_RULES[signal]
            triggered.append(signal)

    # Log lowlight moments
    if delta < 0 and triggered:
        session_log.append(
            {
                "timestamp": datetime.now().isoformat(),
                "triggered": triggered,
                "delta": delta,
                "tip": _get_tip(triggered),
            }
        )

    return JSONResponse(
        {
            "delta": delta,
            "triggered": triggered,
            "tip": _get_tip(triggered),
        }
    )
