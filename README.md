# Skill Swap

A responsive tech-skill exchange website. The frontend is plain HTML, CSS and JavaScript and can be hosted on GitHub Pages. Supabase provides real accounts, shared profiles, requests, blocks, and private chat. If Supabase is not configured, the site shows a clearly marked, browse-only sample directory.

## Project files

- `index.html` — page, profile and auth forms, directory, connections and chat views
- `style.css` — responsive visual design
- `script.js` — app behavior, filtering, matching labels, Supabase integration and demo directory
- `config.example.js` — safe template containing placeholders only
- `supabase-schema.sql` — tables, indexes, triggers, RLS policies and account-deletion function

## Run the demo

Open `index.html` in a modern browser. The directory works without installing anything. Sign-up, shared profiles, requests and messaging need Supabase configuration. If the browser blocks ES modules when opening a local file, serve this folder with a local static server or open it from GitHub Pages.

## Set up Supabase

1. Create a Supabase project.
2. In the project, open **SQL Editor**, create a query, paste the full contents of `supabase-schema.sql`, and run it. This creates or updates the tables and enables Row Level Security. Run it again after updating this website to add community notes, practice streaks, ideas and reactions. Confirm the query succeeds before publishing.
3. In Supabase **Project Settings → API**, copy the **Project URL** and the public **anon/publishable key**. Do not copy a service-role key.
4. Copy `config.example.js` to a new file named `config.js`. Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` to the values from your project. These values are used by the browser. The public anon key is safe to publish only with the supplied RLS policies enabled; never put a service-role key, database password, or private credential in this file.
5. In **Authentication → URL Configuration**, set the local development URL as a redirect URL while developing, then add your published GitHub Pages URL. For a project site, the URL usually looks like `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`. Password reset and email confirmation redirect to the current site URL, so it must be allowed.
6. In **Authentication → Providers → Email**, choose whether email confirmation is required. When enabled, a new user confirms their email before signing in.
7. Reload the site. The status banner should say **Live mode**. If it still says Demo mode, check the filename, project URL/key, browser network access and Supabase SQL setup.

The Supabase JavaScript client is loaded from `https://esm.sh/@supabase/supabase-js@2` only in live mode. Internet access is required for the client library and Supabase service. No build step is used.

## Publish with GitHub Pages

1. Create a GitHub repository and upload the website files to the repository root: `index.html`, `style.css`, `script.js`, `config.js`, and any other project files you want to keep. The example configuration and SQL file can also be included.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select the branch containing the files and `/ (root)`, then save.
4. Wait for GitHub Pages to publish and open the URL it provides.
5. Add that exact published URL to Supabase Auth's allowed redirect URLs.

GitHub Pages serves the frontend publicly. `config.js` contains only the Supabase project URL and public anon key; it must be present in the published site for live mode. RLS—not hiding the anon key—is what protects user data.

## Features

- Email/password sign-up and sign-in, sign-out, and password-reset email flow
- Public or private tech-skill profiles with experience level, goals, learning style, languages, schedule, timezone, meetup preference and collaboration preferences
- Suggestions for common frontend, backend, data, cloud, mobile, design and career skills; custom comma-separated skills are accepted
- Combined name/skill/bio search with skill, skill-level, meetup, goal, learning-style, language, schedule, timezone, city/region, beginner-friendly, structured-learning, pair-programming and weekly-time filters
- Simple match explanations for reciprocal skill fit, shared learning style, exact availability text, or same timezone; no hidden compatibility score
- Swap requests with proposal and introduction, accept/decline/cancel, accepted connections and private chat
- Realtime new-message updates when Supabase Realtime is available; unread counts based on read receipts
- Blocking, invite link using the browser's share menu or copy action, and self-service account deletion
- Daily coding practice streaks, short community notes with helpful reactions, and a project Ideas Board with collaborator needs and interest votes
- Safe text rendering, input validation, loading/error/empty states, and responsive accessible controls

## Demo and privacy notes

- The six demo cards are illustrative sample data, not accounts. Their connection buttons are disabled; they cannot receive real requests.
- Without `config.js` containing a configured Supabase project, accounts, shared profiles, requests, chat and invite requests are unavailable. Practice marks, notes, reactions, ideas and votes work locally in that browser only; they are not shared with other visitors.
- In live mode, practice marks, notes, reactions, ideas and votes are stored in Supabase and shared. Posting notes or ideas requires a signed-in account with a public profile. Sample note and idea cards are examples, not member posts.
- Public profiles expose only profile fields. Email addresses are handled by Supabase Auth and are not stored in the public profile table. A private profile is visible only to its owner.
- Invite links contain the inviter's profile ID. Opening one does not access a device's contacts. After a visitor signs in and completes a profile, the site opens a request form that the visitor must submit.
- An accepted swap request is the connection record. Chat access is restricted by RLS to its two participants while the request is accepted. Closing a swap disables chat access; the messages remain stored until an account is deleted.
- Account deletion calls the `delete_my_account` database function. It removes the Auth account and cascades the user's profile, requests, messages, read receipts and blocks. This is permanent.
- Request form and database cap proposal length and limit each account to five requests in ten minutes. Blocking prevents future requests and hides the blocked pair's requests/messages.
- Profile photo URLs load images from the image host the user supplies. Avoid private or temporary image URLs.
- Supabase Auth email/password safeguards and any optional CAPTCHA/rate limits can be configured in Supabase's dashboard. The app does not store passwords.

## Matching behavior

The directory applies all active filters together. In live mode, cards can show a **Two-way skill match** when each person can teach a skill the other wants to learn, or **Skill match** when one direction matches. It may also show **Same learning style**, **Schedule overlap** when the availability text is identical, or **Same timezone**. These are plain explanations, not a score or a guarantee that two schedules overlap in real life.

## Security boundary

The supplied SQL enables RLS on every table. Public visitors can select only public profile rows; signed-in users can additionally read their own private profile. Requests are participant-only, updates are guarded so participants cannot alter the proposal after sending, and messages/read receipts require an accepted request. The browser app never uses a service-role key. Run the supplied SQL before exposing a configured site, and do not weaken its policies to make an error disappear.
