import { NavLink, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import KeycloakDemo from './pages/KeycloakDemo';
import SuperTokensDemo from './pages/SuperTokensDemo';
import BetterAuthDemo from './pages/BetterAuthDemo';

export default function App() {
  return (
    <div className="shell">
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-mark" aria-hidden />
            <div className="brand-text">
              Noah Controls
              <small>Auth / Study 001</small>
            </div>
          </div>
          <nav className="nav">
            <NavLink to="/" end>00 / Overview</NavLink>
            <NavLink to="/keycloak">01 / Keycloak</NavLink>
            <NavLink to="/supertokens">02 / SuperTokens</NavLink>
            <NavLink to="/better-auth">03 / Better Auth</NavLink>
          </nav>
          <div className="header-meta">
            Build &middot; v0.1 &middot; Local
          </div>
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/keycloak" element={<KeycloakDemo />} />
          <Route path="/supertokens" element={<SuperTokensDemo />} />
          <Route path="/better-auth" element={<BetterAuthDemo />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            Noah Controls<br />Auth Study
          </div>
          <div className="footer-meta">
            <span>Self-hosted comparison rig</span>
            <span>Drafted for internal review</span>
            <span>v0.1.0 / 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
