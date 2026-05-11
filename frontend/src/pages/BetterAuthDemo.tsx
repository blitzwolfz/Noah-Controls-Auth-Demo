import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Marker from '../components/Marker';
import { BetterAuthMark } from '../components/Marks';

const BASE = '/api/better-auth';

export default function BetterAuthDemo() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('demo@noahcontrols.local');
  const [password, setPassword] = useState('demo1234');
  const [name, setName] = useState('Demo User');
  const [session, setSession] = useState<any>(null);
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

  async function logout() {
    await fetch(`${BASE}/sign-out`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
    });
    setSession(null);
  }

  return (
    <div className="provider-page">
      <header className="provider-head">
        <div className="provider-eyebrow">
          <Link to="/">&larr; Back to overview</Link>
        </div>
        <h1 className="provider-title">
          Better Auth<br />
          is <span style={{ color: 'var(--brick)' }}>part of</span><br />
          your codebase.
        </h1>
        <div className="provider-mark-wrap" style={{ color: 'var(--brick)' }}>
          <BetterAuthMark size={140} />
        </div>
        <p className="provider-thesis">
          No second process to operate. The auth surface compiles into your
          server, owns a handful of tables, and exposes typed handlers all the
          way to the client. Plugins add organizations, two-factor, passkeys,
          and magic links when you actually need them.
        </p>
        <div className="provider-callouts">
          <strong>Origin:</strong> Bekacru, 2024
          <span>Runtime: pure TypeScript</span>
          <span>License: MIT</span>
          <span>Deploy: nothing extra</span>
        </div>
      </header>

      <div className="provider-grid">
        <Marker num="01" label="Strengths, watchouts, fit" />
        <div className="three-cols">
          <div data-accent="orange">
            <h4>Strengths</h4>
            <ul>
              <li>Lives in your repo, no separate auth service</li>
              <li>End-to-end typed client, no manual response parsing</li>
              <li>Kysely backed: SQLite, Postgres, MySQL, libSQL</li>
              <li>Plugins for orgs, 2FA, passkeys, magic link, JWT</li>
            </ul>
          </div>
          <div>
            <h4>Watch outs</h4>
            <ul>
              <li>Youngest of the three, expect breaking minors</li>
              <li>You operate the security boundary yourself</li>
              <li>No admin console, you build user management</li>
              <li>No SAML, no LDAP federation</li>
            </ul>
          </div>
          <div data-accent="brick">
            <h4>Best fit</h4>
            <ul>
              <li>Small TypeScript teams shipping a product</li>
              <li>Apps where a separate auth service is overkill</li>
              <li>Codebases that want one schema, one deploy</li>
              <li>Teams comfortable owning the auth surface</li>
            </ul>
          </div>
        </div>

        <Marker num="02" label="The one thing it does that the others can't" />
        <section className="standout" data-accent="paper">
          <div>
            <span className="standout-eyebrow">Distinctive / Type safety</span>
            <h3>Auth is a function call, not a network protocol.</h3>
            <p style={{ marginTop: 18 }}>
              The Better Auth client mirrors the server. Sign in, sign up,
              fetch session, list organizations: all typed, all autocompleted,
              all checked at compile time. Mistakes that show up at runtime
              with REST clients show up in your editor here.
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
  // data.user.id, data.user.email
  //   are typed, no casts
}`}
            </pre>
          </div>
        </section>

        <Marker num="03" label="Live demo / SQLite session" />
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
                  <label>Password (8+)
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
                  </label>
                  <button className="btn" disabled={busy} type="submit">
                    <span>{busy ? 'Working' : mode === 'login' ? 'Authenticate' : 'Create account'}</span>
                    <span>&rarr;</span>
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="alert success">
                  Authenticated as {session.user?.email}. Stored in the local SQLite file.
                </div>
                {error && <div className="alert error">{error}</div>}
                <div className="btn-row">
                  <button className="btn" onClick={loadSession}>
                    <span>Refresh session</span><span>&rarr;</span>
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
            <pre>{session ? JSON.stringify(session, null, 2) : '// sign in to populate the session row'}</pre>
          </div>
        </section>
      </div>
    </div>
  );
}
