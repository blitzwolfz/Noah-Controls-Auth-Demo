import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';

let initialized = false;

export function initSuperTokens() {
  if (initialized) return;
  supertokens.init({
    framework: 'express',
    supertokens: {
      connectionURI: process.env.SUPERTOKENS_CONNECTION_URI || 'http://localhost:3567',
    },
    appInfo: {
      appName: 'Noah Controls Auth Demo',
      apiDomain: process.env.SUPERTOKENS_API_BASE || 'http://localhost:4000',
      websiteDomain: process.env.SUPERTOKENS_WEBSITE_BASE || 'http://localhost:5173',
      apiBasePath: '/api/supertokens',
      websiteBasePath: '/supertokens',
    },
    recipeList: [
      EmailPassword.init(),
      Session.init({
        cookieSameSite: 'lax',
        cookieSecure: false,
        getTokenTransferMethod: () => 'cookie',
      }),
    ],
  });
  initialized = true;
}
