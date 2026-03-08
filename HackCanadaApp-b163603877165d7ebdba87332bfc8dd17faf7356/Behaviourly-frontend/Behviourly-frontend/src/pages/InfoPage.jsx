import { useNavigate } from "react-router-dom";
import "./InfoPage.css";

const SEEN_INFO_KEY = "behaviourly_seen_info";

const FEATURE_CARDS = [
  {
    title: "Interview notifications",
    icon: "bell",
    desc: "24/7 email tracking sends you WhatsApp alerts the moment an interview invitation arrives. Never miss a follow-up or offer—get notified and start preparing right away.",
  },
  {
    title: "Mock interviews",
    icon: "video",
    desc: "AI-powered practice sessions with company-specific behavioral questions tailored to your opportunity. Record yourself on camera and get ready for the real thing.",
    cta: "Start practicing",
  },
  {
    title: "AI feedback report",
    icon: "chart",
    desc: "More than a score. Get a multi-layered analysis of your performance: eye contact, composure, speech clarity, and confidence—with a clear path to improve before the interview.",
  },
];

const FEEDBACK_CARDS = [
  {
    pill: "Content & relevance",
    question: "How well did you answer the question?",
    desc: "We cross-reference your response with key points for substance and relevance.",
    stat: "+95%",
    statLabel: "Reduction in missed key points",
    title: "Content & relevance analysis",
    subDesc: "See what you covered well and what you missed, so every answer is on-topic and impactful.",
  },
  {
    pill: "Speech & clarity",
    question: "How clear and confident did you sound?",
    desc: "We analyze filler words, pace, and grammar that can hurt credibility—with coaching to improve.",
    stat: "+90%",
    statLabel: "Improvement in speech clarity",
    title: "Clarity & speech analysis",
    subDesc: "Refine how you speak so you sound clear and confident, not rushed or hesitant.",
  },
  {
    pill: "Confidence & presence",
    question: "How confident did you come across?",
    desc: "We measure eye contact, composure, and energy to gauge perceived confidence from start to finish.",
    stat: "+40%",
    statLabel: "Increase in perceived confidence",
    title: "Confidence & presence analysis",
    subDesc: "Spot moments where energy drops so you can project authentic confidence in the real interview.",
  },
];

const POWERED_BY = ["Gemini", "Presage", "ElevenLabs", "Auth0"];

const FLOATING_STATS = [
  { label: "Eye contact", value: "94%" },
  { label: "Speech clarity", value: "90%" },
  { label: "Composure", value: "Low stress" },
  { label: "Confidence", value: "Live score" },
  { label: "Gaze consistency", value: "88%" },
];

function IconBell() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function IconVideo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function IconRocket() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function IconBrain() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  );
}

function FeatureIcon({ name }) {
  const className = "info-icon-wrap";
  if (name === "bell") return <span className={className}><IconBell /></span>;
  if (name === "video") return <span className={className}><IconVideo /></span>;
  if (name === "chart") return <span className={className}><IconChart /></span>;
  return null;
}

export default function InfoPage() {
  const navigate = useNavigate();

  const goToDashboard = () => {
    localStorage.setItem(SEEN_INFO_KEY, "true");
    navigate("/home");
  };

  return (
    <div className="info-page">
      {/* Hero — banner + headline + CTA (ref 3) */}
      <section className="info-hero">
        <div className="info-hero-inner">
          <div className="info-hero-floats">
            {FLOATING_STATS.map((stat, i) => (
              <div key={stat.label} className={`info-hero-float info-hero-float--${i + 1}`}>
                <span className="info-hero-float-label">{stat.label}</span>
                <span className="info-hero-float-value">{stat.value}</span>
              </div>
            ))}
          </div>
          <div className="info-hero-content">
            <div className="info-hero-banner">
              <span className="info-hero-banner-tag">#1 AI-Powered Interview Prep</span>
              <span className="info-hero-banner-arrow">Get ready for your next interview →</span>
            </div>
            <h1 className="info-hero-title">
              The smartest way to <span className="info-hero-title-accent">prepare for your job interview</span>
            </h1>
            <p className="info-hero-desc">
              Boost your confidence with realistic AI-powered mock interviews and land your dream job.
            </p>
            <button type="button" className="info-hero-cta" onClick={goToDashboard}>
              <IconRocket />
              Try it for free
            </button>
            <p className="info-hero-proof">Start your first mock interview in minutes — free to try</p>
          </div>
        </div>
      </section>

      {/* Three feature cards (ref 1) */}
      <section className="info-cards">
        <div className="info-cards-inner">
          {FEATURE_CARDS.map((card) => (
            <article key={card.title} className="info-card">
              <div className="info-card-icon-wrap">
                <FeatureIcon name={card.icon} />
              </div>
              <h3 className="info-card-title">{card.title}</h3>
              <p className="info-card-desc">{card.desc}</p>
              {card.cta && (
                <button type="button" className="info-card-cta" onClick={goToDashboard}>
                  {card.cta}
                </button>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Benefits section + intro (ref 1) */}
      <section className="info-benefits">
        <div className="info-benefits-inner">
          <div className="info-benefits-header">
            <span className="info-benefits-pill">Benefits</span>
            <span className="info-benefits-arrow">Your path to interview success →</span>
          </div>
          <h2 className="info-benefits-title">
            Unlock your interview success: powerful features designed for you
          </h2>
          <p className="info-benefits-desc">
            Prepare for your next job interview with confidence using Behaviourly. Designed to simulate real interview scenarios and provide actionable feedback, our platform helps you master your interview skills and land your dream job.
          </p>
        </div>
      </section>

      {/* Three feedback analysis cards (ref 2) */}
      <section id="info-features" className="info-feedback">
        <div className="info-feedback-inner">
          <h2 className="info-feedback-main-title">
            More than a score: your personal AI feedback report
          </h2>
          <p className="info-feedback-intro">
            Our feedback system does more than tell you if an answer was “good” or “bad.” It gives you a multi-layered analysis of your performance, a clear picture of your strengths, and a path to improve. Explore the components of your report below.
          </p>
          <div className="info-feedback-grid">
            {FEEDBACK_CARDS.map((card) => (
              <article key={card.title} className="info-feedback-card">
                <span className="info-feedback-pill">+ {card.pill}</span>
                <p className="info-feedback-question">{card.question}</p>
                <p className="info-feedback-desc">{card.desc}</p>
                <div className="info-feedback-stat-wrap">
                  <span className="info-feedback-stat">{card.stat}</span>
                  <span className="info-feedback-stat-label">{card.statLabel}</span>
                </div>
                <h3 className="info-feedback-card-title">{card.title}</h3>
                <p className="info-feedback-card-desc">{card.subDesc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Powered by */}
      <section className="info-powered">
        <div className="info-powered-inner">
          <p className="info-powered-label">Powered by</p>
          <div className="info-powered-names">
            {POWERED_BY.map((name) => (
              <span key={name} className="info-powered-name">{name}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
