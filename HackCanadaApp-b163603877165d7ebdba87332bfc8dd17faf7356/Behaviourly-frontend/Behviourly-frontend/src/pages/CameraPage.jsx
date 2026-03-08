import { useLocation, useNavigate } from "react-router-dom";
import Camera from "../Camera";
import "./CameraPage.css";

export default function CameraPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const company = state?.company;
  const role = state?.role;

  function handleRecordingComplete(blob, url) {
    navigate("/camera/summary", {
      state: { recordingUrl: url, company, role },
      replace: false,
    });
  }

  return (
    <div className="camera-page">
      <header className="camera-header">
        <div className="camera-header-text">
          <p className="camera-header-label">Practice interview</p>
          <h1 className="camera-header-title">
            {company && role ? (
              <>
                {company} · {role}
              </>
            ) : (
              "Ready when you are"
            )}
          </h1>
          <p className="camera-header-desc">
            Allow camera and microphone, then start your mock interview. Stop when you’re done to save the recording.
          </p>
        </div>
      </header>

      <section className="camera-section">
        <Camera onRecordingComplete={handleRecordingComplete} />
      </section>
    </div>
  );
}
