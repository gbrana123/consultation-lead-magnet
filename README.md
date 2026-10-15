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
- `NEXT_PUBLIC_FORM_ENDPOINT`: the endpoint that receives lead data as JSON

> Important: Without `NEXT_PUBLIC_FORM_ENDPOINT`, the form only simulates a successful submission and **does not save leads**.

## Production checks

```bash
npm run lint
npm run build
```

## Deploy to Vercel

1. Push this project to a GitHub repository.
2. Import the repository in Vercel.
3. Add the four environment variables listed above.
4. Deploy, then set `NEXT_PUBLIC_SITE_URL` to the deployed domain and redeploy.

## Launch checklist

- Confirm `public/logo.png` and `public/logo-icon.png` are the final GrowNep assets.
- Add the Vimeo URL.
- Add the WhatsApp number.
- Connect and test a real form endpoint.
- Set the final site URL.
