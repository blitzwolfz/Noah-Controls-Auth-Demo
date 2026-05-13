import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Marker from '../components/Marker';
import { BetterAuthMark } from '../components/Marks';

const BASE = '/api/better-auth';

type Session = {
  id: string;
  token: string;
  userId: string;
  createdAt?: string;
  expiresAt?: string;
  ipAddress?: string;
  userAgent?: string;
};

export default function BetterAuthDemo() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('demo@noahcontrols.local');
  const [password, setPassword] = useState('demo1234');
  const [name, setName] = useState('Demo User');
  const [session, setSession] = useState<any>(null);
  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [revokedNote, setRevokedNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function loadSession() {
    try {
      const res = await fetch(`${BASE}/get-session`, { credentials: 'include' });
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.user) setSession(data);
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    loadSession();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const path = mode === 'signup' ? `${BASE}/sign-up/email` : `${BASE}/sign-in/email`;
      const payload = mode === 'signup' ? { email, password, name } : { email, password };
      const res = await fetch(path, {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Auth failed');
      await loadSession();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function listSessions() {
    setError(null);
    setRevokedNote(null);
    try {
      const res = await fetch(`${BASE}/list-sessions`, { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Couldn't list sessions");
      setSessions(Array.isArray(data) ? data : data.sessions || []);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function revokeOthers() {
    setError(null);
    try {
      const res = await fetch(`${BASE}/revoke-other-sessions`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Couldn't revoke");
      setRevokedNote('Other devices signed out');
      listSessions();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function logout() {
    await fetch(`${BASE}/sign-out`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
    });
    setSession(null);
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
          Better Auth<br />
          is the <span style={{ color: 'var(--brick)' }}>pick</span><br />
          for Phase 1.
        </h1>
        <div className="provider-mark-wrap" style={{ color: 'var(--brick)' }}>
          <BetterAuthMark size={96} />
        </div>
        <p className="provider-thesis">
          A TypeScript library, not a server. It installs into the NestJS
          backend, writes its tables into the same Postgres as the building
          data, and exposes typed functions for sign up, sign in, and
          sessions. Smallest footprint of the three prototypes, and the
          tightest fit with the TypeScript-first portal stack.
        </p>
        <div className="provider-callouts">
          <strong>Started by Bekacru, 2024</strong>
          <span>Pure TypeScript</span>
          <span>MIT license</span>
          <span>npm install plus a migration</span>
        </div>
      </header>

      <div className="provider-grid">
        <Marker num="01" label="Strengths, trade-offs, fit" />
        <div className="three-cols">
          <div data-accent="orange">
            <h4>Strengths</h4>
            <ul>
              <li>No second service to deploy or operate</li>
              <li>User tables sit next to building data in one Postgres</li>
              <li>Server and client are typed end to end</li>
              <li>Plugins cover orgs, 2FA, passkeys, magic link</li>
              <li>Smallest footprint, fits the cost-effective VM target</li>
            </ul>
          </div>
          <div>
            <h4>Trade-offs</h4>
            <ul>
              <li>Youngest of the three, expect breaking minors</li>
              <li>No admin UI, the user-management page is on the team</li>
              <li>No SAML, no LDAP, no Active Directory</li>
              <li>Security boundary lives in the application repo</li>
            </ul>
          </div>
          <div data-accent="brick">
            <h4>Why it lines up with Phase 1</h4>
            <ul>
              <li>One Postgres, one deploy, one migration history</li>
              <li>Granular permissions live next to the data they protect</li>
              <li>TypeScript-first matches the rest of the stack</li>
              <li>Plugins land 2FA and magic link when Phase 2 needs them</li>
            </ul>
          </div>
        </div>

        <Marker num="02" label="What makes it different" />
        <section className="standout" data-accent="paper">
          <div>
            <span className="standout-eyebrow">Typed client</span>
            <h3>Sign in is a function call you can autocomplete.</h3>
            <p style={{ marginTop: 18 }}>
              The client mirrors the server. Sign in, sign up, get session,
              list orgs: all of them typed, all of them autocompleted in your
              editor. The bugs you'd usually catch in QA, you catch at build
              time instead.
            </p>
          </div>
          <div className="standout-figure">
            <pre style={{
              background: 'var(--ink-strong)',
              color: 'var(--paper)',
              padding: '20px 24px',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              lineHeight: 1.6,
              margin: 0,
              border: '1px solid var(--hair-strong)',
              width: '100%',
            }}>
{`import { createAuthClient } from
  "better-auth/react";

const client = createAuthClient();

const { data, error } =
  await client.signIn.email({
    email,
    password,
  });

if (data) {
  // data.user.id and data.user.email
  // are typed, no casts needed
}`}
            </pre>
          </div>
        </section>

        <Marker num="03" label="Try it" />
        <section className="demo-wrap">
          <div className="demo-left">
            {!session ? (
              <>
                <div className="tab-switch">
                  <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Log in</button>
                  <button className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>Sign up</button>
                </div>
                {error && <div className="alert error">{error}</div>}
                <form className="form" onSubmit={submit}>
                  {mode === 'signup' && (
                    <label>Name
                      <input value={name} onChange={(e) => setName(e.target.value)} required />
                    </label>
                  )}
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
                <div className="alert success">
                  Signed in as {session.user?.email}. Row is in SQLite.
                </div>
                {error && <div className="alert error">{error}</div>}
                {revokedNote && <div className="alert success">{revokedNote}</div>}
                <div className="btn-row">
                  <button className="btn" onClick={loadSession}>
                    <span>Refresh session</span><span>&rarr;</span>
                  </button>
                  <button className="btn secondary" onClick={listSessions}>
                    <span>List my sessions</span><span>&rarr;</span>
                  </button>
                  <button className="btn secondary" onClick={revokeOthers}>
                    <span>Sign out other devices</span><span>&times;</span>
                  </button>
                  <button className="btn secondary" onClick={logout}>
                    <span>Log out</span><span>&times;</span>
                  </button>
                </div>
                <p style={{ marginTop: 18, fontSize: 13, lineHeight: 1.5, color: 'var(--muted)' }}>
                  Sign in here, then sign in again as the same user in a
                  different browser. Hit "List my sessions" to see both, then
                  revoke the other.
                </p>
                {sessions && (
                  <div style={{ marginTop: 16, display: 'grid', gap: 8 }}>
                    {sessions.length === 0 && (
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)' }}>
                        No sessions came back
                      </div>
                    )}
                    {sessions.map((s) => (
                      <div key={s.id} style={{
                        border: '1px solid var(--hair-strong)',
                        padding: '10px 12px',
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        letterSpacing: '0.1em',
                        background: 'var(--paper)',
                      }}>
                        <span>{(s.token || s.id || '').slice(0, 18)}&hellip;</span>
                        <span>{s.ipAddress || 'local'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          <div className="demo-right">
            <div className="demo-status">Response from the backend</div>
            <pre>{session ? JSON.stringify(session, null, 2) : "// sign in to make a session row"}</pre>
          </div>
        </section>
      </div>
    </div>
  );
}
