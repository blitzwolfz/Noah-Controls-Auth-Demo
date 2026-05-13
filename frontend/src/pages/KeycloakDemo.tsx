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
      if (!res.ok) throw new Error(data.message || "Couldn't load profile");
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
          <Link to="/">&larr; Back to the writeup</Link>
        </div>
        <h1 className="provider-title">
          Keycloak<br />
          is the<br />
          <span style={{ color: 'var(--orange)' }}>enterprise</span> option.
        </h1>
        <div className="provider-mark-wrap" style={{ color: 'var(--orange)' }}>
          <KeycloakMark size={96} />
        </div>
        <p className="provider-thesis">
          A mature identity and access management platform. The natural pick
          if Noah Controls customers ever require SAML or want their
          corporate Active Directory wired into the portal. Heavier to run
          than the other two prototypes, but the only one of the three that
          speaks SAML out of the box.
        </p>
        <div className="provider-callouts">
          <strong>Built by Red Hat, 2014</strong>
          <span>Runs on Java (Quarkus)</span>
          <span>Apache 2.0, fully self-hostable</span>
          <span>Needs its own container and Postgres</span>
        </div>
      </header>

      <div className="provider-grid">
        <Marker num="01" label="Strengths, trade-offs, fit" />
        <div className="three-cols">
          <div data-accent="orange">
            <h4>Strengths</h4>
            <ul>
              <li>Built-in SSO, MFA, RBAC, OAuth2 / OIDC / SAML</li>
              <li>Federates users from LDAP and Active Directory</li>
              <li>Admin console covers realms, users, clients, roles</li>
              <li>Mature, battle-tested, large enterprise community</li>
            </ul>
          </div>
          <div>
            <h4>Trade-offs</h4>
            <ul>
              <li>Heavyweight compared to SuperTokens or Better Auth</li>
              <li>Deeply customizing the React UX takes real effort</li>
              <li>Admin and config surface is large</li>
              <li>Larger operational footprint, more for one VM to carry</li>
            </ul>
          </div>
          <div data-accent="brick">
            <h4>Best fit (for the portal)</h4>
            <ul>
              <li>A customer signs and asks for enterprise SSO</li>
              <li>Active Directory or LDAP integration is required</li>
              <li>Multiple Noah Controls apps need to share one identity</li>
              <li>Compliance and security governance are on the table</li>
            </ul>
          </div>
        </div>

        <Marker num="02" label="What makes it different" />
        <section className="standout" data-accent="orange">
          <div>
            <span className="standout-eyebrow">Identity federation</span>
            <h3>Keycloak can be the identity provider for the rest of the stack.</h3>
            <p style={{ marginTop: 18 }}>
              It can act as a SAML identity provider for one Noah Controls
              customer's Active Directory and broker Google or GitHub for
              another, all at the same time. The other two prototypes do not
              do this. Most auth tools sign in end users. Keycloak signs in
              other services as well.
            </p>
          </div>
          <div className="standout-figure">
            <svg width="320" height="240" viewBox="0 0 320 240" fill="none">
              <circle cx="160" cy="120" r="48" fill="#0e0e0c" />
              <rect x="152" y="120" width="40" height="6" fill="#f5f1e6" />
              <rect x="188" y="120" width="6" height="14" fill="#f5f1e6" />
              <line x1="160" y1="20" x2="160" y2="64" stroke="#0e0e0c" strokeWidth="2" />
              <line x1="160" y1="176" x2="160" y2="220" stroke="#0e0e0c" strokeWidth="2" />
              <line x1="40" y1="120" x2="112" y2="120" stroke="#0e0e0c" strokeWidth="2" />
              <line x1="208" y1="120" x2="280" y2="120" stroke="#0e0e0c" strokeWidth="2" />
              <rect x="140" y="4" width="40" height="20" stroke="#0e0e0c" strokeWidth="2" fill="#f5f1e6" />
              <text x="160" y="18" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#0e0e0c">SAML</text>
              <rect x="140" y="216" width="40" height="20" stroke="#0e0e0c" strokeWidth="2" fill="#f5f1e6" />
              <text x="160" y="229" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#0e0e0c">LDAP</text>
              <rect x="20" y="110" width="22" height="22" stroke="#0e0e0c" strokeWidth="2" fill="#f5f1e6" />
              <text x="31" y="124" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="#0e0e0c">APP</text>
              <rect x="278" y="110" width="22" height="22" stroke="#0e0e0c" strokeWidth="2" fill="#f5f1e6" />
              <text x="289" y="124" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="#0e0e0c">APP</text>
            </svg>
          </div>
        </section>

        <Marker num="03" label="Try it" />
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
                <div className="alert success">Signed in. Token's good for {tokens.expires_in} seconds.</div>
                {error && <div className="alert error">{error}</div>}
                <div className="btn-row">
                  <button className="btn" onClick={fetchProfile}>
                    <span>Load profile and roles</span><span>&rarr;</span>
                  </button>
                  {profile?.accountConsole && (
                    <a className="btn secondary" href={profile.accountConsole} target="_blank" rel="noreferrer">
                      <span>Open Keycloak's account page</span><span>&rarr;</span>
                    </a>
                  )}
                  <button className="btn secondary" onClick={logout}>
                    <span>Log out</span><span>&times;</span>
                  </button>
                </div>
                {profile && (
                  <div style={{ marginTop: 20, display: 'grid', gap: 10 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                      Realm
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22 }}>
                      {profile.realm || 'unknown'}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 8 }}>
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
                          border: '1px solid var(--hair-strong)',
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
            <pre>{profile ? JSON.stringify(profile, null, 2) : tokens ? "// hit load profile to call the backend with your bearer token" : "// sign in to see the token response"}</pre>
          </div>
        </section>
      </div>
    </div>
  );
}
