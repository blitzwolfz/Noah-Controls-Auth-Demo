import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Marker from '../components/Marker';
import { KeycloakMark } from '../components/Marks';

type Tokens = { access_token: string; refresh_token: string; expires_in: number };
const STORAGE_KEY = 'noah-keycloak-tokens';

export default function KeycloakDemo() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('demo@noahcontrols.local');
  const [password, setPassword] = useState('demo1234');
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const [profile, setProfile] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setTokens(JSON.parse(raw));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/keycloak/${mode}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Request failed');
      setTokens(data.tokens);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.tokens));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function fetchProfile() {
    if (!tokens) return;
    setError(null);
    try {
      const res = await fetch('/api/keycloak/profile', {
        headers: { authorization: `Bearer ${tokens.access_token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Could not fetch profile');
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function logout() {
    if (!tokens) return;
    await fetch('/api/keycloak/logout', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ refreshToken: tokens.refresh_token }),
    });
    setTokens(null);
    setProfile(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <div className="provider-page">
      <header className="provider-head">
        <div className="provider-eyebrow">
          <Link to="/">&larr; Back to overview</Link>
        </div>
        <h1 className="provider-title">
          Keycloak<br />
          <span style={{ color: 'var(--orange)' }}>runs auth</span><br />
          like an org.
        </h1>
        <div className="provider-mark-wrap" style={{ color: 'var(--orange)' }}>
          <KeycloakMark size={140} />
        </div>
        <p className="provider-thesis">
          A standalone identity server with the protocols enterprise procurement
          asks for: SAML, OIDC, LDAP federation, and a realm model that gives
          each customer its own users without spreading them across databases.
        </p>
        <div className="provider-callouts">
          <strong>Origin:</strong> Red Hat, 2014
          <span>Runtime: Java / Quarkus</span>
          <span>License: Apache 2.0</span>
          <span>Deploy: container + Postgres</span>
        </div>
      </header>

      <div className="provider-grid">
        <Marker num="01" label="Strengths, watchouts, fit" />
        <div className="three-cols">
          <div data-accent="orange">
            <h4>Strengths</h4>
            <ul>
              <li>Full SAML 2.0 identity provider and broker</li>
              <li>LDAP and Active Directory user federation</li>
              <li>Admin console covers realms, clients, roles, scopes</li>
              <li>Fine-grained authorization with UMA 2.0</li>
            </ul>
          </div>
          <div>
            <h4>Watch outs</h4>
            <ul>
              <li>JVM footprint and cold start cost</li>
              <li>Config surface is large, easy to misconfigure</li>
              <li>Theming and UX require effort to feel modern</li>
              <li>Upgrades occasionally break realm exports</li>
            </ul>
          </div>
          <div data-accent="brick">
            <h4>Best fit</h4>
            <ul>
              <li>B2B with SSO checkboxes in the contract</li>
              <li>Multi-tenant SaaS with hard customer separation</li>
              <li>Internal app gateway in front of many services</li>
              <li>Teams already running a JVM stack</li>
            </ul>
          </div>
        </div>

        <Marker num="02" label="The one thing it does that the others can't" />
        <section className="standout" data-accent="orange">
          <div>
            <span className="standout-eyebrow">Distinctive / Federation</span>
            <h3>Acts as the IdP for the rest of your stack.</h3>
            <p style={{ marginTop: 18 }}>
              Keycloak can be the SAML identity provider for your customers'
              corporate directory while simultaneously brokering Google,
              GitHub, and a partner OIDC server. Other services in the demo
              authenticate end users. Keycloak authenticates other services.
            </p>
          </div>
          <div className="standout-figure">
            <svg width="320" height="240" viewBox="0 0 320 240" fill="none">
              <circle cx="160" cy="120" r="48" fill="#0e0e0c" />
              <rect x="152" y="120" width="40" height="6" fill="#f2ede0" />
              <rect x="188" y="120" width="6" height="14" fill="#f2ede0" />
              <line x1="160" y1="20" x2="160" y2="64" stroke="#0e0e0c" strokeWidth="2" />
              <line x1="160" y1="176" x2="160" y2="220" stroke="#0e0e0c" strokeWidth="2" />
              <line x1="40" y1="120" x2="112" y2="120" stroke="#0e0e0c" strokeWidth="2" />
              <line x1="208" y1="120" x2="280" y2="120" stroke="#0e0e0c" strokeWidth="2" />
              <rect x="140" y="4" width="40" height="20" stroke="#0e0e0c" strokeWidth="2" fill="#f2ede0" />
              <rect x="140" y="216" width="40" height="20" stroke="#0e0e0c" strokeWidth="2" fill="#f2ede0" />
              <rect x="20" y="110" width="22" height="22" stroke="#0e0e0c" strokeWidth="2" fill="#f2ede0" />
              <rect x="278" y="110" width="22" height="22" stroke="#0e0e0c" strokeWidth="2" fill="#f2ede0" />
            </svg>
          </div>
        </section>

        <Marker num="03" label="Live demo / Password grant" />
        <section className="demo-wrap">
          <div className="demo-left">
            {!tokens ? (
              <>
                <div className="tab-switch">
                  <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Log in</button>
                  <button className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>Sign up</button>
                </div>
                {error && <div className="alert error">{error}</div>}
                <form className="form" onSubmit={submit}>
                  <label>Email
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </label>
                  <label>Password
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </label>
                  <button className="btn" disabled={busy} type="submit">
                    <span>{busy ? 'Working' : mode === 'login' ? 'Authenticate' : 'Create account'}</span>
                    <span>&rarr;</span>
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="alert success">Authenticated. Access token good for {tokens.expires_in}s.</div>
                {error && <div className="alert error">{error}</div>}
                <div className="btn-row">
                  <button className="btn" onClick={fetchProfile}>
                    <span>Fetch profile</span><span>&rarr;</span>
                  </button>
                  <button className="btn secondary" onClick={logout}>
                    <span>Log out</span><span>&times;</span>
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="demo-right">
            <div className="demo-status">Response / live</div>
            <pre>{profile ? JSON.stringify(profile, null, 2) : tokens ? '// click fetch profile to call /api/keycloak/profile with the bearer token' : '// sign in to see the token response'}</pre>
          </div>
        </section>
      </div>
    </div>
  );
}
