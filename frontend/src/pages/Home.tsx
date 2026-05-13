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
    ifText: 'A customer wants SAML',
    body: "They've got an Active Directory, they want SCIM provisioning, and someone on their side will read the SAML assertion before the contract gets signed.",
    pick: 'Keycloak',
    pickId: 'keycloak',
  },
  {
    num: '02',
    ifText: 'Sessions last weeks on mobile',
    body: 'A stolen refresh token is a real problem because the session never ends. You need rotation and you need it to kill the session when something looks wrong.',
    pick: 'SuperTokens',
    pickId: 'supertokens',
  },
  {
    num: '03',
    ifText: 'Two of you, shipping a product',
    body: "One database. One deploy. You don't have the headroom to run a second service and you don't want to.",
    pick: 'Better Auth',
    pickId: 'better-auth',
  },
  {
    num: '04',
    ifText: 'You sell into healthcare or finance',
    body: 'Audit logs, fine-grained permissions, and a console the security team can poke at are non-negotiable. Not maybe, not eventually.',
    pick: 'Keycloak',
    pickId: 'keycloak',
  },
  {
    num: '05',
    ifText: 'Magic link and 2FA are next quarter',
    body: "You don't want to stitch four libraries together to land those features. You want one place to turn them on.",
    pick: 'SuperTokens',
    pickId: 'supertokens',
  },
  {
    num: '06',
    ifText: 'Users live next to the rest of your data',
    body: "You already trust Prisma or Drizzle. Users should be in the same migration history as orders and devices, not in a separate database run by another tool.",
    pick: 'Better Auth',
    pickId: 'better-auth',
  },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-eyebrow">Noah Controls / Auth writeup</div>
          <h1 className="hero-title">
            Three auth providers.<br />
            <em>One demo each.</em>
          </h1>
          <div className="hero-lede">
            <p>
              We were asked to pick an auth provider for the new product, so we
              built the same login against three of them and wrote down what we
              found. Nineteen rows in the matrix, six scenarios after that.
            </p>
            <p>Our pick is at the bottom.</p>
          </div>
          <div className="hero-meta">
            <div>Providers<b>03</b></div>
            <div>Features checked<b>19</b></div>
            <div>Scenarios<b>06</b></div>
            <div>Picks<b>01</b></div>
          </div>
        </div>
      </section>

      <section className="section">
        <Marker num="00" label="Meet the three" />
        <div className="trio">
          <article className="trio-card" data-accent="orange">
            <div className="trio-mark"><KeycloakMark size={36} /></div>
            <div className="trio-index">01 / Own server</div>
            <h2 className="trio-name">Keycloak</h2>
            <div className="trio-tag">Built by Red Hat</div>
            <p className="trio-body">
              It's a separate server. Users sign in on Keycloak's pages and
              your app gets a signed token back. If you've sold into an IT
              department before, you've probably seen it.
            </p>
            <ul className="trio-list">
              <li>Speaks SAML, OIDC, LDAP, Kerberos</li>
              <li>Real admin UI for users and roles</li>
              <li>Java. Wants about a gig of RAM</li>
            </ul>
            <Link to="/keycloak" className="trio-cta">
              <span>Read the writeup</span>
              <span>&rarr;</span>
            </Link>
          </article>

          <article className="trio-card" data-accent="cobalt">
            <div className="trio-mark"><SuperTokensMark size={36} /></div>
            <div className="trio-index">02 / Server + SDK</div>
            <h2 className="trio-name">SuperTokens</h2>
            <div className="trio-tag">Sessions you don't write yourself</div>
            <p className="trio-body">
              A small server plus a Node SDK. The SDK does the work, the
              server stores users and rotates session cookies. They'll host
              it for you if you don't want to.
            </p>
            <ul className="trio-list">
              <li>Rotating refresh tokens, on by default</li>
              <li>Password, magic link, social, MFA, all opt-in</li>
              <li>Self-host or pay them to host it</li>
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
            <div className="trio-tag">Lives in your repo</div>
            <p className="trio-body">
              Not a server. You npm install it, point it at your database, and
              it adds the tables it needs. Calls between server and client are
              typed. Plugins cover the rest.
            </p>
            <ul className="trio-list">
              <li>Plugins: orgs, 2FA, passkeys, magic link</li>
              <li>SQLite, Postgres, MySQL, libSQL</li>
              <li>Auth runs in your process. The security is on you</li>
            </ul>
            <Link to="/better-auth" className="trio-cta">
              <span>Read the writeup</span>
              <span>&rarr;</span>
            </Link>
          </article>
        </div>
      </section>

      <section className="section">
        <Marker num="01" label="What's in the box" />
        <h2 className="section-head">
          <small>The matrix</small>
          Nineteen things we checked.
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
        <Marker num="02" label="If / then" />
        <h2 className="section-head">
          <small>Scenarios</small>
          Six situations, six answers.
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
        <Marker num="03" label="Our take" />
        <div className="recommendation">
          <div className="rec-eyebrow">Our take, after a week of poking at all three</div>
          <h2 className="rec-headline">
            Start on <em>Better Auth</em>. Keep Keycloak in your back pocket.
          </h2>
          <div className="rec-pick">
            <div className="rec-pick-tag">Our pick</div>
            <div className="rec-pick-name">Better Auth</div>
          </div>

          <div className="rec-cols">
            <div className="rec-col">
              <h4>Why this fits</h4>
              <ul>
                <li>One Postgres, one deploy, no extra container to babysit</li>
                <li>Sign in and session are typed end to end</li>
                <li>Plugins cover the next year of work: orgs, 2FA, magic link</li>
                <li>Users sit in the same database as orders and devices</li>
              </ul>
            </div>
            <div className="rec-col">
              <h4>What it won't do</h4>
              <ul>
                <li>No admin UI. You'll build a thin user list</li>
                <li>No SAML. No LDAP. Don't expect either</li>
                <li>It's young. Expect breaking changes on minor bumps</li>
                <li>Auth lives in your repo, so the audit story is on you</li>
              </ul>
            </div>
            <div className="rec-col">
              <h4>If things change</h4>
              <ul>
                <li>Add Keycloak the first time a customer asks for SAML</li>
                <li>Switch to SuperTokens if mobile sessions become a risk</li>
                <li>Either can sit behind a flag, routed per tenant</li>
                <li>Exporting users out of Better Auth is straightforward</li>
              </ul>
            </div>
          </div>

          <div className="rec-plan">
            <div className="rec-plan-cell">
              <div className="rec-plan-tag">Week 01</div>
              <div className="rec-plan-title">Drop it in</div>
              <p className="rec-plan-body">
                Add Better Auth to the Nest app, point it at Postgres, get
                email and password working with a session cookie. Move the
                existing users over while you're there.
              </p>
            </div>
            <div className="rec-plan-cell">
              <div className="rec-plan-tag">Week 02</div>
              <div className="rec-plan-title">Turn on plugins</div>
              <p className="rec-plan-body">
                Organizations plugin so each tenant has its own scope. Magic
                link for forgotten passwords. TOTP behind a user setting for
                anyone who wants 2FA.
              </p>
            </div>
            <div className="rec-plan-cell">
              <div className="rec-plan-tag">Week 03</div>
              <div className="rec-plan-title">Build the bits it doesn't ship</div>
              <p className="rec-plan-body">
                A user list page, a force-logout button, and an audit log fed
                by Better Auth hooks. Nothing fancy, just the screens the
                support team will ask for.
              </p>
            </div>
            <div className="rec-plan-cell">
              <div className="rec-plan-tag">Trigger</div>
              <div className="rec-plan-title">When Keycloak comes in</div>
              <p className="rec-plan-body">
                A signed contract that wants SAML, SCIM, or AD federation.
                Stand Keycloak up alongside and route that tenant through it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <Marker num="04" label="What would change our minds" />
        <h2 className="section-head">
          <small>Escape hatches</small>
          Three things that flip the call.
        </h2>
        <div className="escape">
          <div className="escape-cell">
            <div className="escape-tag">If / SAML</div>
            <h3 className="escape-title">A buyer wants SAML before you've hit product-market fit.</h3>
            <p>
              Skip Better Auth. Use Keycloak from day one. Once a customer
              has wired their AD into your IdP, moving them off costs you
              weeks and a lot of goodwill.
            </p>
          </div>
          <div className="escape-cell">
            <div className="escape-tag">If / Mobile</div>
            <h3 className="escape-title">The product turns into a mobile app.</h3>
            <p>
              Move to SuperTokens. Stolen refresh tokens are mostly a mobile
              problem and they're worth detecting properly. Better to do
              this before the first bug report, not after.
            </p>
          </div>
          <div className="escape-cell">
            <div className="escape-tag">If / Scale</div>
            <h3 className="escape-title">Auth gets a full-time owner.</h3>
            <p>
              Once the team is past a dozen engineers and someone owns auth
              all day, a separate service stops being overhead. Either
              Keycloak or SuperTokens fits fine.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <Marker num="05" label="Short version" />
        <h2 className="section-head">
          <small>Same call, fewer words</small>
          Pick by who you sell to.
        </h2>
        <div className="guidance">
          <div className="guidance-cell" data-accent="orange">
            <span className="guidance-tag">Keycloak when</span>
            <h3 className="guidance-head">Your customers are IT teams</h3>
            <p>
              They want SAML. They want their AD users in your app. They will
              audit your identity provider. Keycloak does all of it. You pay
              for it in JVM memory and config time.
            </p>
          </div>
          <div className="guidance-cell" data-accent="ink">
            <span className="guidance-tag">SuperTokens when</span>
            <h3 className="guidance-head">Sessions are the hard part</h3>
            <p>
              Long-lived sessions, mobile clients, refresh tokens that need to
              rotate and refuse to be reused. SuperTokens handles all of that
              without you writing it. Magic link and MFA are right there too.
            </p>
          </div>
          <div className="guidance-cell" data-accent="paper">
            <span className="guidance-tag">Better Auth when</span>
            <h3 className="guidance-head">You're trying to ship</h3>
            <p>
              Small team, TypeScript, one database. Better Auth takes a moving
              part out of your architecture and gives you typed calls. Add
              plugins when you actually need them.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
