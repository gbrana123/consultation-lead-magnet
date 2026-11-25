# GrowNep Consultation Lead Magnet

A mobile-first Next.js landing page for GrowNep's free AI marketing consultation.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

Copy `.env.example` to `.env.local` and configure:

- `NEXT_PUBLIC_SITE_URL`: the production site URL
- `NEXT_PUBLIC_VIMEO_URL`: a Vimeo video URL; the player is hidden when empty
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: digits only, including country code; the button is hidden when empty

## Consultation form

The landing-page form submits to the site-owned `/submit-consultation.php` endpoint. A successful submission redirects the visitor to `/thank-you/`.

## Production checks

```bash
npm run lint
npm run build
```

## Deploy to eHosting

This project is configured as a static export for shared hosting.

1. Set the production values in `.env.local`, especially `NEXT_PUBLIC_SITE_URL`.
2. Run `npm run build`.
3. Upload the **contents** of the generated `out` folder to the document root for `digitalgb.grownep.com` in eHosting.
4. Keep the existing A record for `digitalgb.grownep.com` pointing to the eHosting server. Do not add a Vercel CNAME for the same hostname.

The build creates both `/index.html` and `/thank-you/index.html`, so it works on normal Apache-compatible shared hosting without a Node.js server.

## Optional Vercel deployment

1. Push this project to a GitHub repository.
2. Import the repository in Vercel.
3. Add the three environment variables listed above.
4. Deploy, then set `NEXT_PUBLIC_SITE_URL` to the deployed domain and redeploy.

## Launch checklist

- Confirm `public/logo.png` and `public/logo-icon.png` are the final GrowNep assets.
- Add the Vimeo URL.
- Add the WhatsApp number.
- Complete one test submission and confirm that the configured recipient receives it.
- Set the final site URL.
