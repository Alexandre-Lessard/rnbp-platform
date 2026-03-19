export type OAuthProvider = "google" | "microsoft";

// ── Base64url encoding ───────────────────────────────────────────────

function base64urlEncode(buffer: Uint8Array): string {
  const str = btoa(String.fromCharCode(...buffer));
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// ── State (anti-CSRF) ───────────────────────────────────────────────

export function generateState(provider: OAuthProvider): string {
  const state = crypto.randomUUID();
  sessionStorage.setItem(`oauth_state_${provider}`, state);
  return state;
}

export function verifyState(provider: OAuthProvider, state: string): boolean {
  const stored = sessionStorage.getItem(`oauth_state_${provider}`);
  sessionStorage.removeItem(`oauth_state_${provider}`);
  return stored === state;
}

// ── PKCE ─────────────────────────────────────────────────────────────

export async function generatePKCE(
  provider: OAuthProvider,
): Promise<{ codeVerifier: string; codeChallenge: string }> {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const codeVerifier = base64urlEncode(array);

  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(codeVerifier),
  );
  const codeChallenge = base64urlEncode(new Uint8Array(hash));

  sessionStorage.setItem(`oauth_code_verifier_${provider}`, codeVerifier);
  return { codeVerifier, codeChallenge };
}

export function getCodeVerifier(provider: OAuthProvider): string | null {
  const v = sessionStorage.getItem(`oauth_code_verifier_${provider}`);
  sessionStorage.removeItem(`oauth_code_verifier_${provider}`);
  return v;
}

// ── Build OAuth URL ──────────────────────────────────────────────────

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const MICROSOFT_CLIENT_ID = import.meta.env.VITE_MICROSOFT_CLIENT_ID || "";

function getRedirectUri(provider: OAuthProvider): string {
  return `${window.location.origin}/auth/${provider}/callback`;
}

export function storeOAuthRedirect(redirect: string | null) {
  if (redirect) {
    sessionStorage.setItem("oauth_redirect", redirect);
  }
}

export function getOAuthRedirect(): string | null {
  const v = sessionStorage.getItem("oauth_redirect");
  sessionStorage.removeItem("oauth_redirect");
  return v;
}

export async function buildOAuthUrl(
  provider: OAuthProvider,
): Promise<string> {
  const state = generateState(provider);
  const { codeChallenge } = await generatePKCE(provider);
  const redirectUri = getRedirectUri(provider);

  if (provider === "google") {
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      state,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }

  // Microsoft
  const params = new URLSearchParams({
    client_id: MICROSOFT_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid profile email",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });
  return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params}`;
}
