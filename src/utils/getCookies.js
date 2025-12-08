// src/utils/cookies.js
// Robust cookie utilities: prevents duplicate host/domain cookies, reliably clears cookies.
// SSR-safe, uses VITE_COOKIE_DOMAIN when provided.

const isBrowser = () => typeof document !== "undefined";

const ENV_COOKIE_DOMAIN =
  typeof import.meta !== "undefined" &&
  import.meta.env &&
  import.meta.env.VITE_COOKIE_DOMAIN
    ? import.meta.env.VITE_COOKIE_DOMAIN
    : null;

function resolveCookieDomain() {
  if (!isBrowser()) return "";
  if (ENV_COOKIE_DOMAIN && ENV_COOKIE_DOMAIN.length) return ENV_COOKIE_DOMAIN;
  try {
    const host = window.location.hostname || "";
    if (host === "localhost" || host === "127.0.0.1") return "";
    return "." + host.replace(/^www\./, "");
  } catch (e) {
    return "";
  }
}

function isSecureContext() {
  if (!isBrowser()) return false;
  return window.location.protocol === "https:";
}

const COOKIE_DOMAIN = resolveCookieDomain(); // e.g. ".localistsbooster.com" or ""
const COOKIE_IS_SECURE = isSecureContext(); // true on HTTPS
const COOKIE_SAMESITE = COOKIE_IS_SECURE ? "None" : "Lax";

// ------------------------------------------------------------------
// Internal helpers
// ------------------------------------------------------------------
function encode(nameOrValue) {
  return encodeURIComponent(String(nameOrValue));
}
function decode(value) {
  try {
    return decodeURIComponent(value);
  } catch (e) {
    return value;
  }
}

function buildCookieString({
  name,
  value = "",
  expires = null,
  path = "/",
  domain = null,
  sameSite = COOKIE_SAMESITE,
  secure = COOKIE_IS_SECURE,
}) {
  let str = `${encode(name)}=${encode(value)}; Path=${path};`;
  if (expires) str += ` Expires=${expires.toUTCString()};`;
  if (sameSite) str += ` SameSite=${sameSite};`;
  if (secure) str += ` Secure;`;
  if (domain) str += ` Domain=${domain};`;
  return str;
}

// ------------------------------------------------------------------
// GET COOKIE (returns parsed JSON when possible, else raw string)
// ------------------------------------------------------------------
export function getCookie(name) {
  if (!isBrowser()) return null;
  const nameEQ = encode(name) + "=";
  const raw = document.cookie || "";
  const parts = raw.split(";").map((p) => p.trim());

  for (const p of parts) {
    if (p.indexOf(nameEQ) === 0) {
      let val = p.substring(nameEQ.length);
      // Unquote if needed
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!val || val === "undefined" || val === "null" || val === "NaN") {
        // Clear invalid sentinel values proactively
        clearSpecificCookie(name);
        return null;
      }
      // Try JSON parse
      try {
        return JSON.parse(decode(val));
      } catch (e) {
        return decode(val);
      }
    }
  }
  return null;
}

// ------------------------------------------------------------------
// getBarkToken - returns raw token string (no JSON parse)
// ------------------------------------------------------------------
export function getBarkToken() {
  if (!isBrowser()) return null;
  const name = "barkToken=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const parts = decodedCookie.split(";");

  for (let part of parts) {
    part = part.trim();
    if (part.startsWith(name)) {
      let value = part.substring(name.length);

      // Remove double or single quotes if wrapped
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1); // remove first & last quote
      }

      return value.trim();
    }
  }
  return null;
}

// ------------------------------------------------------------------
// getBarkUserData - uses getCookie (which parses JSON if present)
// ------------------------------------------------------------------
export function getBarkUserData() {
  if (!isBrowser()) return null;
  return getCookie("barkUserToken");
}

// ------------------------------------------------------------------
// parse helpers (kept for compatibility with your code)
// ------------------------------------------------------------------
export function parseCookieValue(value) {
  if (value == null) return null;
  let v = value;
  if (typeof v === "string") {
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    )
      v = v.slice(1, -1);
    if (v.toLowerCase().startsWith("bearer ")) v = v.substring(7).trim();
    return v.trim();
  }
  return v;
}

export function getRequestToken() {
  if (!isBrowser()) return null;
  return parseCookieValue(getCookie("requestToken"));
}
export function getCreateRequestToken() {
  if (!isBrowser()) return null;
  return parseCookieValue(getCookie("createRequestToken"));
}
export function getcreateRequest() {
  if (!isBrowser()) return null;
  return parseCookieValue(getCookie("createRequest"));
}
export function getRegisterTokens() {
  if (!isBrowser()) return null;
  return parseCookieValue(getCookie("registerTokens"));
}

// ------------------------------------------------------------------
// CLEAR SPECIFIC COOKIE - tries host-only and domain variants
// ------------------------------------------------------------------
function clearSpecificCookie(name) {
  if (!isBrowser()) return;

  const hostname = window.location.hostname;
  const domainCandidates = new Set();

  // 1) Use explicit cookie domain if configured (both exact and without leading dot)
  if (COOKIE_DOMAIN) {
    domainCandidates.add(COOKIE_DOMAIN); // .example.com
    domainCandidates.add(COOKIE_DOMAIN.replace(/^\./, "")); // example.com
  }

  // 2) Use current host variants
  domainCandidates.add(hostname); // app.example.com
  domainCandidates.add("." + hostname.replace(/^www\./, "")); // .app.example.com (rare)
  // 3) fallback to no domain (host-only)
  domainCandidates.add(null);

  const paths = ["/", "/en", ""];

  // Expire in the past
  const expires = new Date(0);

  // Try all combinations
  for (const domain of Array.from(domainCandidates)) {
    for (const path of paths) {
      const domainAttr = domain ? domain : null;
      const cookieStr = buildCookieString({
        name,
        value: "",
        expires,
        path: path || "/",
        domain: domainAttr,
        sameSite: COOKIE_SAMESITE,
        secure: COOKIE_IS_SECURE,
      });
      document.cookie = cookieStr;
    }
  }

  // Also clear host-only copy explicitly (no domain attribute)
  document.cookie = buildCookieString({
    name,
    value: "",
    expires,
    path: "/",
    domain: null,
    sameSite: COOKIE_SAMESITE,
    secure: COOKIE_IS_SECURE,
  });
}

// ------------------------------------------------------------------
// SET COOKIE - clears host-only duplicate, then sets domain cookie
// - value may be object (stringified)
// ------------------------------------------------------------------
export function setCookie(key, value, days = 7) {
  if (!isBrowser()) return null;
  if (!key) return;

  // Normalize value
  if (typeof value === "object") {
    try {
      value = JSON.stringify(value);
    } catch (e) {
      value = String(value);
    }
  }
  value = String(value);

  // expiry
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);

  // Step 1: expire host-only cookie (prevents duplicate host-only + domain cookie)
  try {
    // host-only: no Domain attribute
    const hostClear = buildCookieString({
      name: key,
      value: "",
      expires: new Date(0),
      path: "/",
      domain: null,
      sameSite: COOKIE_SAMESITE,
      secure: COOKIE_IS_SECURE,
    });
    document.cookie = hostClear;
  } catch (e) {
    // ignore
  }

  // Step 2: set domain cookie if COOKIE_DOMAIN is valid and not localhost/127
  if (
    COOKIE_DOMAIN &&
    COOKIE_DOMAIN.indexOf("localhost") === -1 &&
    COOKIE_DOMAIN.indexOf("127.0.0.1") === -1
  ) {
    const cookieStr = buildCookieString({
      name: key,
      value,
      expires: d,
      path: "/",
      domain: COOKIE_DOMAIN,
      sameSite: COOKIE_SAMESITE,
      secure: COOKIE_IS_SECURE,
    });
    document.cookie = cookieStr;
    return true;
  }

  // Otherwise fallback to host-only cookie (dev/local)
  const cookieStr = buildCookieString({
    name: key,
    value,
    expires: d,
    path: "/",
    domain: null,
    sameSite: COOKIE_SAMESITE,
    secure: COOKIE_IS_SECURE,
  });
  document.cookie = cookieStr;
  return true;
}

// ------------------------------------------------------------------
// CLEAR MULTIPLE COOKIES - best-effort wipe
// ------------------------------------------------------------------
export function clearCookies() {
  if (!isBrowser()) return;

  const cookiesToClear = [
    "barkToken",
    "barkUserToken",
    "session",
    "token",
    "requestToken",
    "createRequestToken",
    "registerTokens",
  ];
  cookiesToClear.forEach(clearSpecificCookie);

  // Finally, best-effort wipe of any accessible cookie names
  (document.cookie || "").split(";").forEach((raw) => {
    const n = raw.split("=")[0] && raw.split("=")[0].trim();
    if (n) clearSpecificCookie(n);
  });
}
