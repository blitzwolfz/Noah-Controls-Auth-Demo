import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>Authentication options for Noah Controls</h1>
        <p>
          Three different providers, one shared NestJS API, one shared front end.
          Each tab runs an isolated sign up, log in, protected profile, and log out flow
          against a real backend so the trade-offs are easy to compare side by side.
        </p>
      </section>

      <section className="cards">
        <article className="card">
          <h3>Keycloak</h3>
          <p>
            Self-hosted OpenID Connect server with a full admin console. The demo uses the
            password grant for simplicity; a production deployment would switch to the
            authorization code flow with PKCE.
          </p>
          <Link to="/keycloak" className="card-cta">Try Keycloak</Link>
        </article>

        <article className="card">
          <h3>SuperTokens</h3>
          <p>
            Self-hosted auth service paired with a Node SDK. Sessions are HTTP-only cookies
            issued by the SuperTokens core. The Node SDK handles rotation and revocation.
          </p>
          <Link to="/supertokens" className="card-cta">Try SuperTokens</Link>
        </article>

        <article className="card">
          <h3>Better Auth</h3>
          <p>
            Library-first auth that runs inside the NestJS process. Backed by a local SQLite
            file for this demo. No extra container required.
          </p>
          <Link to="/better-auth" className="card-cta">Try Better Auth</Link>
        </article>
      </section>
    </>
  );
}
