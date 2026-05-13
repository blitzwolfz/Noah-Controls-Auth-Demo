import { Link } from 'react-router-dom';
import Marker from '../components/Marker';
import { KeycloakMark, SuperTokensMark, BetterAuthMark } from '../components/Marks';

type Cell = { tone: 'yes' | 'no' | 'partial'; label: string; note?: string };

const rows: { capability: string; cells: [Cell, Cell, Cell] }[] = [
  {
    capability: 'How it runs',
    cells: [
      { tone: 'yes', label: 'Own server', note: 'Java, Quarkus' },
      { tone: 'yes', label: 'Own server', note: 'Plus a Node SDK' },
      { tone: 'yes', label: 'Library', note: 'Inside your app' },
    ],
  },
  {
    capability: 'Admin UI',
    cells: [
      { tone: 'yes', label: 'Yes', note: 'Real one' },
      { tone: 'yes', label: 'Yes', note: 'User dashboard' },
      { tone: 'no', label: 'No', note: "You'll build one" },
    ],
  },
  {
    capability: 'SAML',
    cells: [
      { tone: 'yes', label: 'Yes', note: 'Both ends' },
      { tone: 'no', label: 'No' },
      { tone: 'no', label: 'No' },
    ],
  },
  {
    capability: 'OIDC',
    cells: [
      { tone: 'yes', label: 'Yes' },
      { tone: 'yes', label: 'Yes' },
      { tone: 'partial', label: 'Plugin' },
    ],
  },
  {
    capability: 'LDAP / AD',
    cells: [
      { tone: 'yes', label: 'Yes' },
      { tone: 'no', label: 'No' },
      { tone: 'no', label: 'No' },
    ],
  },
  {
    capability: 'Stolen-token detection',
    cells: [
      { tone: 'partial', label: 'You set it up' },
      { tone: 'yes', label: 'Built in', note: 'Rotating refresh' },
      { tone: 'partial', label: 'Per session' },
    ],
  },
  {
    capability: 'Magic link',
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
    capability: '2FA (TOTP)',
    cells: [
      { tone: 'yes', label: 'Built in' },
      { tone: 'yes', label: 'Built in' },
      { tone: 'yes', label: 'Plugin' },
    ],
  },
  {
    capability: 'Organizations',
    cells: [
      { tone: 'yes', label: 'Realms', note: 'Hard split' },
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
      { tone: 'no', label: 'DIY' },
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
      { tone: 'no', label: 'No', note: 'OpenAPI specs' },
      { tone: 'partial', label: 'Typed SDK' },
      { tone: 'yes', label: 'Full', note: 'Server to client' },
    ],
  },
  {
    capability: 'Hosted option',
    cells: [
      { tone: 'partial', label: 'Third parties' },
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
    capability: 'Footprint',
    cells: [
      { tone: 'no', label: 'Heavy', note: 'JVM, Postgres' },
      { tone: 'partial', label: 'Medium' },
      { tone: 'yes', label: 'Light', note: 'Nothing extra' },
    ],
  },
  {
    capability: 'Time to first login',
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
    ifText: 'Engineers enter data for one building only',
    body: 'Per-building permissions are a Phase 1 deliverable. Each engineer should see and edit their assigned buildings, nothing else. RBAC plus resource scoping handles this.',
    pick: 'SuperTokens',
    pickId: 'supertokens',
  },
  {
    num: '02',
    ifText: 'A Noah Controls customer needs corporate SSO',
    body: "A building owner asks that their staff sign in with the company Active Directory, with SAML on their end. Out of the three open-source picks we shortlisted, only Keycloak does this without bolt-ons.",
    pick: 'Keycloak',
    pickId: 'keycloak',
  },
  {
    num: '03',
    ifText: 'Phase 1 needs to land by May 18',
    body: "Advanced user management and granular permissions are due in six weeks. The auth layer should not be the bottleneck. Speed of integration matters more than feature depth.",
    pick: 'SuperTokens',
    pickId: 'supertokens',
  },
  {
    num: '04',
    ifText: 'Cloud VMs are kept cost-effective',
    body: "The plan calls for small cloud VMs with budget alerts. A second container with a JVM and its own Postgres is overhead we would rather avoid this early.",
    pick: 'Better Auth',
    pickId: 'better-auth',
  },
  {
    num: '05',
    ifText: 'MFA goes live before any pilot building',
    body: "Property managers handle controls that change set-points on real equipment. Two-factor for those roles is not optional. SuperTokens has it as a recipe, no extra integration.",
    pick: 'SuperTokens',
    pickId: 'supertokens',
  },
  {
    num: '06',
    ifText: 'Users sit in the same schema as building data',
    body: "Building envelopes, utility bills, and device packages all live in one Postgres. There is a real case for the user table to sit next to them under the same migration history.",
    pick: 'Better Auth',
    pickId: 'better-auth',
  },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-eyebrow">Noah Controls &times; GBC / Energy Profiling Portal</div>
          <h1 className="hero-title">
            Picking auth for<br />
            <em>the portal.</em>
          </h1>
          <div className="hero-lede">
            <p>
              Phase 1 of the Energy Profiling Portal needs advanced user
              management and granular content permissions before engineers
              start entering building data on April 6. This page walks
              through the three open-source options we prototyped against the
              same NestJS backend.
            </p>
            <p>The pick for the project sits at the bottom.</p>
          </div>
          <div className="hero-meta">
            <div>Prototyped<b>03</b></div>
            <div>Features checked<b>19</b></div>
            <div>Scenarios<b>06</b></div>
            <div>Also evaluated<b>03</b></div>
          </div>
        </div>
      </section>

      <section className="section">
        <Marker num="00" label="The three we prototyped" />
        <div className="trio">
          <article className="trio-card" data-accent="orange">
            <div className="trio-mark"><KeycloakMark size={36} /></div>
            <div className="trio-index">01 / Enterprise IAM</div>
            <h2 className="trio-name">Keycloak</h2>
            <div className="trio-tag">Built by Red Hat</div>
            <p className="trio-body">
              The mature enterprise option. The natural pick if a Noah
              Controls customer ever asks for SAML or wants their corporate
              Active Directory wired into the portal.
            </p>
            <ul className="trio-list">
              <li>Built-in SSO, MFA, RBAC, OAuth2 / OIDC / SAML</li>
              <li>Pulls users from LDAP and AD</li>
              <li>Heavyweight. JVM plus its own Postgres</li>
            </ul>
            <Link to="/keycloak" className="trio-cta">
              <span>Read the writeup</span>
              <span>&rarr;</span>
            </Link>
          </article>

          <article className="trio-card" data-accent="cobalt">
            <div className="trio-mark"><SuperTokensMark size={36} /></div>
            <div className="trio-index">02 / Developer-focused</div>
            <h2 className="trio-name">SuperTokens</h2>
            <div className="trio-tag">Best balance of simplicity and depth</div>
            <p className="trio-body">
              A small core plus a Node SDK. RBAC and session management are
              first-class. Our eval doc already flagged this as the best
              balance of simplicity and enterprise capability, and it held
              up in the prototype.
            </p>
            <ul className="trio-list">
              <li>RBAC, sessions, MFA, social login as recipes</li>
              <li>Strong React and TypeScript developer experience</li>
              <li>Custom login UI is the default path, not the exception</li>
            </ul>
            <Link to="/supertokens" className="trio-cta">
              <span>Read the writeup</span>
              <span>&rarr;</span>
            </Link>
          </article>

          <article className="trio-card" data-accent="brick">
            <div className="trio-mark"><BetterAuthMark size={36} /></div>
            <div className="trio-index">03 / Library</div>
            <h2 className="trio-name">Better Auth</h2>
            <div className="trio-tag">No second service to run</div>
            <p className="trio-body">
              An option we added on top of the brief because the portal is
              TypeScript-first. It runs inside the NestJS process and writes
              its tables into the same Postgres as the building data.
            </p>
            <ul className="trio-list">
              <li>No extra container, no extra database</li>
              <li>Plugins for orgs, 2FA, passkeys, magic link</li>
              <li>Youngest of the three, treat the security boundary with care</li>
            </ul>
            <Link to="/better-auth" className="trio-cta">
              <span>Read the writeup</span>
              <span>&rarr;</span>
            </Link>
          </article>
        </div>
      </section>

      <section className="section">
        <Marker num="01" label="Feature matrix" />
        <h2 className="section-head">
          <small>What's actually there</small>
          Nineteen rows, mapped against the project requirements.
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
        <Marker num="02" label="Project scenarios" />
        <h2 className="section-head">
          <small>Real situations from the project</small>
          Six things that will actually happen.
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
        <Marker num="03" label="Recommendation" />
        <div className="recommendation">
          <div className="rec-eyebrow">For Phase 1 of the Energy Profiling Portal</div>
          <h2 className="rec-headline">
            Build Phase 1 on <em>Better Auth</em>. SuperTokens and Keycloak stay on the bench.
          </h2>
          <div className="rec-pick">
            <div className="rec-pick-tag">The pick</div>
            <div className="rec-pick-name">Better Auth</div>
          </div>

          <div className="rec-cols">
            <div className="rec-col">
              <h4>Why this fits the portal</h4>
              <ul>
                <li>One Postgres, one deploy, no second container to operate</li>
                <li>Auth tables sit next to building envelope and utility data</li>
                <li>Sign in and session are typed end to end into the React app</li>
                <li>Plugins cover orgs, 2FA, magic link as Phase 2 needs them</li>
                <li>Smallest footprint, matches the cost-effective VM target</li>
              </ul>
            </div>
            <div className="rec-col">
              <h4>What it won't do</h4>
              <ul>
                <li>No admin UI. The user-management page is on us to build</li>
                <li>No SAML, no LDAP federation, no Active Directory</li>
                <li>Newest of the three, expect breaking changes on minor bumps</li>
                <li>Security boundary lives in the app repo, not behind a service</li>
              </ul>
            </div>
            <div className="rec-col">
              <h4>If things change</h4>
              <ul>
                <li>Add Keycloak the first time a customer asks for SAML or AD</li>
                <li>Move to SuperTokens if MFA or hardened sessions become urgent</li>
                <li>Either can run alongside, routed per tenant behind a flag</li>
                <li>User export from Better Auth is straightforward, we checked</li>
              </ul>
            </div>
          </div>

          <div className="rec-plan">
            <div className="rec-plan-cell">
              <div className="rec-plan-tag">By Apr 26</div>
              <div className="rec-plan-title">Better Auth in the NestJS backend</div>
              <p className="rec-plan-body">
                Install Better Auth, point it at the project Postgres, run the
                migration. Email and password, session cookies, custom React
                login. Three roles to start: building_admin, engineer, viewer.
              </p>
            </div>
            <div className="rec-plan-cell">
              <div className="rec-plan-tag">By May 10</div>
              <div className="rec-plan-title">Granular per-building permissions</div>
              <p className="rec-plan-body">
                Map each user to the buildings they can see or edit. Enforce on
                every API route that reads or writes envelope, utility, or
                weather data.
              </p>
            </div>
            <div className="rec-plan-cell">
              <div className="rec-plan-tag">By May 17</div>
              <div className="rec-plan-title">Admin tools and audit log</div>
              <p className="rec-plan-body">
                Build the user-management page that Better Auth does not ship.
                Pipe Better Auth hooks into an audit table to satisfy the
                Phase 1 closure criteria.
              </p>
            </div>
            <div className="rec-plan-cell">
              <div className="rec-plan-tag">Trigger</div>
              <div className="rec-plan-title">When to swap providers</div>
              <p className="rec-plan-body">
                Keycloak comes in for the first SAML or Active Directory
                customer. SuperTokens comes in if hardened sessions or MFA
                land on a near-term roadmap.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <Marker num="04" label="What would change the call" />
        <h2 className="section-head">
          <small>Escape hatches</small>
          Three signals that swing the recommendation.
        </h2>
        <div className="escape">
          <div className="escape-cell">
            <div className="escape-tag">If / SAML</div>
            <h3 className="escape-title">A building owner wants SAML on day one.</h3>
            <p>
              Start on Keycloak instead. Once a customer has wired their
              Active Directory into the portal's identity provider, moving
              them off costs weeks of work and a lot of goodwill.
            </p>
          </div>
          <div className="escape-cell">
            <div className="escape-tag">If / Authorization</div>
            <h3 className="escape-title">Permissions get fine-grained per device.</h3>
            <p>
              If Phase 2 needs rules like "this engineer can change setpoints
              on boilers but only read chiller telemetry", that is what Ory
              Keto was built for. RBAC alone starts to strain at that level.
            </p>
          </div>
          <div className="escape-cell">
            <div className="escape-tag">If / Sessions</div>
            <h3 className="escape-title">MFA and hardened sessions land soon.</h3>
            <p>
              If two-factor and refresh token rotation become near-term
              requirements before the first pilot building, switch to
              SuperTokens. It ships those as built-ins rather than as
              plugins to wire up.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <Marker num="05" label="Also evaluated, not prototyped" />
        <h2 className="section-head">
          <small>From the wider eval doc</small>
          Three more options we read but did not build against.
        </h2>
        <div className="escape">
          <div className="escape-cell">
            <div className="escape-tag">Option / Ory</div>
            <h3 className="escape-title">Ory Kratos plus Ory Keto.</h3>
            <p>
              Strongest separation between authentication (Kratos) and
              authorization (Keto). The right pick if the long-term
              architecture turns into a multi-service platform with
              fine-grained permissions. More operational overhead than
              SuperTokens. Worth a real prototype if Phase 2 grows.
            </p>
          </div>
          <div className="escape-cell">
            <div className="escape-tag">Option / Zitadel</div>
            <h3 className="escape-title">Modern alternative to Keycloak.</h3>
            <p>
              Cloud-native identity platform with cleaner developer ergonomics
              than Keycloak. Less mature, smaller community. A reasonable
              middle ground if Keycloak feels heavy but enterprise integration
              still matters.
            </p>
          </div>
          <div className="escape-cell">
            <div className="escape-tag">Option / Authentik</div>
            <h3 className="escape-title">Infrastructure-leaning self-host.</h3>
            <p>
              Open-source identity provider built around self-hosting and
              internal tooling. Strong admin UI. Less frontend-developer
              focused than the others, so it fits less naturally with a
              custom React portal.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <Marker num="06" label="Short version" />
        <h2 className="section-head">
          <small>Same call, fewer words</small>
          Pick by what the customer actually needs.
        </h2>
        <div className="guidance">
          <div className="guidance-cell" data-accent="orange">
            <span className="guidance-tag">Keycloak when</span>
            <h3 className="guidance-head">Enterprise integration is the contract</h3>
            <p>
              Customers want SAML. They want their Active Directory users in
              the portal. They will audit your identity provider. Keycloak
              does all of it. The cost is the JVM footprint and config time.
            </p>
          </div>
          <div className="guidance-cell" data-accent="ink">
            <span className="guidance-tag">SuperTokens when</span>
            <h3 className="guidance-head">Balance of features and operations</h3>
            <p>
              Custom React UI, RBAC, sessions, MFA, social login, all from
              one self-hosted service that does not need a dedicated
              operator. Matches the project's Phase 1 needs.
            </p>
          </div>
          <div className="guidance-cell" data-accent="paper">
            <span className="guidance-tag">Better Auth when</span>
            <h3 className="guidance-head">You want zero extra services</h3>
            <p>
              The portal is TypeScript first. Better Auth runs inside the
              NestJS process and stores users in the same Postgres as the
              building data. Smallest footprint of the three.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
