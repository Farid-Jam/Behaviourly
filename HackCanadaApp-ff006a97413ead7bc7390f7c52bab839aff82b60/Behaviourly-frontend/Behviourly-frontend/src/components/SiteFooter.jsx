import "./SiteFooter.css";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-links">
          <a href="/terms">Terms of Service</a>
          <a href="/privacy">Privacy Policy</a>
        </div>
        <p className="site-footer-copy">© {new Date().getFullYear()} Behaviourly. Mock interview practice with AI feedback.</p>
      </div>
    </footer>
  );
}
