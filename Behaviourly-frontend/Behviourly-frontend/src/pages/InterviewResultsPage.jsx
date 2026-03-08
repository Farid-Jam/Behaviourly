import { useLocation, useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./InterviewResultsPage.css";

export default function InterviewResultsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const recordings = state?.recordings || [];

  const chartData = recordings.map((r) => ({
    name: r.question,
    "Heart rate (bpm)": r.heartRate ?? undefined,
    "Breathing rate (/min)": r.breathingRate ?? undefined,
  }));

  const hasAnyData = recordings.some(
    (r) => r.heartRate != null || r.breathingRate != null
  );

  return (
    <div className="interview-results-page">
      <header className="interview-results-header">
        <h1 className="interview-results-title">Interview Vitals</h1>
        <p className="interview-results-subtitle">
          Presage metrics from each question
        </p>
      </header>

      <section className="interview-results-charts">
        {!hasAnyData && recordings.length === 0 && (
          <p className="interview-results-empty">No recording data yet.</p>
        )}
        {recordings.length > 0 && !hasAnyData && (
          <p className="interview-results-empty">
            Analyzing recordings with Presage… Check back shortly or ensure
            PRESAGE_API_KEY is set on the backend.
          </p>
        )}
        {hasAnyData && (
          <>
            <div className="interview-results-chart-wrap">
              <h3 className="interview-results-chart-title">Heart rate (bpm)</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData} margin={{ top: 16, right: 24, left: 16, bottom: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, "auto"]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="Heart rate (bpm)" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="interview-results-chart-wrap">
              <h3 className="interview-results-chart-title">Breathing rate (/min)</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData} margin={{ top: 16, right: 24, left: 16, bottom: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, "auto"]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="Breathing rate (/min)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </section>

      <div className="interview-results-actions">
        <button
          type="button"
          className="interview-results-btn"
          onClick={() => navigate("/home")}
        >
          Back to dashboard
        </button>
        <button
          type="button"
          className="interview-results-btn interview-results-btn--primary"
          onClick={() => navigate("/interview-context", { state: state?.contextState })}
        >
          New interview
        </button>
      </div>
    </div>
  );
}
