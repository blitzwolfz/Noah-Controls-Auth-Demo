import { useState } from 'react';
import { Link } from 'react-router-dom';
import Marker from '../components/Marker';
import { SuperTokensMark } from '../components/Marks';

const BASE = '/api/supertokens';

export default function SuperTokensDemo() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('demo@noahcontrols.local');
  const [password, setPassword] = useState('demo1234');
  const [signedIn, setSignedIn] = useState(false);
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
    <div className="provider-page">
      <header className="provider-head">
        <div className="provider-eyebrow">
          <Link to="/">&larr; Back to overview</Link>
        </div>
        <h1 className="provider-title">
          SuperTokens<br />
          treats the<br />
          <span style={{ color: 'var(--cobalt)' }}>session</span> as<br />
          the asset.
        </h1>
        <div className="provider-mark-wrap" style={{ color: 'var(--cobalt)' }}>
          <SuperTokensMark size={140} />
        </div>
        <p className="provider-thesis">
          A focused auth core with rotating refresh tokens, theft detection,
          and a recipe model that lets you stack passwordless, social, and
          MFA on top of the same session contract. Self-host or use the
          managed core, same SDK either way.
        </p>
        <div className="provider-callouts">
          <strong>Origin:</strong> SuperTokens, 2020
          <span>Runtime: Node SDK + Java core</span>
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
              <li>Rotating refresh tokens with anomaly detection</li>
              <li>Recipes compose: emailpassword, passwordless, social, MFA</li>
              <li>Backend-first, no React lock-in</li>
              <li>Self-host or managed core, same code path</li>
            </ul>
          </div>
          <div>
            <h4>Watch outs</h4>
            <ul>
              <li>No SAML, no LDAP federation</li>
              <li>Less mature multi-tenant story than Keycloak</li>
              <li>Cookie path defaults catch you once</li>
              <li>Smaller ecosystem of community recipes</li>
            </ul>
          </div>
          <div data-accent="brick">
            <h4>Best fit</h4>
            <ul>
              <li>Consumer products with mobile clients</li>
              <li>Long-session apps where rotation matters</li>
              <li>Teams that want server-side auth without the JVM</li>
              <li>When MFA and passwordless will arrive soon</li>
            </ul>
          </div>
        </div>

        <Marker num="02" label="The one thing it does that the others can't" />
        <section className="standout" data-accent="ink">
          <div>
            <span className="standout-eyebrow">Distinctive / Rotating sessions</span>
            <h3>Refresh rotation, theft detection, out of the box.</h3>
            <p style={{ marginTop: 18 }}>
              Every refresh swaps the token pair and revokes the previous one.
              If a stolen refresh token is replayed after the legitimate
              client has already rotated, the entire session is killed and the
              user is forced to sign in again. You do not write this yourself.
            </p>
          </div>
          <div className="standout-figure">
            <svg width="320" height="240" viewBox="0 0 320 240" fill="none">
              <rect x="20" y="40" width="80" height="40" stroke="#f2ede0" strokeWidth="2" />
              <rect x="120" y="40" width="80" height="40" stroke="#f2ede0" strokeWidth="2" />
              <rect x="220" y="40" width="80" height="40" stroke="#f2ede0" strokeWidth="2" fill="#ff5a1f" />
              <rect x="20" y="100" width="80" height="40" stroke="#f2ede0" strokeWidth="2" />
              <rect x="120" y="100" width="80" height="40" stroke="#f2ede0" strokeWidth="2" />
              <rect x="220" y="100" width="80" height="40" stroke="#f2ede0" strokeWidth="2" />
              <line x1="60" y1="80" x2="60" y2="100" stroke="#f2ede0" strokeWidth="2" />
              <line x1="160" y1="80" x2="160" y2="100" stroke="#f2ede0" strokeWidth="2" />
              <line x1="260" y1="80" x2="260" y2="100" stroke="#f2ede0" strokeWidth="2" />
              <text x="60" y="65" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#f2ede0">T1</text>
              <text x="160" y="65" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#f2ede0">T2</text>
              <text x="260" y="65" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#0e0e0c">T3</text>
              <text x="60" y="125" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#f2ede0">R1</text>
              <text x="160" y="125" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#f2ede0">R2</text>
              <text x="260" y="125" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#f2ede0">R3</text>
              <text x="160" y="190" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#f2ede0" letterSpacing="2">REPLAY OF R1 KILLS R2, R3, T3</text>
            </svg>
          </div>
        </section>

        <Marker num="03" label="Live demo / Cookie session" />
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
                <div className="alert success">Authenticated. Cookie issued by the SuperTokens core.</div>
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
            <pre>{profile ? JSON.stringify(profile, null, 2) : signedIn ? '// click fetch profile to read /api/supertokens/profile through the cookie' : '// sign in to issue the cookie pair'}</pre>
          </div>
        </section>
      </div>
    </div>
  );
}
