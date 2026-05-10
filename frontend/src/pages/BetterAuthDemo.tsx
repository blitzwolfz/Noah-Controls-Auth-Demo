import { useEffect, useState } from 'react';

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
      const payload =
        mode === 'signup'
          ? { email, password, name }
          : { email, password };
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
    <>
      <section className="panel">
        <h2>Better Auth</h2>
        <p className="muted">
          Runs inside the NestJS process with a local SQLite file. The front end calls the
          standard Better Auth endpoints mounted under <code>/api/better-auth</code>.
        </p>
      </section>

      {!session ? (
        <section className="panel">
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
            <label>Password
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            </label>
            <button className="btn" disabled={busy} type="submit">
              {busy ? 'Working...' : mode === 'login' ? 'Log in' : 'Create account'}
            </button>
          </form>
        </section>
      ) : (
        <section className="panel">
          <div className="alert success">
            Signed in as {session.user?.email}. Session stored in SQLite.
          </div>
          {error && <div className="alert error">{error}</div>}
          <div className="row">
            <button className="btn" onClick={loadSession}>Refresh session</button>
            <button className="btn secondary" onClick={logout}>Log out</button>
          </div>
          <pre className="profile">{JSON.stringify(session, null, 2)}</pre>
        </section>
      )}
    </>
  );
}
