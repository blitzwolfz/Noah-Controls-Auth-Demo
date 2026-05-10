import { NavLink, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import KeycloakDemo from './pages/KeycloakDemo';
import SuperTokensDemo from './pages/SuperTokensDemo';
import BetterAuthDemo from './pages/BetterAuthDemo';

export default function App() {
  return (
    <div className="app-shell">
      <header className="header">
        <div className="brand">
          <div className="brand-mark">N</div>
          <div>
            <div className="brand-name">Noah Controls</div>
            <div className="brand-sub">Auth Provider Demo</div>
          </div>
        </div>
        <nav className="nav">
          <NavLink to="/" end>Overview</NavLink>
          <NavLink to="/keycloak">Keycloak</NavLink>
          <NavLink to="/supertokens">SuperTokens</NavLink>
          <NavLink to="/better-auth">Better Auth</NavLink>
        </nav>
      </header>
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/keycloak" element={<KeycloakDemo />} />
          <Route path="/supertokens" element={<SuperTokensDemo />} />
          <Route path="/better-auth" element={<BetterAuthDemo />} />
        </Routes>
      </main>
      <footer className="footer">
        Built for Noah Controls. Local development demo only.
      </footer>
    </div>
  );
}
