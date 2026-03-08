import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./HomePage.css";

const MOCK_INTERVIEWS = [
  {
    id: "1",
    company: "Google",
    role: "Software Developer",
    date: "March 25, 2026",
    distance: "1.2 miles",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&q=80",
    blurb: "Behavioral and technical mix. Practice STAR-format answers and system design basics.",
  },
  {
    id: "2",
    company: "Shopify",
    role: "Cloud Engineer",
    date: "April 12, 2026",
    distance: "2.1 miles",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
    blurb: "Focus on ownership and scaling. Expect questions on reliability and past projects.",
  },
  {
    id: "3",
    company: "Meta",
    role: "Frontend Engineer",
    date: "April 20, 2026",
    distance: "0.8 miles",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80",
    blurb: "Culture-fit and impact. Be ready to discuss tradeoffs and working with cross-functional teams.",
  },
];

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const name = user?.name?.split(" ")[0] || user?.nickname || "there";

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-header-text">
          <p className="home-greeting-label">Your dashboard</p>
          <h1 className="home-greeting">Hey {name}, ready to practice?</h1>
          <div className="home-meta">
            <span>{formatDate()}</span>
            <span className="home-meta-dot">·</span>
            <span>{MOCK_INTERVIEWS.length} interviews in the pipeline</span>
          </div>
        </div>
        {user?.picture && (
          <div className="home-avatar">
            <img src={user.picture} alt="" />
          </div>
        )}
      </header>
      <section className="home-section">
        <h2 className="home-section-title">Pick a company & start</h2>
        <ul className="home-cards">
          {MOCK_INTERVIEWS.map((job, i) => (
            <li key={job.id} className="home-card" style={{ animationDelay: `${0.1 * i}s` }}>
              <div
                className="home-card-image"
                style={{ backgroundImage: `url(${job.image})` }}
              >
                <div className="home-card-overlay">
                  <span className="home-card-company">{job.company}</span>
                  <span className="home-card-role">{job.role}</span>
                </div>
              </div>
              <div className="home-card-body">
                {job.blurb && (
                  <p className="home-card-blurb">{job.blurb}</p>
                )}
                <div className="home-card-meta">
                  <span>{job.date}</span>
                  <span>{job.distance}</span>
                </div>
                <button
                  type="button"
                  className="home-card-practice"
                  onClick={() => navigate("/interview-context", { state: { company: job.company, role: job.role } })}
                >
                  Practice
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
