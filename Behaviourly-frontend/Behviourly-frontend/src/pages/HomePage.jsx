import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import "./HomePage.css";

const CARD_IMAGES = [
  "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80"
];

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default function HomePage() {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useUser();
  const [interviews, setInterviews] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  
  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Use the name from your Auth0 profile
  const name = user?.name?.split(" ")[0] || "there";

  function fetchInterviews() {
    if (!user) {
      setInterviews([]);
      setDataLoading(false);
      return;
    }

    setDataLoading(true);
    fetch("http://localhost:8000/interviews", {
      credentials: "include", // Required for Flask session cookies
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setInterviews(data);
        else setInterviews([]);
      })
      .catch((err) => {
        console.error("Failed to fetch interviews:", err);
      })
      .finally(() => setDataLoading(false));
  }

  useEffect(() => {
    if (!userLoading) {
      fetchInterviews();
    }
  }, [user, userLoading]);

  function closeCreateModal() {
    setShowCreateModal(false);
    setSubmitError("");
    setCompanyName("");
    setRoleName("");
    setDescription("");
  }

  async function handleCreateInterview(e) {
    e.preventDefault();
    setSubmitError("");

    const payload = {
      company: companyName.trim(),
      role: roleName.trim(),
      description: description.trim(),
    };

    if (!payload.company || !payload.role || !payload.description) {
      setSubmitError("Please fill in all fields.");
      return;
    }

    setSubmitLoading(true);
    try {
      const res = await fetch("http://localhost:8000/interviews", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Failed to create interview.");
      }

      setInterviews((prev) => [data, ...prev]);
      closeCreateModal();
    } catch (err) {
      setSubmitError(err.message || "Failed to create interview.");
    } finally {
      setSubmitLoading(false);
    }
  }

  if (userLoading || dataLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-header-text">
          <p className="home-greeting-label">Your dashboard</p>
          <h1 className="home-greeting">Hey {name}, ready to practice?</h1>
          <div className="home-meta">
            <span>{formatDate()}</span>
            <span className="home-meta-dot">·</span>
            <span>{interviews.length} interviews detected</span>
          </div>
        </div>
        {user?.picture && (
          <div className="home-avatar">
            <img src={user.picture} alt="Profile" />
          </div>
        )}
      </header>

      <section className="home-section">
        <div className="home-section-head">
          <h2 className="home-section-title">Detected Interviews</h2>
          <button
            type="button"
            className="home-add-btn"
            onClick={() => setShowCreateModal(true)}
            aria-label="Add interview"
          >
            +
          </button>
        </div>
        {interviews.length === 0 ? (
          <div className="empty-state-wrap">
            <p className="empty-state">No interviews found yet. We're scanning your inbox!</p>
            <p className="empty-state-hint">You can still practice with AI-generated questions for any company and role.</p>
            <button
              type="button"
              className="home-card-practice empty-state-cta"
              onClick={() => setShowCreateModal(true)}
            >
              Start a practice interview
            </button>
          </div>
        ) : (
          <ul className="home-cards">
            {interviews.map((job, i) => {
              // Cycle through the 3 images based on the index
              const imageUrl = CARD_IMAGES[i % CARD_IMAGES.length];
              
              return (
                <li key={job.id} className="home-card" style={{ animationDelay: `${0.1 * i}s` }}>
                  <div 
                    className="home-card-image company-placeholder"
                    style={{ 
                      backgroundImage: `url(${imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                     <div className="home-card-overlay">
                      <span className="home-card-company">{job.company}</span>
                      <span className="home-card-role">{job.role}</span>
                    </div>
                  </div>
                  <div className="home-card-body">
                    <p className="home-card-blurb">
                      {job.summary || `AI has prepared questions for your ${job.role} role at ${job.company}.`}
                    </p>
                    <div className="home-card-meta">
                      <span>{job.interview_date || "Date TBD"}</span>
                      <span className="type-tag">{job.interview_type}</span>
                    </div>
                      <button
                        type="button"
                        className="home-card-practice"
                        onClick={() => navigate("/interview-context", { state: { interviewId: job.id, company: job.company, role: job.role } })}
                      >
                        View Prep Kit
                      </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* --- Create Interview Modal --- */}
      {showCreateModal && (
        <div className="home-modal-overlay" role="dialog" aria-modal="true" aria-label="Create interview">
          <div className="home-modal-card">
            <h3 className="home-modal-title">Add interview</h3>
            <form onSubmit={handleCreateInterview} className="home-modal-form">
              <label>
                Company Name
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Shopify"
                />
              </label>

              <label>
                Position / Role
                <input
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="e.g. Software Engineer Intern"
                />
              </label>

              <label>
                Description of interview type
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Behavioral first-round focused on teamwork and communication"
                />
              </label>

              {submitError && <p className="home-modal-error">{submitError}</p>}

              <div className="home-modal-actions">
                <button type="button" className="home-modal-btn home-modal-btn--secondary" onClick={closeCreateModal}>
                  Cancel
                </button>
                <button type="submit" className="home-modal-btn home-modal-btn--primary" disabled={submitLoading}>
                  {submitLoading ? "Creating..." : "Create interview"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}