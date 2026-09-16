# MidwestTechTalk Conference Check-In & Registration Administration

Staff-operated conference check-in and registration management for MidwestTechTalk. Built with Next.js App Router, React, TypeScript, Tailwind CSS, and Supabase.

> **Deployment prerequisites:** The app now uses an authenticated server-only data API. Configure server secrets and verify direct database access is restricted before using real attendee records. See [SECURITY.md](SECURITY.md).

## Features

- Search registrations by attendee name, email, or company.
- Scan QR codes and parse contact/vCard data for check-in.
- Record and undo check-in, with timestamps.
- Track badges still needed and mark badges printed.
- Import Eventbrite registrations and HubSpot membership CSVs.
- Assign shirt categories and eligibility notes for presenter bags and LEGO gifts.
- Review duplicate registrations and missing company, email, or shirt information.
- Edit attendee details and the badge registration cutoff date.

## Routes and source map

| Location | Purpose |
| --- | --- |
| `/`, `/checkin` | Staff check-in workflow; login required |
| `/admin/login` | Password sign-in |
| `/admin` | Registration imports and conference statistics |
| `/admin/attendees` | Attendee directory and record editing |
| `/admin/badges` | Badge fulfillment |
| `/admin/issues` | Registration quality review |
| `/admin/settings` | Badge cutoff date |
| `app/api/admin-login/route.ts` | Password verification and server-set session cookie |
| `lib/session.ts` | Signed session creation, expiration, and verification |
| `lib/attendees.ts` | Browser helpers calling the authenticated staff API |
| `app/api/staff/route.ts` | Authenticated, validated staff operations |
| `lib/staff-validation.ts` | Request and field allowlists |
| `lib/supabase.ts` | Server-only Supabase client |
| `lib/mergeAttendees.ts` | CSV merge and eligibility rules |
| `components/checkin/` | Check-in screens and workflow |

## Local setup

1. Install Node.js 24 LTS and run `npm ci`.
2. Copy `.env.example` to `.env.local`.
3. Configure server-only `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Never use a `NEXT_PUBLIC_` prefix for the privileged key.
4. Set a unique `ADMIN_PASSWORD` of at least 16 characters and a separate random `ADMIN_SESSION_SECRET` of at least 32 characters.
5. Run `npm run dev` and open `http://localhost:3000/admin/login`.

Missing or weak authentication configuration disables login. Sessions last eight hours. Cookies are HttpOnly, SameSite=Strict, and Secure in production. Changing the session secret invalidates all sessions; changing the password alone does not.

Use HTTPS in production. Behind a reverse proxy, preserve the original request origin so same-origin login validation works.

## Database requirements and authorization

The app expects an `attendees` table with the fields defined by `Attendee` in `lib/attendees.ts`, plus a `settings` table containing a `badge_cutoff_date` key and date value. A reproducible database schema/migration is not yet included.

All staff screens call `POST /api/staff`; credentials stay on the server. The endpoint verifies a signed staff session and same-origin JSON request before performing a fixed, validated operation. Shared-password users have the same staff privileges.

**The server API does not disable pre-existing direct Supabase access.** Before deployment, revoke direct access to private tables for public/client roles, enable RLS, inspect exposed views/functions, and verify denial using a public key. Live database permissions have not been changed. Follow [SECURITY.md](SECURITY.md) and test against a synthetic staging roster.

## CSV imports and privacy

Keep registration exports outside `public/`. The local `private-data/` folder is ignored by Git and is not served by Next.js. Real attendee data must never be committed.

Imports **add registrations without deleting or replacing the existing roster**. The UI confirms the row count and warns about duplicates. The server validates the complete batch, assigns new IDs, initializes check-in state, and sends a single atomic insert. Existing records and check-ins remain intact if validation or insertion fails. Limits: 5,000 rows and 5 MB of JSON per request. Re-importing the same CSV can create duplicates; inspect the roster before retrying an uncertain request.

Removing an export in a new commit does not remove earlier public copies or Git history. See [SECURITY.md](SECURITY.md) for cleanup requirements.

## Validation

- `npm run test:security`: 14 regression tests covering sessions, login, API authorization, request validation, record-scoped mutations, imports, search, and pagination.
- `npx tsc --noEmit`: TypeScript checks.
- `npm run lint`: repository lint checks (existing legacy violations may remain).
- `npm run build`: production compilation.
- `npm audit`: dependency advisories.

## Suggested GitHub description and topics

**Description:** MidwestTechTalk staff conference check-in and registration admin: QR scanning, Eventbrite/HubSpot CSV imports, badges, shirts, and attendee data review. Next.js, React, TypeScript, Supabase.

**Topics:** `conference-check-in`, `event-management`, `attendee-management`, `qr-code-scanner`, `nextjs`, `react`, `typescript`, `supabase`, `tailwindcss`, `eventbrite`, `hubspot`.

## Staff API operations

All operations require the same authenticated staff session; arbitrary queries are not accepted.

| Operation | Purpose |
| --- | --- |
| `list`, `search`, `find`, `get` | Read the attendee roster, bounded search, email lookup, or one UUID |
| `count` | Count checked-in attendees or badges still needed |
| `checkin`, `badge` | Set fulfillment state with server timestamps |
| `update` | Edit only company, email, shirt size, presenting, or badge-needed fields |
| `delete` | Delete exactly one attendee selected by UUID |
| `import` | Add one validated batch; never replace the roster |
| `settingsRead`, `settingsWrite` | Read or update only the badge cutoff date |
