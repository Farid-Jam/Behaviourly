# Presage SDK: Real-Time Progress & Stress (“Vibes”) – Plan

## Is it possible?

**Yes, with one constraint:** Presage has no **browser/JavaScript SDK**. So you get “real-time” in two ways:

| Approach | Where it runs | What you get |
|----------|----------------|--------------|
| **True real-time (30 Hz)** | Native app only | Android / iOS / C++ SDKs give live vitals from the camera on-device. Not in a web app. |
| **Near–real-time (every 20–30 sec)** | Your backend + web frontend | Upload short video chunks to Presage’s **Physiology API** (Python or REST). Get HR, breathing rate, HRV back and show “vibes” / stress in the UI. |

For your **current web app** (React + camera recording), the practical option is **near–real-time**: send chunks of video to your backend, backend calls Presage, returns vitals, and you show a live-updating stress/vibes indicator.

---

## What Presage gives you (stress / “vibes”)

From the **Physiology API** (video upload → async result):

- **HR** (heart rate) and **RR** (respiration rate) over time in the video.
- **HRV** (heart rate variability) – often used as a **stress** proxy (low HRV → higher stress).
- Optional: `hr_trace`, `rr_trace`, `hrv`, `phasic`, etc., depending on the API.

You can turn that into “vibes” or a stress level, e.g.:

- **Calm** – HR in range, HRV high.
- **Elevated** – HR a bit high or HRV lower.
- **High stress** – HR high, HRV low.

Rules can be simple thresholds (e.g. HRV &lt; X → “Elevated”) or a small formula.

---

## High-level flow (web, near–real-time)

1. **During the interview**
   - Frontend records video (you already do this).
   - Every **20–30 seconds** (or at “end of answer” per question), send the **last 20–30 s of video** (or the segment for that question) to your backend (e.g. `POST /presage/analyze` with multipart video).
2. **Backend**
   - Saves the chunk to a temp file (or uses a buffer).
   - Calls Presage:
     - **Python:** `physio.queue_processing_hr_rr(path, preprocess=True, compress=True)` → get `video_id` → poll `physio.retrieve_result(video_id)` until done (they suggest waiting ~half the video length).
     - Or use Presage **REST API** directly if you have the spec and want to avoid the Python client.
   - Reads HR, RR, HRV from the result.
   - Maps to a simple “vibes”/stress level (e.g. from HRV).
   - Sends back to frontend (e.g. WebSocket or polling): `{ heartRate, breathingRate, hrv, stressLevel }`.
3. **Frontend**
   - Shows a **live “vibes” / stress** widget that updates as each chunk result arrives (e.g. “Calm”, “Elevated”, “High stress” + optional mini chart).
   - On the **results page**, you already have heart rate and breathing rate per question; you’d feed this same Presage data (and optional stress) into that view.

So: **real-time progress** = periodic updates every 20–30 s (or per question); **vibes** = stress derived from Presage vitals (especially HRV).

---

## Backend sketch (FastAPI)

- **`POST /presage/analyze`**
  - Input: multipart form with **video file** (e.g. last 20–30 s or one question’s segment).
  - Steps:
    1. Save to temp file (AVI/MOV/MP4; Presage supports these).
    2. `physio = Physiology(PRESAGE_API_KEY)`, then `video_id = physio.queue_processing_hr_rr(path, preprocess=True, compress=True)`.
    3. Poll `physio.retrieve_result(video_id)` until ready (with timeout and backoff).
    4. From result, take `hr`, `rr`, and if available `hrv` (or similar); compute a simple stress level.
    5. Return JSON, e.g. `{ "heartRate": ..., "breathingRate": ..., "hrv": ..., "stressLevel": "calm" | "elevated" | "high" }`.
  - Optional: WebSocket endpoint that the frontend connects to; backend pushes these results as each chunk finishes.

- **Env:** `PRESAGE_API_KEY` in backend `.env` (from [Presage developer portal](https://physiology.presagetech.com/auth/register)).

---

## Frontend sketch

- **During interview**
  - When using “chunked” mode: every 20–30 s (or on “Complete” for the current question), take the **recorded blob** for that window (or the whole answer), send to `POST /presage/analyze`, then update local state with the returned vitals and stress level.
  - Show a small **“Vibes”** or **“Stress”** component that updates with the latest `stressLevel` (and optional HR/RR/HRV).
- **Results page**
  - You already have `recordings` with `heartRate` and `breathingRate` per question. Once the backend fills these from Presage (and optionally adds `stressLevel` or HRV), the existing charts and copy (“Presage metrics from each question”) will reflect real data. Add a “Stress” or “Vibes” series/column if you want it per question.

---

## Dependency blocker (Python)

Your `requirements.txt` has:

```text
# presage_technologies>=1.6.0  # blocked: requires mediapipe==0.9.1.0 (removed from PyPI)
```

So:

1. **Option A – Presage REST API**  
   If Presage exposes a **REST API** for video upload and result retrieval (same as the Python client but over HTTP), you can implement the same flow in your backend with `requests` (or httpx) and avoid the Python client and mediapipe entirely. Check [Presage Physiology API docs](https://docs.physiology.presagetech.com) or ask Presage support.

2. **Option B – Unblock the Python client**  
   - Use a **PyPI mirror** that still has `mediapipe==0.9.1.0` (e.g. [StableBuild](https://dashboard.stablebuild.com/pypi-deleted-packages/pkg/mediapipe/0.9.0.1)), or  
   - Ask **Presage** if they have a build of `presage_technologies` that works with a newer mediapipe (or without it, if they’ve updated the pipeline).

3. **Option C – Separate service**  
   Run the Presage Python client in a **separate service** (e.g. a small Python worker or Lambda) that has the old deps in a dedicated env, and call it from your main backend via HTTP or a queue.

---

## Summary

| Goal | Possible? | How |
|------|------------|-----|
| Real-time progress during interview (web) | Yes, **near–real-time** | Send video chunks every 20–30 s (or per question) → backend → Presage API → return HR/RR/HRV → show in UI. |
| “Vibes” / stress from Presage | Yes | Use HR/HRV (and optionally RR) from Presage; map to labels (e.g. Calm / Elevated / High stress). |
| True 30 Hz real-time in browser | No | Would require Presage to offer a browser SDK; they only have Android, Swift, C++. |
| Use Presage on your existing videos | Yes | Same backend endpoint; feed in recorded segments (e.g. per question) and show results on Interview Results page. |

If you want to proceed, the next concrete steps are: (1) unblock Presage (REST vs Python client vs mirror), (2) add `POST /presage/analyze` (and optional WebSocket), (3) add the “Vibes”/stress UI and wire it to that endpoint, and (4) connect the results page to the same Presage data.
