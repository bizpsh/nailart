# Nail Art

A full-stack Next.js nail art design gallery and portfolio site. It has a public-facing gallery visitors can browse and filter, a contact form for inquiries, and a credential-protected admin area where the site owner manages the design catalog and reviews incoming inquiries.

## Tech Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS v4**
- **Prisma** + **SQLite** for data storage
- **zod** for validation
- **bcryptjs** + **jose** for admin authentication (password hashing + signed session JWTs)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in real values:

   ```bash
   cp .env.example .env
   ```

   - `DATABASE_URL` — SQLite connection string (e.g. `file:./dev.db`)
   - `SESSION_SECRET` — a long random string used to sign admin session JWTs
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — credentials for the initial admin account; these are only read by the seed script to create that account

3. Create/sync the SQLite database from the Prisma schema:

   ```bash
   npm run db:push
   ```

4. Seed the database (creates the admin user plus sample designs):

   ```bash
   npm run db:seed
   ```

5. Start the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Admin Area

The admin area lives at `/admin/login`. Sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` values from your `.env` file (created by the seed script). From there you can manage designs at `/admin/designs` and view inquiries at `/admin/inquiries`.

## Image Uploads

In this v1, uploaded design images are stored locally on disk under `public/uploads/designs/`. This is fine for local development or a traditional always-on server, but it will **not** persist on most serverless hosting platforms (e.g. Vercel), since the filesystem there is ephemeral/read-only at runtime. Moving to object storage (S3, Cloudinary, etc.) would be needed for a production deployment, but that's out of scope for v1.

## Scripts

| Script             | Description                                          |
| ------------------ | ----------------------------------------------------- |
| `npm run dev`       | Start the Next.js dev server                         |
| `npm run build`     | Build the app for production                         |
| `npm run start`     | Start the production server (after `build`)          |
| `npm run lint`      | Run ESLint                                            |
| `npm run db:generate` | Generate the Prisma client (`prisma generate`)      |
| `npm run db:push`   | Push the Prisma schema to the SQLite database         |
| `npm run db:seed`   | Seed the database with the admin user and sample designs |
