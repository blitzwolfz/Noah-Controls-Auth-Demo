import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Marker from '../components/Marker';
import { KeycloakMark } from '../components/Marks';

type Tokens = { access_token: string; refresh_token: string; expires_in: number };
type Profile = {
  provider: string;
  user: { id: string; email: string; name: string };
  realm?: string;
  roles?: string[];
  clientRoles?: Record<string, { roles: string[] }>;
  accountConsole?: string;
};
const STORAGE_KEY = 'noah-keycloak-tokens';

export default function KeycloakDemo() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('demo@noahcontrols.local');
  const [password, setPassword] = useState('demo1234');
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
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
          is a <span style={{ color: 'var(--orange)' }}>separate</span><br />
          auth server.
        </h1>
        <div className="provider-mark-wrap" style={{ color: 'var(--orange)' }}>
          <KeycloakMark size={140} />
        </div>
        <p className="provider-thesis">
          You run Keycloak as a container next to your app. Users sign in
          through Keycloak. Keycloak hands a signed token back to your app. It
          supports the protocols enterprise IT departments expect: SAML, OIDC,
          and LDAP.
        </p>
        <div className="provider-callouts">
          <strong>Made by:</strong> Red Hat, 2014
          <span>Runtime: Java (Quarkus)</span>
          <span>License: Apache 2.0</span>
          <span>Setup: container plus Postgres</span>
        </div>
      </header>

      <div className="provider-grid">
        <Marker num="01" label="What it is good at, what it costs, when to use it" />
        <div className="three-cols">
          <div data-accent="orange">
            <h4>Strengths</h4>
            <ul>
              <li>Full SAML 2.0 identity provider</li>
              <li>Pulls users from LDAP and Active Directory</li>
              <li>Admin console for realms, users, clients, roles</li>
              <li>Fine-grained authorization rules</li>
            </ul>
          </div>
          <div>
            <h4>Trade-offs</h4>
            <ul>
              <li>Java runtime, slow cold start</li>
              <li>Many config options, easy to set up wrong</li>
              <li>Default theme looks dated, needs custom CSS</li>
              <li>Upgrades sometimes break realm exports</li>
            </ul>
          </div>
          <div data-accent="brick">
            <h4>Best fit</h4>
            <ul>
              <li>B2B SaaS with SSO requirements</li>
              <li>Multi-tenant products that need strict user separation</li>
              <li>Teams already running Java services</li>
              <li>Internal apps that share one identity provider</li>
            </ul>
          </div>
        </div>

        <Marker num="02" label="The feature it is known for" />
        <section className="standout" data-accent="orange">
          <div>
            <span className="standout-eyebrow">Federation</span>
            <h3>Keycloak can be the identity provider for the rest of your stack.</h3>
            <p style={{ marginTop: 18 }}>
              Keycloak can act as a SAML identity provider for one customer's
              Active Directory while brokering Google and GitHub at the same
              time. Other services in your stack sign in end users. Keycloak
              signs in other services.
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
              <text x="160" y="18" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#0e0e0c">SAML</text>
              <rect x="140" y="216" width="40" height="20" stroke="#0e0e0c" strokeWidth="2" fill="#f2ede0" />
              <text x="160" y="229" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#0e0e0c">LDAP</text>
              <rect x="20" y="110" width="22" height="22" stroke="#0e0e0c" strokeWidth="2" fill="#f2ede0" />
              <text x="31" y="124" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="#0e0e0c">APP</text>
              <rect x="278" y="110" width="22" height="22" stroke="#0e0e0c" strokeWidth="2" fill="#f2ede0" />
              <text x="289" y="124" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="#0e0e0c">APP</text>
            </svg>
          </div>
        </section>

        <Marker num="03" label="Sign in and see what you get back" />
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
                    <span>{busy ? 'Working' : mode === 'login' ? 'Log in' : 'Create account'}</span>
                    <span>&rarr;</span>
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="alert success">Signed in. Access token good for {tokens.expires_in} seconds.</div>
                {error && <div className="alert error">{error}</div>}
                <div className="btn-row">
                  <button className="btn" onClick={fetchProfile}>
                    <span>Load profile and roles</span><span>&rarr;</span>
                  </button>
                  {profile?.accountConsole && (
                    <a className="btn secondary" href={profile.accountConsole} target="_blank" rel="noreferrer">
                      <span>Open Keycloak account console</span><span>&rarr;</span>
                    </a>
                  )}
                  <button className="btn secondary" onClick={logout}>
                    <span>Log out</span><span>&times;</span>
                  </button>
                </div>
                {profile && (
                  <div style={{ marginTop: 20, display: 'grid', gap: 10 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(14,14,12,0.6)' }}>
                      Realm
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22 }}>
                      {profile.realm || 'unknown'}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(14,14,12,0.6)', marginTop: 8 }}>
                      Realm roles ({profile.roles?.length || 0})
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {(profile.roles || []).map((r) => (
                        <span key={r} style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 11,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          padding: '6px 10px',
                          border: '2px solid var(--ink)',
                          background: 'var(--paper)',
                        }}>{r}</span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="demo-right">
            <div className="demo-status">Response from /api/keycloak/profile</div>
            <pre>{profile ? JSON.stringify(profile, null, 2) : tokens ? '// click load profile to call the backend with your bearer token' : '// sign in to see the token response'}</pre>
          </div>
        </section>
      </div>
    </div>
  );
}
