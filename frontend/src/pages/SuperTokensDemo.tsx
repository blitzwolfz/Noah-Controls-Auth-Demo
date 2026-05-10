import { useState } from 'react';

const BASE = '/api/supertokens/auth';

export default function SuperTokensDemo() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('demo@noahcontrols.local');
  const [password, setPassword] = useState('demo1234');
  const [signedIn, setSignedIn] = useState<boolean>(false);
  const [profile, setProfile] = useState<unknown>(null);
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
      if (data.status !== 'OK') {
        throw new Error(data.status || 'Auth failed');
      }
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
        throw new Error(text || 'Not authorised');
      }
      setProfile(await res.json());
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
  }

  return (
    <>
      <section className="panel">
        <h2>SuperTokens</h2>
        <p className="muted">
          Sign up and sign in hit the SuperTokens middleware directly. Sessions are
          delivered as HTTP-only cookies, so the front end uses <code>credentials: include</code>
          and never touches the token itself.
        </p>
      </section>

      {!signedIn ? (
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
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            </label>
            <button className="btn" disabled={busy} type="submit">
              {busy ? 'Working...' : mode === 'login' ? 'Log in' : 'Create account'}
            </button>
          </form>
        </section>
      ) : (
        <section className="panel">
          <div className="alert success">Signed in. Session cookie issued by SuperTokens core.</div>
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
