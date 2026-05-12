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
      if (!res.ok) throw new Error(data.message || 'Could not list sessions');
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
      if (!res.ok) throw new Error(data.message || data.error || 'Could not revoke');
      setRevokedNote('Signed out of other devices');
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
          <Link to="/">&larr; Back to overview</Link>
        </div>
        <h1 className="provider-title">
          Better Auth<br />
          is a <span style={{ color: 'var(--brick)' }}>library</span>,<br />
          not a server.
        </h1>
        <div className="provider-mark-wrap" style={{ color: 'var(--brick)' }}>
          <BetterAuthMark size={140} />
        </div>
        <p className="provider-thesis">
          You install it into your existing app. It adds a handful of tables to
          your database and exposes typed functions for signup, login, and
          sessions. There is no second process to deploy.
        </p>
        <div className="provider-callouts">
          <strong>Made by:</strong> Bekacru, 2024
          <span>Runtime: TypeScript</span>
          <span>License: MIT</span>
          <span>Setup: an npm install</span>
        </div>
      </header>

      <div className="provider-grid">
        <Marker num="01" label="What it is good at, what it costs, when to use it" />
        <div className="three-cols">
          <div data-accent="orange">
            <h4>Strengths</h4>
            <ul>
              <li>Lives in your repo, no separate auth service</li>
              <li>Typed calls from server to client</li>
              <li>Works with SQLite, Postgres, MySQL, libSQL</li>
              <li>Plugins for organizations, 2FA, passkeys, magic link</li>
            </ul>
          </div>
          <div>
            <h4>Trade-offs</h4>
            <ul>
              <li>Newer project, expect breaking minors</li>
              <li>You own the security of the integration</li>
              <li>No admin console</li>
              <li>No SAML, no LDAP</li>
            </ul>
          </div>
          <div data-accent="brick">
            <h4>Best fit</h4>
            <ul>
              <li>TypeScript teams shipping a product</li>
              <li>Apps where a separate auth service is overkill</li>
              <li>Codebases that want one schema and one deploy</li>
              <li>Teams comfortable owning auth code</li>
            </ul>
          </div>
        </div>

        <Marker num="02" label="The feature it is known for" />
        <section className="standout" data-accent="paper">
          <div>
            <span className="standout-eyebrow">Typed client</span>
            <h3>Sign in is a function call, not a network protocol.</h3>
            <p style={{ marginTop: 18 }}>
              The Better Auth client mirrors the server. Sign in, sign up, get
              session, list organizations: all typed, all autocompleted, all
              checked at build time. Mistakes that show up at runtime with a
              REST client show up in your editor here.
            </p>
          </div>
          <div className="standout-figure">
            <pre style={{
              background: 'var(--ink)',
              color: 'var(--paper)',
              padding: '20px 24px',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              lineHeight: 1.6,
              margin: 0,
              border: 'var(--rule)',
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

        <Marker num="03" label="Sign in and try session management" />
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
                  <label>Password (8 or more)
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
                  Signed in as {session.user?.email}. Session is stored in SQLite.
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
                <p style={{ marginTop: 18, fontSize: 13, lineHeight: 1.5, color: 'rgba(14,14,12,0.7)' }}>
                  Open this page in a second browser to make a second session,
                  then list them here and revoke the others.
                </p>
                {sessions && (
                  <div style={{ marginTop: 16, display: 'grid', gap: 8 }}>
                    {sessions.length === 0 && (
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'rgba(14,14,12,0.6)' }}>
                        No sessions returned
                      </div>
                    )}
                    {sessions.map((s) => (
                      <div key={s.id} style={{
                        border: '2px solid var(--ink)',
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
            <pre>{session ? JSON.stringify(session, null, 2) : '// sign in to create a session row'}</pre>
          </div>
        </section>
      </div>
    </div>
  );
}
