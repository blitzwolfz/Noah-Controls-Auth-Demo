import { Link } from 'react-router-dom';
import Marker from '../components/Marker';
import { KeycloakMark, SuperTokensMark, BetterAuthMark } from '../components/Marks';

type Cell = { tone: 'yes' | 'no' | 'partial'; label: string; note?: string };

const rows: { capability: string; cells: [Cell, Cell, Cell] }[] = [
  {
    capability: 'How it runs',
    cells: [
      { tone: 'yes', label: 'Separate server', note: 'Java / Quarkus' },
      { tone: 'yes', label: 'Separate server', note: 'Plus Node SDK' },
      { tone: 'yes', label: 'Library', note: 'Inside your app' },
    ],
  },
  {
    capability: 'Admin console',
    cells: [
      { tone: 'yes', label: 'Yes', note: 'Realms, users, roles' },
      { tone: 'yes', label: 'Yes', note: 'User dashboard' },
      { tone: 'no', label: 'No', note: 'You build it' },
    ],
  },
  {
    capability: 'SAML support',
    cells: [
      { tone: 'yes', label: 'Yes', note: 'Full provider' },
      { tone: 'no', label: 'No' },
      { tone: 'no', label: 'No' },
    ],
  },
  {
    capability: 'OIDC support',
    cells: [
      { tone: 'yes', label: 'Yes' },
      { tone: 'yes', label: 'Yes' },
      { tone: 'partial', label: 'Plugin' },
    ],
  },
  {
    capability: 'LDAP / Active Directory',
    cells: [
      { tone: 'yes', label: 'Yes', note: 'Federated' },
      { tone: 'no', label: 'No' },
      { tone: 'no', label: 'No' },
    ],
  },
  {
    capability: 'Session hijack detection',
    cells: [
      { tone: 'partial', label: 'Manual setup' },
      { tone: 'yes', label: 'Built in', note: 'Refresh rotation' },
      { tone: 'partial', label: 'Per session' },
    ],
  },
  {
    capability: 'Magic link login',
    cells: [
      { tone: 'partial', label: 'Plugin' },
      { tone: 'yes', label: 'Built in' },
      { tone: 'yes', label: 'Plugin' },
    ],
  },
  {
    capability: 'Passkeys',
    cells: [
      { tone: 'yes', label: 'Built in' },
      { tone: 'yes', label: 'Built in' },
      { tone: 'yes', label: 'Plugin' },
    ],
  },
  {
    capability: 'Two-factor (TOTP)',
    cells: [
      { tone: 'yes', label: 'Built in' },
      { tone: 'yes', label: 'Built in' },
      { tone: 'yes', label: 'Plugin' },
    ],
  },
  {
    capability: 'Organizations',
    cells: [
      { tone: 'yes', label: 'Realms', note: 'Strong isolation' },
      { tone: 'partial', label: 'Tenants' },
      { tone: 'yes', label: 'Plugin' },
    ],
  },
  {
    capability: 'Roles and permissions',
    cells: [
      { tone: 'yes', label: 'Deep', note: 'UMA, scopes' },
      { tone: 'partial', label: 'Roles only' },
      { tone: 'partial', label: 'Roles plugin' },
    ],
  },
  {
    capability: 'Audit log',
    cells: [
      { tone: 'yes', label: 'Built in' },
      { tone: 'partial', label: 'Events' },
      { tone: 'no', label: 'You build it' },
    ],
  },
  {
    capability: 'Account linking',
    cells: [
      { tone: 'yes', label: 'Yes' },
      { tone: 'yes', label: 'Yes' },
      { tone: 'yes', label: 'Yes' },
    ],
  },
  {
    capability: 'Mobile SDKs',
    cells: [
      { tone: 'yes', label: 'iOS, Android' },
      { tone: 'yes', label: 'iOS, Android, RN' },
      { tone: 'partial', label: 'Via REST' },
    ],
  },
  {
    capability: 'Typed client',
    cells: [
      { tone: 'no', label: 'No', note: 'OpenAPI specs only' },
      { tone: 'partial', label: 'Typed SDK' },
      { tone: 'yes', label: 'Full', note: 'Server to client' },
    ],
  },
  {
    capability: 'Hosted version available',
    cells: [
      { tone: 'partial', label: 'Third party' },
      { tone: 'yes', label: 'SuperTokens Cloud' },
      { tone: 'no', label: 'Self-host only' },
    ],
  },
  {
    capability: 'License',
    cells: [
      { tone: 'yes', label: 'Apache 2.0' },
      { tone: 'yes', label: 'Apache 2.0' },
      { tone: 'yes', label: 'MIT' },
    ],
  },
  {
    capability: 'Resource footprint',
    cells: [
      { tone: 'no', label: 'Heavy', note: 'JVM, Postgres' },
      { tone: 'partial', label: 'Medium' },
      { tone: 'yes', label: 'Light', note: 'No extra service' },
    ],
  },
  {
    capability: 'Setup time',
    cells: [
      { tone: 'no', label: '1 to 2 days' },
      { tone: 'partial', label: 'Half a day' },
      { tone: 'yes', label: 'Under an hour' },
    ],
  },
];

function renderCell(cell: Cell) {
  const cls = cell.tone === 'yes' ? 'cell-yes' : cell.tone === 'partial' ? 'cell-partial' : 'cell-no';
  return (
    <>
      <span className={cls}>{cell.label}</span>
      {cell.note && <span className="cell-detail">{cell.note}</span>}
    </>
  );
}

type Scenario = {
  num: string;
  ifText: string;
  body: string;
  pick: 'Keycloak' | 'SuperTokens' | 'Better Auth';
  pickId: 'keycloak' | 'supertokens' | 'better-auth';
};

const scenarios: Scenario[] = [
  {
    num: '01',
    ifText: 'A customer asks for SAML',
    body: 'They want their corporate Active Directory users in your app, with SCIM provisioning and a SAML SSO assertion from their side.',
    pick: 'Keycloak',
    pickId: 'keycloak',
  },
  {
    num: '02',
    ifText: 'Users stay logged in on mobile for weeks',
    body: 'Long mobile sessions where refresh token rotation and detection of stolen credentials are important.',
    pick: 'SuperTokens',
    pickId: 'supertokens',
  },
  {
    num: '03',
    ifText: 'The team is two engineers shipping a product',
    body: 'You want one deploy, one database, and typed calls. No time to run a second service.',
    pick: 'Better Auth',
    pickId: 'better-auth',
  },
  {
    num: '04',
    ifText: 'You sell into regulated industries',
    body: 'Audit logs, fine-grained permissions, and a hardened admin console are required, not optional.',
    pick: 'Keycloak',
    pickId: 'keycloak',
  },
  {
    num: '05',
    ifText: 'Passwordless and MFA are on the roadmap',
    body: 'Magic link, TOTP, and recovery codes need to ship soon without stitching together side libraries.',
    pick: 'SuperTokens',
    pickId: 'supertokens',
  },
  {
    num: '06',
    ifText: 'Auth tables need to live with the rest of your data',
    body: 'You already use Prisma or Drizzle. Users belong in the same migration history as orders and devices.',
    pick: 'Better Auth',
    pickId: 'better-auth',
  },
];

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
            <em>Auth</em><br />
            <span className="stroke">Providers,</span><br />
            One Demo.
          </h1>
          <div className="hero-lede">
            <p>
              This site compares Keycloak, SuperTokens, and Better Auth. You
              can sign in with each one and see how it works. The matrix below
              covers nineteen features.
            </p>
            <p>
              The recommendation at the bottom is what we would build with
              today for Noah Controls.
            </p>
          </div>
          <div className="hero-meta">
            <div>Providers<b>03</b></div>
            <div>Features compared<b>19</b></div>
            <div>Scenarios<b>06</b></div>
            <div>Recommendation<b>01</b></div>
          </div>
        </div>
      </section>

      <section className="section">
        <Marker num="00" label="The three providers" />
        <div className="trio">
          <article className="trio-card" data-accent="orange">
            <div className="trio-mark"><KeycloakMark size={56} /></div>
            <div className="trio-index">01 / Server</div>
            <h2 className="trio-name">Keycloak</h2>
            <div className="trio-tag">Self-hosted auth server</div>
            <p className="trio-body">
              A separate server you run alongside your app. Users sign in by
              going to Keycloak, which sends a token back. Used by companies
              that need SAML, OIDC, and Active Directory in one place.
            </p>
            <ul className="trio-list">
              <li>Supports SAML, OIDC, and LDAP</li>
              <li>Admin console for users and roles</li>
              <li>Runs on Java, needs about 1 GB of RAM</li>
            </ul>
            <Link to="/keycloak" className="trio-cta">
              <span>Open the demo</span>
              <span>&rarr;</span>
            </Link>
          </article>

          <article className="trio-card" data-accent="cobalt">
            <div className="trio-mark"><SuperTokensMark size={56} /></div>
            <div className="trio-index">02 / Server + SDK</div>
            <h2 className="trio-name">SuperTokens</h2>
            <div className="trio-tag">Auth server plus Node SDK</div>
            <p className="trio-body">
              A small server that stores users, paired with a Node SDK that
              handles signup, login, and session cookies. The session cookie
              rotates on every refresh.
            </p>
            <ul className="trio-list">
              <li>Refresh token rotation, hijack detection</li>
              <li>Email password, magic link, social, MFA</li>
              <li>Self-host or use SuperTokens Cloud</li>
            </ul>
            <Link to="/supertokens" className="trio-cta">
              <span>Open the demo</span>
              <span>&rarr;</span>
            </Link>
          </article>

          <article className="trio-card" data-accent="brick">
            <div className="trio-mark"><BetterAuthMark size={56} /></div>
            <div className="trio-index">03 / Library</div>
            <h2 className="trio-name">Better Auth</h2>
            <div className="trio-tag">TypeScript library</div>
            <p className="trio-body">
              No separate server. You install it into your app and it adds a
              few tables to your database. Calls between server and client are
              typed end to end.
            </p>
            <ul className="trio-list">
              <li>Plugins for orgs, 2FA, passkeys, magic link</li>
              <li>Works with SQLite, Postgres, MySQL</li>
              <li>You operate the auth code yourself</li>
            </ul>
            <Link to="/better-auth" className="trio-cta">
              <span>Open the demo</span>
              <span>&rarr;</span>
            </Link>
          </article>
        </div>
      </section>

      <section className="section">
        <Marker num="01" label="What each one supports" />
        <h2 className="section-head">
          <small>Feature matrix</small>
          Nineteen features, three providers.
        </h2>
        <div className="matrix-wrap">
          <table className="matrix">
            <thead>
              <tr>
                <th>Feature</th>
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
        <Marker num="02" label="Which one to pick, by scenario" />
        <h2 className="section-head">
          <small>If / then</small>
          Six common situations and the right pick for each.
        </h2>
        <div className="scenarios">
          {scenarios.map((s) => (
            <div className="scenario" key={s.num}>
              <div className="scenario-num">{s.num}</div>
              <div className="scenario-if">If</div>
              <p className="scenario-text">{s.ifText}.</p>
              <div />
              <p className="scenario-text" style={{ fontWeight: 400, fontSize: 14, lineHeight: 1.55 }}>
                {s.body}
              </p>
              <div />
              <div className="scenario-pick">
                <span className="scenario-arrow">Use</span>
                <span className="scenario-winner" data-id={s.pickId}>{s.pick}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <Marker num="03" label="Our recommendation" />
        <div className="recommendation">
          <div className="rec-eyebrow">From the integration team</div>
          <h2 className="rec-headline">
            Use <em>Better Auth</em>. Keep Keycloak ready for enterprise customers.
          </h2>
          <div className="rec-pick">
            <div className="rec-pick-tag">The pick</div>
            <div className="rec-pick-name">Better Auth</div>
          </div>

          <div className="rec-cols">
            <div className="rec-col">
              <h4>Why it fits Noah Controls</h4>
              <ul>
                <li>One database, one deploy, one migration history</li>
                <li>Typed sign in and session calls, no hand-written fetches</li>
                <li>Plugins add organizations, 2FA, and magic link when needed</li>
                <li>Auth tables live next to the rest of your data</li>
              </ul>
            </div>
            <div className="rec-col">
              <h4>Where it costs you</h4>
              <ul>
                <li>No admin console, you build user management</li>
                <li>No SAML, no LDAP federation</li>
                <li>Newer project, occasional breaking changes in minors</li>
                <li>You own the security of the integration</li>
              </ul>
            </div>
            <div className="rec-col">
              <h4>What we hold in reserve</h4>
              <ul>
                <li>Keycloak for the first SAML customer</li>
                <li>SuperTokens if mobile sessions become a problem</li>
                <li>Both can be added later behind a feature flag</li>
                <li>User export is documented for both</li>
              </ul>
            </div>
          </div>

          <div className="rec-plan">
            <div className="rec-plan-cell">
              <div className="rec-plan-tag">Week 01</div>
              <div className="rec-plan-title">Install Better Auth</div>
              <p className="rec-plan-body">
                Email and password signup, login, session cookies. Run against
                your existing Postgres. Migrate the current users.
              </p>
            </div>
            <div className="rec-plan-cell">
              <div className="rec-plan-tag">Week 02</div>
              <div className="rec-plan-title">Add plugins</div>
              <p className="rec-plan-body">
                Organizations plugin for multi-tenant. Magic link for password
                resets. TOTP behind a setting for users who want 2FA.
              </p>
            </div>
            <div className="rec-plan-cell">
              <div className="rec-plan-tag">Week 03</div>
              <div className="rec-plan-title">Build user admin</div>
              <p className="rec-plan-body">
                A user list page, a force-logout button, an audit log fed by
                Better Auth hooks. The pieces the library does not ship.
              </p>
            </div>
            <div className="rec-plan-cell">
              <div className="rec-plan-tag">Trigger</div>
              <div className="rec-plan-title">When to add Keycloak</div>
              <p className="rec-plan-body">
                A signed deal that needs SAML, SCIM, or AD federation. Run
                Keycloak alongside, route that customer through it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <Marker num="04" label="What would change the recommendation" />
        <h2 className="section-head">
          <small>Escape clauses</small>
          Three signals that flip the pick.
        </h2>
        <div className="escape">
          <div className="escape-cell">
            <div className="escape-tag">Signal / SAML</div>
            <h3 className="escape-title">A buyer asks for SAML before product-market fit.</h3>
            <p>
              Do not start with Better Auth. Use Keycloak from day one. Moving
              customers off an identity provider after they integrate with it
              is expensive.
            </p>
          </div>
          <div className="escape-cell">
            <div className="escape-tag">Signal / Mobile</div>
            <h3 className="escape-title">The product becomes mainly a mobile app.</h3>
            <p>
              SuperTokens is worth the extra service. Long mobile sessions are
              where session hijacking actually happens. Move before the first
              incident, not after.
            </p>
          </div>
          <div className="escape-cell">
            <div className="escape-tag">Signal / Scale</div>
            <h3 className="escape-title">Auth becomes its own product surface.</h3>
            <p>
              If the team passes a dozen engineers and auth has a full-time
              owner, a separate auth service stops being overhead. Keycloak or
              SuperTokens both fit.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <Marker num="05" label="Short version" />
        <h2 className="section-head">
          <small>Quick reference</small>
          Pick by team shape and customer type.
        </h2>
        <div className="guidance">
          <div className="guidance-cell" data-accent="orange">
            <span className="guidance-tag">Keycloak when</span>
            <h3 className="guidance-head">You sell to IT departments</h3>
            <p>
              Customers want SAML, want their Active Directory users in your
              app, and audit your identity provider. Keycloak handles all of
              that. The trade-off is the Java footprint.
            </p>
          </div>
          <div className="guidance-cell" data-accent="ink">
            <span className="guidance-tag">SuperTokens when</span>
            <h3 className="guidance-head">Sessions are the hard part</h3>
            <p>
              Long sessions, mobile clients, refresh token rotation, hijack
              detection. SuperTokens does these by default. Recipes cover
              passwordless and MFA without extra libraries.
            </p>
          </div>
          <div className="guidance-cell" data-accent="paper">
            <span className="guidance-tag">Better Auth when</span>
            <h3 className="guidance-head">You are shipping a product</h3>
            <p>
              Small team, TypeScript, one database. Better Auth removes a
              service from the architecture and gives you typed calls. Add
              plugins as scope grows.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
