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
              <small>Auth Comparison</small>
            </div>
          </div>
          <nav className="nav">
            <NavLink to="/" end>00 / Overview</NavLink>
            <NavLink to="/keycloak">01 / Keycloak</NavLink>
            <NavLink to="/supertokens">02 / SuperTokens</NavLink>
            <NavLink to="/better-auth">03 / Better Auth</NavLink>
          </nav>
          <div className="header-meta">Local demo &middot; v0.2</div>
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
            Noah Controls<br />Auth Comparison
          </div>
          <div className="footer-meta">
            <span>Three providers, one demo</span>
            <span>Self-hosted, runs locally</span>
            <span>Internal review</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
