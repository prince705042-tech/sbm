/**
 * Swachh Campus - Comprehensive Application Security Module
 * 
 * Provides:
 * 1. Cryptographic password hashing (salted SHA-256 via Web Crypto API)
 * 2. Constant-time string comparison against timing attacks
 * 3. Ephemeral cryptographically signed session tokens with 2-hour timeout
 * 4. Client-side and in-memory rate limiting against brute force & DoS spam
 * 5. Strict input sanitization & XSS protection (HTML escaping, script stripping, tag removal)
 * 6. Email header & URI injection defenses
 */

// Cryptographic salt for estate administrative credentials
const ADMIN_PASSWORD_SALT = 'nitp_sbm_2026_estate_salt_secure';

// Salted SHA-256 hash of authorized administrative password
const AUTHORIZED_ADMIN_HASH = '9f80cab1eb2b2ffae1e45c8eb9e7b91ab345d5919a05dad3e867783a313c5afc';

// Authorized Admin Identifier
const AUTHORIZED_ADMIN_ID = 'SBM';

// Session lifetime: 2 hours (in milliseconds)
const SESSION_DURATION_MS = 2 * 60 * 60 * 1000;

// Secret key for HMAC/signing session tokens
const SESSION_SECRET = 'nitp_estate_swachh_secret_session_signer_2026';

/**
 * Computes a SHA-256 hex digest using the standard Web Crypto API.
 */
export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Basic fallback if subtle crypto is unavailable
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(64, '0');
}

/**
 * Constant-time string comparison to prevent timing attacks.
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Verifies admin credentials against the salted cryptographic hash.
 * Never stores or compares against plain text passwords.
 */
export async function verifyAdminCredentials(adminId: string, passwordAttempt: string): Promise<boolean> {
  const cleanId = adminId.trim().toUpperCase();
  const cleanPassword = passwordAttempt.trim();

  if (cleanId !== AUTHORIZED_ADMIN_ID || cleanPassword.length === 0) {
    return false;
  }

  const computedHash = await sha256(ADMIN_PASSWORD_SALT + cleanPassword);
  return timingSafeEqual(computedHash, AUTHORIZED_ADMIN_HASH);
}

export interface AdminSession {
  token: string;
  role: 'estate_admin';
  issuedAt: number;
  expiresAt: number;
  signature: string;
}

/**
 * Creates a cryptographically signed, expiring session token for authorized administrators.
 */
export async function createAdminSession(): Promise<AdminSession> {
  const now = Date.now();
  const expiresAt = now + SESSION_DURATION_MS;
  const rawPayload = `admin:${now}:${expiresAt}:${SESSION_SECRET}`;
  const signature = await sha256(rawPayload);
  const token = `sbm_tok_${now}_${signature.slice(0, 16)}`;

  const session: AdminSession = {
    token,
    role: 'estate_admin',
    issuedAt: now,
    expiresAt,
    signature,
  };

  try {
    sessionStorage.setItem('swachh_campus_admin_session', JSON.stringify(session));
    // Also store lightweight validation flag for UI reactivity
    localStorage.setItem('swachh_campus_admin_auth', 'true');
  } catch {
    // Storage access fallback
  }

  return session;
}

/**
 * Validates the currently active admin session.
 * Rejects expired, tampered, or forged sessions.
 */
export async function validateAdminSession(): Promise<boolean> {
  try {
    const raw = sessionStorage.getItem('swachh_campus_admin_session');
    if (!raw) {
      // Clear any rogue flag in localStorage
      localStorage.removeItem('swachh_campus_admin_auth');
      return false;
    }

    const session: AdminSession = JSON.parse(raw);
    const now = Date.now();

    // Check expiration
    if (!session.expiresAt || session.expiresAt <= now) {
      clearAdminSession();
      return false;
    }

    // Recompute signature to verify tamper-evidence
    const rawPayload = `admin:${session.issuedAt}:${session.expiresAt}:${SESSION_SECRET}`;
    const expectedSig = await sha256(rawPayload);

    if (!timingSafeEqual(session.signature, expectedSig)) {
      clearAdminSession();
      return false;
    }

    return true;
  } catch {
    clearAdminSession();
    return false;
  }
}

/**
 * Clears the active admin session upon logout or security invalidation.
 */
export function clearAdminSession(): void {
  try {
    sessionStorage.removeItem('swachh_campus_admin_session');
    localStorage.removeItem('swachh_campus_admin_auth');
  } catch {}
}

/* ==========================================================================
   RATE LIMITING ENGINE
   Prevents brute-force credential stuffing and form spamming.
   ========================================================================== */

interface RateLimitRecord {
  count: number;
  firstAttempt: number;
  lockedUntil?: number;
}

const rateLimitStore: Record<string, RateLimitRecord> = {};

/**
 * Checks if an action is currently rate-limited.
 * 
 * @param key Unique key for the action (e.g., 'admin_login', 'report_ticket')
 * @param maxAttempts Maximum allowed attempts in window
 * @param windowMs Time window in milliseconds
 * @param lockoutDurationMs Optional lockout duration if max attempts exceeded
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 60000,
  lockoutDurationMs: number = 60000
): { allowed: boolean; remainingAttempts: number; retryAfterSeconds: number } {
  const now = Date.now();
  let record = rateLimitStore[key];

  // Also check sessionStorage to preserve lockout across fast reloads
  if (!record) {
    try {
      const stored = sessionStorage.getItem(`rate_limit_${key}`);
      if (stored) {
        record = JSON.parse(stored);
        rateLimitStore[key] = record;
      }
    } catch {}
  }

  if (!record) {
    return { allowed: true, remainingAttempts: maxAttempts, retryAfterSeconds: 0 };
  }

  // Check if currently locked out
  if (record.lockedUntil && record.lockedUntil > now) {
    const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, remainingAttempts: 0, retryAfterSeconds };
  }

  // Reset if window has elapsed
  if (now - record.firstAttempt > windowMs) {
    delete rateLimitStore[key];
    try {
      sessionStorage.removeItem(`rate_limit_${key}`);
    } catch {}
    return { allowed: true, remainingAttempts: maxAttempts, retryAfterSeconds: 0 };
  }

  // Check attempt limit
  if (record.count >= maxAttempts) {
    record.lockedUntil = now + lockoutDurationMs;
    try {
      sessionStorage.setItem(`rate_limit_${key}`, JSON.stringify(record));
    } catch {}
    const retryAfterSeconds = Math.ceil(lockoutDurationMs / 1000);
    return { allowed: false, remainingAttempts: 0, retryAfterSeconds };
  }

  return {
    allowed: true,
    remainingAttempts: maxAttempts - record.count,
    retryAfterSeconds: 0,
  };
}

/**
 * Registers an attempt for a rate-limited action.
 */
export function recordRateLimitAttempt(
  key: string,
  windowMs: number = 60000,
  maxAttempts: number = 5,
  lockoutDurationMs: number = 60000
): void {
  const now = Date.now();
  let record = rateLimitStore[key];

  if (!record || now - record.firstAttempt > windowMs) {
    record = { count: 1, firstAttempt: now };
  } else {
    record.count += 1;
    if (record.count >= maxAttempts) {
      record.lockedUntil = now + lockoutDurationMs;
    }
  }

  rateLimitStore[key] = record;
  try {
    sessionStorage.setItem(`rate_limit_${key}`, JSON.stringify(record));
  } catch {}
}

/**
 * Clears rate limit state upon successful authentication or verified action.
 */
export function resetRateLimit(key: string): void {
  delete rateLimitStore[key];
  try {
    sessionStorage.removeItem(`rate_limit_${key}`);
  } catch {}
}

/* ==========================================================================
   INPUT SANITIZATION & XSS DEFENSES
   ========================================================================== */

/**
 * HTML character entity map for safe encoding.
 */
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

/**
 * Escapes dangerous HTML characters to prevent XSS in raw text contexts.
 */
export function escapeHtml(str: string): string {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"'`=/]/g, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Strips script tags, iframes, javascript: URI prefixes, and dangerous inline event handlers.
 */
export function sanitizeText(input: unknown, maxLength: number = 1000): string {
  if (input === null || input === undefined) return '';
  let str = String(input);

  // 1. Strip null bytes & dangerous control characters
  str = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // 2. Remove script and iframe tags entirely
  str = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  str = str.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  str = str.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  str = str.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
  str = str.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // 3. Remove inline event handlers (e.g. onerror=, onclick=, onload=)
  str = str.replace(/\bon\w+\s*=\s*(['"]).*?\1/gi, '');
  str = str.replace(/\bon\w+\s*=\s*[^>\s]+/gi, '');

  // 4. Strip javascript: and vbscript: URIs
  str = str.replace(/javascript:/gi, '');
  str = str.replace(/vbscript:/gi, '');
  str = str.replace(/data:text\/html/gi, '');

  // 5. Trim whitespace and enforce length ceiling
  str = str.trim();
  if (str.length > maxLength) {
    str = str.slice(0, maxLength);
  }

  return str;
}

/**
 * Strictly sanitizes and validates an email address.
 * Prevents newline injection (CRLF) for email headers.
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';
  // Strip any newlines or CRLF characters
  const clean = email.replace(/[\r\n\t]/g, '').trim();
  // Valid email format check
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(clean) || clean.length > 254) {
    return '';
  }
  return clean.toLowerCase();
}

/**
 * Strictly sanitizes a phone number.
 * Permitted characters: digits, plus (+), hyphens (-), spaces, and parentheses.
 */
export function sanitizePhone(phone?: string): string {
  if (!phone || typeof phone !== 'string') return '';
  const clean = phone.replace(/[^0-9+\-\s()]/g, '').trim();
  return clean.slice(0, 20);
}

/**
 * Validates and sanitizes a URL or link target.
 * Rejects javascript:, data:, and blob: protocols to prevent execution.
 */
export function sanitizeSafeUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '#';
  const trimmed = url.trim();

  // Allow relative paths
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }

  // Allow safe external schemes
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://') || trimmed.startsWith('mailto:')) {
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol === 'https:' || parsed.protocol === 'http:' || parsed.protocol === 'mailto:') {
        return trimmed;
      }
    } catch {
      // In case of mailto
      if (trimmed.startsWith('mailto:')) {
        return encodeURI(trimmed);
      }
    }
  }

  return '#';
}
