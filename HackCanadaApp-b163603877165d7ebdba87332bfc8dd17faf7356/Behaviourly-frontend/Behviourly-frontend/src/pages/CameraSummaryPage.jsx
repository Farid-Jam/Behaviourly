import { useLocation, useNavigate } from "react-router-dom";
import "./CameraSummaryPage.css";

export default function CameraSummaryPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const recordingUrl = state?.recordingUrl;
  const company = state?.company;
  const role = state?.role;

  return (
    <div className="camera-summary-page">
      <header className="camera-summary-header">
        <p className="camera-summary-label">Practice interview</p>
        <h1 className="camera-summary-title">Interview Summary</h1>
        {company && role && (
          <p className="camera-summary-meta">
            {company} · {role}
          </p>
        )}
      </header>

      <section className="camera-summary-section">
        {recordingUrl && (
          <div className="camera-summary-video-wrap">
            <video
              src={recordingUrl}
              controls
              playsInline
              className="camera-summary-video"
            />
          </div>
        )}
        <p className="camera-summary-text">
          Your recording has been saved. Review it above or start a new practice session.
        </p>
        <div className="camera-summary-actions">
          <button
            type="button"
            className="camera-summary-btn camera-summary-btn--primary"
            onClick={() => navigate("/camera", { state: { company, role } })}
          >
            Record again
          </button>
          <button
            type="button"
            className="camera-summary-btn camera-summary-btn--secondary"
            onClick={() => navigate("/home")}
          >
            Back to dashboard
          </button>
        </div>
      </section>
    </div>
  );
}
