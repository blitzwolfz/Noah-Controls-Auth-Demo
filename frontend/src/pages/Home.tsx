import { Link } from 'react-router-dom';
import Marker from '../components/Marker';
import { KeycloakMark, SuperTokensMark, BetterAuthMark } from '../components/Marks';

type Cell = { tone: 'yes' | 'no' | 'partial'; label: string; note?: string };

const rows: { capability: string; cells: [Cell, Cell, Cell] }[] = [
  {
    capability: 'Runs as',
    cells: [
      { tone: 'yes', label: 'Service', note: 'Java / Quarkus' },
      { tone: 'yes', label: 'Service', note: 'Node core' },
      { tone: 'yes', label: 'Library', note: 'In your app' },
    ],
  },
  {
    capability: 'Admin console',
    cells: [
      { tone: 'yes', label: 'Yes', note: 'Realms, clients, roles' },
      { tone: 'yes', label: 'Yes', note: 'Dashboard for users' },
      { tone: 'no', label: 'None', note: 'Roll your own' },
    ],
  },
  {
    capability: 'SAML 2.0 / OIDC IdP',
    cells: [
      { tone: 'yes', label: 'Yes', note: 'Full broker' },
      { tone: 'partial', label: 'OIDC only' },
      { tone: 'no', label: 'No' },
    ],
  },
  {
    capability: 'LDAP / AD federation',
    cells: [
      { tone: 'yes', label: 'Yes', note: 'User federation' },
      { tone: 'no', label: 'No' },
      { tone: 'no', label: 'No' },
    ],
  },
  {
    capability: 'Session theft detection',
    cells: [
      { tone: 'partial', label: 'Manual' },
      { tone: 'yes', label: 'Built in', note: 'Rotating refresh' },
      { tone: 'partial', label: 'Per session' },
    ],
  },
  {
    capability: 'Passwordless / magic link',
    cells: [
      { tone: 'partial', label: 'Plugin' },
      { tone: 'yes', label: 'Recipe' },
      { tone: 'yes', label: 'Plugin' },
    ],
  },
  {
    capability: 'Passkeys / WebAuthn',
    cells: [
      { tone: 'yes', label: 'Yes', note: 'Native' },
      { tone: 'yes', label: 'Yes' },
      { tone: 'yes', label: 'Plugin' },
    ],
  },
  {
    capability: 'Organizations / multi-tenant',
    cells: [
      { tone: 'yes', label: 'Realms' },
      { tone: 'partial', label: 'Tenants' },
      { tone: 'yes', label: 'Plugin' },
    ],
  },
  {
    capability: 'Type-safe client',
    cells: [
      { tone: 'no', label: 'No', note: 'Generated specs' },
      { tone: 'partial', label: 'Typed SDK' },
      { tone: 'yes', label: 'End to end' },
    ],
  },
  {
    capability: 'Operational weight',
    cells: [
      { tone: 'no', label: 'Heavy', note: 'JVM, Postgres' },
      { tone: 'partial', label: 'Medium', note: 'Core service' },
      { tone: 'yes', label: 'Light', note: 'No extra service' },
    ],
  },
];

function renderCell(cell: Cell) {
  if (cell.tone === 'yes') {
    return (
      <>
        <span className="cell-yes">{cell.label}</span>
        {cell.note && <span className="cell-detail">{cell.note}</span>}
      </>
    );
  }
  if (cell.tone === 'partial') {
    return (
      <>
        <span className="cell-partial">{cell.label}</span>
        {cell.note && <span className="cell-detail">{cell.note}</span>}
      </>
    );
  }
  return (
    <>
      <span className="cell-no">{cell.label}</span>
      {cell.note && <span className="cell-detail">{cell.note}</span>}
    </>
  );
}

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-shapes" aria-hidden>
          <div className="shape-circle" />
          <div className="shape-triangle" />
          <div className="shape-square" />
        </div>
        <div className="hero-grid">
          <h1 className="hero-title">
            Three<br />
            <em>Doors</em><br />
            <span className="stroke">Into the</span><br />
            Same Room.
          </h1>
          <div className="hero-lede">
            <p>
              Noah Controls is choosing how customers sign in. This rig runs
              the three serious self-hostable options side by side, on a single
              backend, so the trade-offs read in minutes rather than weeks.
            </p>
            <p>Keycloak. SuperTokens. Better Auth. One demo each.</p>
          </div>
          <div className="hero-meta">
            <div>Providers<b>03</b></div>
            <div>Backends<b>01</b></div>
            <div>Live flows<b>12</b></div>
            <div>Verdict<b>You</b></div>
          </div>
        </div>
      </section>

      <section className="section">
        <Marker num="00" label="The three providers, fast" />
        <div className="trio">
          <article className="trio-card" data-accent="orange">
            <div className="trio-mark"><KeycloakMark size={56} /></div>
            <div className="trio-index">01 / Service</div>
            <h2 className="trio-name">Keycloak</h2>
            <div className="trio-tag">Enterprise IAM</div>
            <p className="trio-body">
              The biggest, oldest, most opinionated box of the three. Brings a
              full admin console, federation, and protocol breadth that the
              other two will not match.
            </p>
            <ul className="trio-list">
              <li>SAML, OIDC, LDAP, Kerberos</li>
              <li>Realms model fits franchise tenancy</li>
              <li>Heavyweight JVM, slower to operate</li>
            </ul>
            <Link to="/keycloak" className="trio-cta">
              <span>Open the study</span>
              <span>&rarr;</span>
            </Link>
          </article>

          <article className="trio-card" data-accent="cobalt">
            <div className="trio-mark"><SuperTokensMark size={56} /></div>
            <div className="trio-index">02 / Service</div>
            <h2 className="trio-name">SuperTokens</h2>
            <div className="trio-tag">Sessions, done right</div>
            <p className="trio-body">
              A focused auth core built around rotating sessions and a recipe
              system. Lighter than Keycloak, more battle-tested than Better
              Auth, with detection baked in.
            </p>
            <ul className="trio-list">
              <li>Rotating refresh, theft detection</li>
              <li>Recipes for password, passwordless, social</li>
              <li>Self-host or managed cloud</li>
            </ul>
            <Link to="/supertokens" className="trio-cta">
              <span>Open the study</span>
              <span>&rarr;</span>
            </Link>
          </article>

          <article className="trio-card" data-accent="brick">
            <div className="trio-mark"><BetterAuthMark size={56} /></div>
            <div className="trio-index">03 / Library</div>
            <h2 className="trio-name">Better Auth</h2>
            <div className="trio-tag">Lives in your code</div>
            <p className="trio-body">
              No second process. Auth is an npm dependency that owns a couple
              of tables in your database. The TypeScript story is the most
              honest of the three.
            </p>
            <ul className="trio-list">
              <li>Plugins for orgs, 2FA, passkeys, magic link</li>
              <li>SQLite, Postgres, MySQL via Kysely</li>
              <li>You operate the surface area</li>
            </ul>
            <Link to="/better-auth" className="trio-cta">
              <span>Open the study</span>
              <span>&rarr;</span>
            </Link>
          </article>
        </div>
      </section>

      <section className="section">
        <Marker num="01" label="What each one actually does" />
        <h2 className="section-head">
          <small>The matrix</small>
          Capability, side by side.
        </h2>
        <div className="matrix-wrap">
          <table className="matrix">
            <thead>
              <tr>
                <th>Capability</th>
                <th>Keycloak</th>
                <th>SuperTokens</th>
                <th>Better Auth</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.capability}>
                  <td>{row.capability}</td>
                  {row.cells.map((cell, i) => (
                    <td key={i}>{renderCell(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <Marker num="02" label="When to pick what" />
        <h2 className="section-head">
          <small>Decision sketch</small>
          Three honest defaults.
        </h2>
        <div className="guidance">
          <div className="guidance-cell" data-accent="orange">
            <span className="guidance-tag">Pick Keycloak when</span>
            <h3 className="guidance-head">You sell into IT</h3>
            <p>
              Customers ask for SAML, want their AD users mirrored, and audit
              your IdP. Keycloak treats those as table stakes. Accept the JVM
              footprint as the cost of doing business.
            </p>
          </div>
          <div className="guidance-cell" data-accent="ink">
            <span className="guidance-tag">Pick SuperTokens when</span>
            <h3 className="guidance-head">Sessions are the work</h3>
            <p>
              Long-lived sessions, mobile clients, refresh rotation, anomaly
              detection. SuperTokens gets these right out of the box and gives
              you a recipe layer to compose the rest without writing it.
            </p>
          </div>
          <div className="guidance-cell" data-accent="paper">
            <span className="guidance-tag">Pick Better Auth when</span>
            <h3 className="guidance-head">You ship the product</h3>
            <p>
              Small team, TypeScript stack, one database. Better Auth removes a
              service from the architecture and gives you typed calls all the
              way to the client. Add plugins as scope grows.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
