import { useAuth0 } from "@auth0/auth0-react";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user, logout, isAuthenticated } = useAuth0();

  if (!isAuthenticated || !user) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <p className="profile-guest">You’re not signed in. Sign-in can be enabled later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">
          {user.picture ? (
            <img src={user.picture} alt="" />
          ) : (
            <span>{user.name?.charAt(0) || user.nickname?.charAt(0) || "?"}</span>
          )}
        </div>
        <h1 className="profile-name">{user.name || "User"}</h1>
        {user.email && (
          <p className="profile-email">{user.email}</p>
        )}
        {user.nickname && user.nickname !== user.name && (
          <p className="profile-nickname">@{user.nickname}</p>
        )}
        <button className="profile-logout" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
          Sign out
        </button>
      </div>
    </div>
  );
}
