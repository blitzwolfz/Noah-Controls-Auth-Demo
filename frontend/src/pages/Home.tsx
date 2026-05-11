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
    capability: 'Two-factor (TOTP)',
    cells: [
      { tone: 'yes', label: 'Yes' },
      { tone: 'yes', label: 'Recipe' },
      { tone: 'yes', label: 'Plugin' },
    ],
  },
  {
    capability: 'Organizations / multi-tenant',
    cells: [
      { tone: 'yes', label: 'Realms', note: 'Hard separation' },
      { tone: 'partial', label: 'Tenants', note: 'Add-on' },
      { tone: 'yes', label: 'Plugin', note: 'In-app model' },
    ],
  },
  {
    capability: 'Role / permission model',
    cells: [
      { tone: 'yes', label: 'Deep', note: 'UMA 2.0' },
      { tone: 'partial', label: 'Roles' },
      { tone: 'partial', label: 'Roles plugin' },
    ],
  },
  {
    capability: 'Audit log',
    cells: [
      { tone: 'yes', label: 'Built in' },
      { tone: 'partial', label: 'Events' },
      { tone: 'no', label: 'DIY' },
    ],
  },
  {
    capability: 'Email templates',
    cells: [
      { tone: 'yes', label: 'Themed' },
      { tone: 'yes', label: 'Hookable' },
      { tone: 'yes', label: 'Send hook' },
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
      { tone: 'yes', label: 'iOS / Android' },
      { tone: 'yes', label: 'iOS / Android / RN' },
      { tone: 'partial', label: 'Via REST' },
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
    capability: 'Hosted option',
    cells: [
      { tone: 'partial', label: 'Cloudiam, Phase Two' },
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
    capability: 'Operational weight',
    cells: [
      { tone: 'no', label: 'Heavy', note: 'JVM, Postgres' },
      { tone: 'partial', label: 'Medium', note: 'Core service' },
      { tone: 'yes', label: 'Light', note: 'No extra service' },
    ],
  },
  {
    capability: 'Time to first login',
    cells: [
      { tone: 'no', label: '1 to 2 days', note: 'Realm setup' },
      { tone: 'partial', label: 'Half day' },
      { tone: 'yes', label: 'Under 1 hr' },
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
    ifText: 'If the next contract asks for SAML',
    body: 'A procurement-led customer wants their AD users mirrored into your app, with SCIM provisioning and a SAML SSO assertion.',
    pick: 'Keycloak',
    pickId: 'keycloak',
  },
  {
    num: '02',
    ifText: 'If users live in the app for hours on mobile',
    body: 'Long-lived mobile sessions with rotating refresh tokens and detection of stolen credentials matter more than any other feature.',
    pick: 'SuperTokens',
    pickId: 'supertokens',
  },
  {
    num: '03',
    ifText: 'If the team is two engineers shipping a product',
    body: 'You want one deploy, one database, typed calls, and zero hours spent operating a second auth service.',
    pick: 'Better Auth',
    pickId: 'better-auth',
  },
  {
    num: '04',
    ifText: 'If you sell into regulated industries',
    body: 'Audit logs, fine-grained authorization, a hardened admin console, and a track record of penetration testing are non-negotiable.',
    pick: 'Keycloak',
    pickId: 'keycloak',
  },
  {
    num: '05',
    ifText: 'If passwordless and MFA are on the next milestone',
    body: 'Magic link, TOTP, and recovery codes need to ship without weeks of integration work or pulling in a stack of side libraries.',
    pick: 'SuperTokens',
    pickId: 'supertokens',
  },
  {
    num: '06',
    ifText: 'If the auth schema needs to share migrations with your data',
    body: 'You already run Prisma or Drizzle. You want users in the same migration history as orders and devices, not in a separate database.',
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
            <p>Keycloak. SuperTokens. Better Auth. One demo each, plus a recommendation.</p>
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
          Nineteen rows, three columns, no marketing.
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
        <Marker num="02" label="Reasoning, scenario by scenario" />
        <h2 className="section-head">
          <small>If / then</small>
          The shape of the work picks the tool.
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
                <span className="scenario-arrow">Lead with</span>
                <span className="scenario-winner" data-id={s.pickId}>{s.pick}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <Marker num="03" label="Our recommendation for Noah Controls" />
        <div className="recommendation">
          <div className="rec-eyebrow">From the integration team / Noah Controls auth study</div>
          <h2 className="rec-headline">
            Ship on <em>Better Auth</em>. Keep Keycloak as the escape hatch.
          </h2>
          <div className="rec-pick">
            <div className="rec-pick-tag">The pick</div>
            <div className="rec-pick-name">Better Auth</div>
          </div>

          <div className="rec-cols">
            <div className="rec-col">
              <h4>Why it fits Noah Controls</h4>
              <ul>
                <li>One deploy, one database, one migration history</li>
                <li>Typed signin and session calls, no hand-written fetch</li>
                <li>Plugins land what you actually need: orgs, 2FA, magic link</li>
                <li>Auth schema lives next to the rest of your data</li>
              </ul>
            </div>
            <div className="rec-col">
              <h4>Where it costs you</h4>
              <ul>
                <li>No admin console, build a thin user list yourself</li>
                <li>No SAML, no LDAP federation</li>
                <li>Youngest of the three, expect a breaking minor</li>
                <li>You own the security boundary in your repo</li>
              </ul>
            </div>
            <div className="rec-col">
              <h4>What we'd hold in reserve</h4>
              <ul>
                <li>Keycloak for the first SAML-led enterprise deal</li>
                <li>SuperTokens if mobile session theft becomes the threat</li>
                <li>Both wrap behind the same provider abstraction</li>
                <li>Migration story: export users, replay password resets</li>
              </ul>
            </div>
          </div>

          <div className="rec-plan">
            <div className="rec-plan-cell">
              <div className="rec-plan-tag">Week 01</div>
              <div className="rec-plan-title">Drop in Better Auth</div>
              <p className="rec-plan-body">
                Email + password, session cookie, profile route. Run against
                Postgres. Migrate the existing demo users.
              </p>
            </div>
            <div className="rec-plan-cell">
              <div className="rec-plan-tag">Week 02</div>
              <div className="rec-plan-title">Wire the plugins</div>
              <p className="rec-plan-body">
                Organizations plugin for multi-tenant. Magic link for password
                recovery. TOTP plugin behind a feature flag for opt-in 2FA.
              </p>
            </div>
            <div className="rec-plan-cell">
              <div className="rec-plan-tag">Week 03</div>
              <div className="rec-plan-title">Build the thin admin</div>
              <p className="rec-plan-body">
                A user list, a force-logout button, an audit log table fed by
                Better Auth hooks. The bits the library does not ship.
              </p>
            </div>
            <div className="rec-plan-cell">
              <div className="rec-plan-tag">Trigger</div>
              <div className="rec-plan-title">When to switch to Keycloak</div>
              <p className="rec-plan-body">
                A signed contract that requires SAML, SCIM, or AD federation.
                Stand up Keycloak alongside, broker through it for that tenant.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <Marker num="04" label="Escape clauses, written down" />
        <h2 className="section-head">
          <small>What changes the call</small>
          Three signals that flip the pick.
        </h2>
        <div className="escape">
          <div className="escape-cell">
            <div className="escape-tag">Signal / SAML</div>
            <h3 className="escape-title">A buyer asks for SAML before product-market fit.</h3>
            <p>
              Skip Better Auth. Start on Keycloak now. The cost of swapping
              IdPs later, after customer assertions are live, is meaningful.
            </p>
          </div>
          <div className="escape-cell">
            <div className="escape-tag">Signal / Mobile</div>
            <h3 className="escape-title">The product becomes mostly a mobile app.</h3>
            <p>
              SuperTokens earns its keep with refresh rotation and theft
              detection across long-lived mobile sessions. Move before the
              first incident, not after.
            </p>
          </div>
          <div className="escape-cell">
            <div className="escape-tag">Signal / Scale</div>
            <h3 className="escape-title">Auth becomes its own product surface.</h3>
            <p>
              If the team grows past a dozen engineers and auth needs an owner,
              a dedicated service stops being overhead and starts being
              structure. Keycloak or SuperTokens both qualify.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <Marker num="05" label="When to pick what" />
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
