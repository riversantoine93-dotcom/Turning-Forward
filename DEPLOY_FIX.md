# Vercel deployment fix

This archive is intentionally packaged with `package.json` at the ZIP/repository root.

## GitHub
Upload the contents of this folder directly to the root of the repository. Do not upload a containing `tf_fix` or `turning-forward-vercel-root` folder.

At the top level of GitHub you should immediately see:

- `package.json`
- `app/`
- `public/`
- `vercel.json`
- `next.config.ts`

## Vercel settings

- Framework Preset: Next.js
- Root Directory: leave blank (`.`)
- Install Command: leave blank (automatic)
- Build Command: leave blank (automatic)
- Output Directory: leave blank
- Node.js Version: 20.x

Delete any previous custom Install Command such as `npm install --no-audit --no-fund`.
Redeploy without the existing build cache.
