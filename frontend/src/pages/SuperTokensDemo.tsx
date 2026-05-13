import { useState } from 'react';
import { Link } from 'react-router-dom';
import Marker from '../components/Marker';
import { SuperTokensMark } from '../components/Marks';

const BASE = '/api/supertokens';

type SessionRow = { handle: string; isCurrent: boolean; timeCreated?: number; expiry?: number };

export default function SuperTokensDemo() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('demo@noahcontrols.local');
  const [password, setPassword] = useState('demo1234');
  const [signedIn, setSignedIn] = useState(false);
  const [profile, setProfile] = useState<unknown>(null);
  const [sessions, setSessions] = useState<SessionRow[] | null>(null);
  const [revokedNote, setRevokedNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const path = mode === 'signup' ? `${BASE}/signup` : `${BASE}/signin`;
      const res = await fetch(path, {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json', rid: 'emailpassword' },
        body: JSON.stringify({
          formFields: [
            { id: 'email', value: email },
            { id: 'password', value: password },
          ],
        }),
      });
      const data = await res.json();
      if (data.status !== 'OK') throw new Error(data.status || 'Auth failed');
      setSignedIn(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function fetchProfile() {
    setError(null);
    try {
      const res = await fetch('/api/supertokens/profile', { credentials: 'include' });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Not signed in');
      }
      setProfile(await res.json());
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function listSessions() {
    setError(null);
    setRevokedNote(null);
    try {
      const res = await fetch('/api/supertokens/sessions', { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Couldn't list sessions");
      setSessions(data.sessions);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function signOutOthers() {
    setError(null);
    try {
      const res = await fetch('/api/supertokens/sign-out-others', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Couldn't revoke sessions");
      setRevokedNote(`Signed out ${data.revoked} other ${data.revoked === 1 ? 'device' : 'devices'}`);
      listSessions();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function logout() {
    await fetch(`${BASE}/signout`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
    });
    setSignedIn(false);
    setProfile(null);
    setSessions(null);
    setRevokedNote(null);
  }

  return (
    <div className="provider-page">
      <header className="provider-head">
        <div className="provider-eyebrow">
          <Link to="/">&larr; Back to the writeup</Link>
        </div>
        <h1 className="provider-title">
          SuperTokens<br />
          does <span style={{ color: 'var(--cobalt)' }}>sessions</span><br />
          properly.
        </h1>
        <div className="provider-mark-wrap" style={{ color: 'var(--cobalt)' }}>
          <SuperTokensMark size={96} />
        </div>
        <p className="provider-thesis">
          A small Java server that stores users, plus a Node SDK that does
          the work. Session cookies rotate on every refresh, and if a stolen
          one shows up after the real client has moved on, SuperTokens kills
          the whole session.
        </p>
        <div className="provider-callouts">
          <strong>By the SuperTokens team</strong>
          <span>Started 2020</span>
          <span>Node SDK, Java core</span>
          <span>Apache 2.0</span>
          <span>Container plus Postgres</span>
        </div>
      </header>

      <div className="provider-grid">
        <Marker num="01" label="Strengths, trade-offs, fit" />
        <div className="three-cols">
          <div data-accent="orange">
            <h4>Strengths</h4>
            <ul>
              <li>Rotating refresh tokens with hijack detection, on by default</li>
              <li>Recipes for password, magic link, social, MFA</li>
              <li>Backend-first. Any frontend</li>
              <li>Self-host or use their cloud</li>
            </ul>
          </div>
          <div>
            <h4>Trade-offs</h4>
            <ul>
              <li>No SAML, no LDAP</li>
              <li>Multi-tenant is there but younger than Keycloak's</li>
              <li>Cookie path defaults will bite you once. They bit us</li>
              <li>Smaller community than Keycloak</li>
            </ul>
          </div>
          <div data-accent="brick">
            <h4>Best fit</h4>
            <ul>
              <li>Consumer apps with mobile clients</li>
              <li>Products with long sessions</li>
              <li>Teams that want session security off the shelf</li>
              <li>Passwordless or MFA on the next roadmap</li>
            </ul>
          </div>
        </div>

        <Marker num="02" label="What makes it different" />
        <section className="standout" data-accent="ink">
          <div>
            <span className="standout-eyebrow">Stolen-token detection</span>
            <h3>If a stolen refresh token shows up, the whole session dies.</h3>
            <p style={{ marginTop: 18 }}>
              Each refresh swaps the token pair and burns the old one. If
              someone replays a stale refresh token after the real client has
              moved on, SuperTokens sees the conflict and revokes the entire
              session. That's the bit you'd otherwise write yourself, and
              probably get wrong.
            </p>
          </div>
          <div className="standout-figure">
            <svg width="320" height="240" viewBox="0 0 320 240" fill="none">
              <rect x="20" y="40" width="80" height="40" stroke="#f5f1e6" strokeWidth="2" />
              <rect x="120" y="40" width="80" height="40" stroke="#f5f1e6" strokeWidth="2" />
              <rect x="220" y="40" width="80" height="40" stroke="#f5f1e6" strokeWidth="2" fill="#ff5a1f" />
              <rect x="20" y="100" width="80" height="40" stroke="#f5f1e6" strokeWidth="2" />
              <rect x="120" y="100" width="80" height="40" stroke="#f5f1e6" strokeWidth="2" />
              <rect x="220" y="100" width="80" height="40" stroke="#f5f1e6" strokeWidth="2" />
              <line x1="60" y1="80" x2="60" y2="100" stroke="#f5f1e6" strokeWidth="2" />
              <line x1="160" y1="80" x2="160" y2="100" stroke="#f5f1e6" strokeWidth="2" />
              <line x1="260" y1="80" x2="260" y2="100" stroke="#f5f1e6" strokeWidth="2" />
              <text x="60" y="65" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#f5f1e6">T1</text>
              <text x="160" y="65" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#f5f1e6">T2</text>
              <text x="260" y="65" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#0e0e0c">T3</text>
              <text x="60" y="125" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#f5f1e6">R1</text>
              <text x="160" y="125" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#f5f1e6">R2</text>
              <text x="260" y="125" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#f5f1e6">R3</text>
              <text x="160" y="190" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#f5f1e6" letterSpacing="2">R1 REUSED &rarr; SESSION KILLED</text>
            </svg>
          </div>
        </section>

        <Marker num="03" label="Try it" />
        <section className="demo-wrap">
          <div className="demo-left">
            {!signedIn ? (
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
                  <label>Password (8 chars min)
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
                  </label>
                  <button className="btn" disabled={busy} type="submit">
                    <span>{busy ? 'Working' : mode === 'login' ? 'Log in' : 'Create account'}</span>
                    <span>&rarr;</span>
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="alert success">Signed in. Cookie's been set.</div>
                {error && <div className="alert error">{error}</div>}
                {revokedNote && <div className="alert success">{revokedNote}</div>}
                <div className="btn-row">
                  <button className="btn" onClick={fetchProfile}>
                    <span>Load profile</span><span>&rarr;</span>
                  </button>
                  <button className="btn secondary" onClick={listSessions}>
                    <span>List my sessions</span><span>&rarr;</span>
                  </button>
                  <button className="btn secondary" onClick={signOutOthers}>
                    <span>Sign out other devices</span><span>&times;</span>
                  </button>
                  <button className="btn secondary" onClick={logout}>
                    <span>Log out</span><span>&times;</span>
                  </button>
                </div>
                <p style={{ marginTop: 18, fontSize: 13, lineHeight: 1.5, color: 'var(--muted)' }}>
                  Sign in here, then sign in again in a different browser as
                  the same user. Come back to this tab and hit "List my
                  sessions". You'll see two. "Sign out other devices" kills
                  the other one.
                </p>
                {sessions && (
                  <div style={{ marginTop: 16, display: 'grid', gap: 8 }}>
                    {sessions.map((s) => (
                      <div key={s.handle} style={{
                        border: '1px solid var(--hair-strong)',
                        padding: '10px 12px',
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        letterSpacing: '0.1em',
                        background: s.isCurrent ? 'var(--orange-soft)' : 'var(--paper)',
                      }}>
                        <span>{s.handle.slice(0, 18)}&hellip;</span>
                        <span>{s.isCurrent ? 'THIS DEVICE' : 'OTHER'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          <div className="demo-right">
            <div className="demo-status">Response from the backend</div>
            <pre>{profile ? JSON.stringify(profile, null, 2) : signedIn ? "// hit load profile to call /api/supertokens/profile" : "// sign in to get a session cookie"}</pre>
          </div>
        </section>
      </div>
    </div>
  );
}
