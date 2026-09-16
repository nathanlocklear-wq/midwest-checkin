# Security and deployment status

## Improvements in this change

- Replace the forgeable boolean admin cookie with an HMAC-SHA256 signed, random, eight-hour session.
- Issue the session only on the server, with HttpOnly and SameSite=Strict; use Secure in production.
- Reject missing/weak authentication configuration, malformed JSON, oversized login bodies, and cross-origin login requests.
- Compare password hashes in constant time and apply a process-local login attempt limit.
- Protect staff check-in pages as well as admin pages.
- Remove the tracked attendee export from the public folder and ignore private exports.
- Restrict punctuation in attendee search before constructing PostgREST filters.
- Add anti-framing, MIME-sniffing, referrer, and browser permission headers.

## Unresolved release blockers

1. **Database authorization:** the browser still accesses Supabase directly with a public key. The admin cookie does not authorize Supabase requests. RLS policies and actual database exposure have not been verified. Implement named staff authentication with restrictive RLS or an approved server-only API before production. Relevant guidance: https://supabase.com/docs/guides/api/securing-your-api
2. **Previously published attendee export:** a CSV was tracked under `public/data/`. Its removal here does not purge Git history, existing deployments, caches, forks, or downloaded copies. Coordinate history cleanup and deployment/cache removal with the owner. Assess the contents privately; do not paste attendee records into public issues.
3. **Import data loss:** the existing import deletes the roster before inserting new records. Replace it with a transactional, validated import and an explicit preview/confirmation.
4. **Rate limiting:** the login limiter is per process, resets on restart, and is not shared across deployment instances. Configure shared or edge rate limiting before internet exposure.
5. **Account lifecycle:** shared-password access has no individual roles, per-user audit trail, or per-session revocation. Rotate the session secret to invalidate every session. Add staff accounts and logout/session revocation.
6. **Configuration:** set both authentication variables before deploying. This change intentionally disables login when they are missing or too short.

## Reporting

Use GitHub private vulnerability reporting if enabled, or contact the repository owner privately. Never put passwords, keys, personal attendee records, or exploit details containing private data in a public issue.
