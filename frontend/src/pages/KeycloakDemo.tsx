import { useEffect, useState } from 'react';

type Tokens = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

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
    <>
      <section className="panel">
        <h2>Keycloak</h2>
        <p className="muted">
          Sign up creates a user via the Keycloak admin API, then logs in with the password
          grant. Tokens are stored in <code>localStorage</code> for the demo.
        </p>
      </section>

      {!tokens ? (
        <section className="panel">
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
              {busy ? 'Working...' : mode === 'login' ? 'Log in' : 'Create account'}
            </button>
          </form>
        </section>
      ) : (
        <section className="panel">
          <div className="alert success">Signed in. Access token valid for {tokens.expires_in}s.</div>
          {error && <div className="alert error">{error}</div>}
          <div className="row">
            <button className="btn" onClick={fetchProfile}>Fetch protected profile</button>
            <button className="btn secondary" onClick={logout}>Log out</button>
          </div>
          {profile != null && (
            <pre className="profile">{JSON.stringify(profile, null, 2)}</pre>
          )}
        </section>
      )}
    </>
  );
}
