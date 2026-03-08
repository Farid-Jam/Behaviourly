import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./LoginPage.css";

export default function LoginPage() {
  const { loginWithRedirect } = useAuth0();
  const [email, setEmail] = useState("");

  const handleContinue = () => {
    loginWithRedirect({
      ...(email && { login_hint: email }),
    });
  };

  const handleGoogle = () => {
    loginWithRedirect({ connection: "google-oauth2" });
  };

  const handleApple = () => {
    loginWithRedirect({ connection: "apple" });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-brand">Behaviourly</h1>
        <h2 className="login-heading">Create an account</h2>
        <p className="login-sub">Enter your email to sign up for this app</p>
        <input
          type="email"
          placeholder="email@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />
        <button className="login-continue-btn" onClick={handleContinue}>
          Continue
        </button>
        <div className="login-divider">
          <span>or</span>
        </div>
        <button
          type="button"
          className="login-social-btn login-google"
          onClick={handleGoogle}
        >
          <span className="login-social-icon">G</span>
          Continue with Google
        </button>
        <button
          type="button"
          className="login-social-btn login-apple"
          onClick={handleApple}
        >
          <span className="login-social-icon"></span>
          Continue with Apple
        </button>
        <p className="login-legal">
          By clicking continue, you agree to our{" "}
          <a href="/terms">Terms of Service</a> and{" "}
          <a href="/privacy">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
