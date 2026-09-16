# MidwestTechTalk Conference Check-In & Registration Administration

Staff-operated conference check-in and registration management for MidwestTechTalk. Built with Next.js App Router, React, TypeScript, Tailwind CSS, and Supabase.

> **Security status:** This is a partial hardening update, not a production security certification. Browser-to-Supabase authorization remains unresolved. Review [SECURITY.md](SECURITY.md) before using real attendee records.

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
| `lib/attendees.ts` | Supabase attendee queries and updates |
| `lib/mergeAttendees.ts` | CSV merge and eligibility rules |
| `components/checkin/` | Check-in screens and workflow |

## Local setup

1. Install Node.js 24 LTS and run `npm ci`.
2. Copy `.env.example` to `.env.local`.
3. Configure the Supabase URL and public anon/publishable key.
4. Set a unique `ADMIN_PASSWORD` of at least 16 characters and a separate random `ADMIN_SESSION_SECRET` of at least 32 characters.
5. Run `npm run dev` and open `http://localhost:3000/admin/login`.

Missing or weak authentication configuration disables login. Sessions last eight hours. Cookies are HttpOnly, SameSite=Strict, and Secure in production. Changing the session secret invalidates all sessions; changing the password alone does not.

Use HTTPS in production. Behind a reverse proxy, preserve the original request origin so same-origin login validation works.

## Database requirements and current limitation

The app expects an `attendees` table with the fields defined by `Attendee` in `lib/attendees.ts`, plus a `settings` table containing a `badge_cutoff_date` key and date value. A reproducible database schema/migration is not yet included.

**The shared admin session is not Supabase authentication.** Client-side Supabase calls still use the public key, so protecting pages does not protect direct database calls. Before deployment, implement database-backed staff authorization (or a reviewed server-only data layer), enable and verify row-level security, and remove anonymous access to private records. Do not simply add permissive policies to make the UI work.

## CSV imports and privacy

Keep registration exports outside `public/`. The local `private-data/` folder is ignored by Git and is not served by Next.js. Real attendee data must never be committed.

The current import workflow **deletes existing registrations before inserting replacements**. Back up the database first. A failed import can lose the existing roster, and a re-import resets record IDs and check-in state. Transactional import with preview and rollback remains required.

Removing an export in a new commit does not remove earlier public copies or Git history. See [SECURITY.md](SECURITY.md) for cleanup requirements.

## Validation

- `npm run test:security`: session forgery, expiry, configuration, login request validation, cookie flags, and rate-limit regression tests.
- `npx tsc --noEmit`: TypeScript checks.
- `npm run lint`: repository lint checks (existing legacy violations may remain).
- `npm run build`: production compilation.
- `npm audit`: dependency advisories.

## Suggested GitHub description and topics

**Description:** MidwestTechTalk staff conference check-in and registration admin: QR scanning, Eventbrite/HubSpot CSV imports, badges, shirts, and attendee data review. Next.js, React, TypeScript, Supabase.

**Topics:** `conference-check-in`, `event-management`, `attendee-management`, `qr-code-scanner`, `nextjs`, `react`, `typescript`, `supabase`, `tailwindcss`, `eventbrite`, `hubspot`.
