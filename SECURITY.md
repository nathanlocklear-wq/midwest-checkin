# Security and deployment status

## Implemented controls

- HMAC-SHA256 signed, random, eight-hour staff sessions; server-issued HttpOnly and SameSite=Strict cookies, Secure in production.
- Constant-time password comparison, bounded login bodies, same-origin login validation, and a process-local login limiter.
- Authentication checked inside the data endpoint, independent of page middleware.
- All browser database requests replaced with same-origin `POST /api/staff`.
- Supabase URL and service-role credential confined to a module guarded by `import "server-only"`.
- Fixed operation names, selected response columns, strict request keys, UUID validation, field/type/length validation, and server-generated check-in/badge timestamps.
- No caller-supplied tables, schemas, credentials, column selectors, RPCs, or PostgREST filter expressions.
- Individual record edits/deletes require a valid ID; no bulk-delete or roster-replacement operation.
- Imports are a single insert of at most 5,000 validated rows and 5 MB of JSON. New IDs and initial check-in state are assigned on the server. Existing records remain intact.
- No-store responses and generic database errors; private records and credentials are not logged.
- Private registration exports excluded from public assets and Git.

## Required before production

1. Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` on the server. Remove obsolete `NEXT_PUBLIC_SUPABASE_*` configuration. Never expose the privileged key in a browser, README, or issue.
2. Verify the app's database identity and schema, back up its current grants/policies, and restrict direct Data API access to private tables. The application patch does **not** change live database permissions. Existing anonymous policies may still expose data even after this code is deployed.
3. For this shared-password/server-only design, `anon`, `authenticated`, and `PUBLIC` must not have direct privileges on `public.attendees` or `public.settings`; enable RLS as defense in depth. Give the server role only the required table access where possible. Also inspect column grants, views, RPC functions, Storage, and other exposed schemas. Do not apply broad grant changes to an unrelated project.
4. With synthetic staging data, verify the public key cannot read, insert, update, or delete either table; verify authorized staff can perform the documented operations through the server. Audit database security advisors and test login, search, scan, check-in, undo, badge printing, edits, settings, imports, and deletion before release.
5. Configure shared or edge rate limiting. The existing limiter is per process and resets on restart.
6. Use HTTPS and preserve the original origin through the reverse proxy. All staff API requests, including reads, must come from the same origin.

Supabase explains the separate grant and RLS controls in its [Data API security guide](https://supabase.com/docs/guides/api/securing-your-api).

## Remaining limitations

- All holders of the shared staff password have the same read/write/delete permissions. There are no individual staff roles or per-person audit records. Named accounts, a logout flow, per-session revocation, and durable abuse limits remain future work.
- Rotating the session secret invalidates every session; changing the password alone does not.
- Imports add registrations. Re-importing the same CSV can create duplicates; this is not an idempotent synchronization tool. The UI warns before submitting. If a network failure makes completion uncertain, inspect the roster before retrying.
- The roster list is bounded to 100,000 records, fetched in pages of 500. Configure the database API row cap to at least 500. Concurrent edits can affect paging results.
- A previously committed CSV remains in existing Git history, main, and potentially old deployments/caches. Removing it in this pull request does not purge those copies. Coordinate owner-approved cleanup separately.
- Live database permissions and server secrets have not been changed or verified by this patch.

## Verification

The security suite uses synthetic data and mocked database responses. It checks authorization, CSRF, malformed/oversized bodies, field allowlists, record-scoped writes, server timestamps, bounded search, pagination, and insert-only imports. It does not replace staging database integration tests.

## Reporting

Use GitHub private vulnerability reporting if enabled, or contact the repository owner privately. Never include passwords, keys, attendee records, or private exploit data in public issues.
