# GitHub Pages Deployment Guide

## Enable GitHub Pages (One-time setup)

1. Go to your repository settings: https://github.com/ozlphrt/Jarrows/settings/pages

2. Under **"Source"**, select **"GitHub Actions"**

3. **Leave the "Custom domain" field completely empty** (do not enter anything)

4. Click **"Save"** (if the button is still disabled, try refreshing the page or clicking "GitHub Actions" again)

5. The workflow will automatically deploy on the next push!

## Your App URL

Once enabled, your app will be available at:
**https://ozlphrt.github.io/Jarrows/**

## Troubleshooting

If "GitHub Actions" option is not available:
1. First select "Deploy from a branch"
2. Choose branch: `master`
3. Choose folder: `/ (root)`
4. Click "Save"
5. Then switch back to "GitHub Actions" when it appears

## Manual Deployment

If you need to trigger deployment manually:
1. Go to: https://github.com/ozlphrt/Jarrows/actions
2. Click "Deploy to GitHub Pages"
3. Click "Run workflow"

## Competitive Stats Backend (Free Plan)

If you want competitive stats while staying on Firebase **Spark (free)**, deploy the stats API to a free host (Render) and store data in Firestore.

### Render setup (recommended)

- Create a Render Web Service from this repo
- Root Directory: `mock_backend`
- Build Command: `npm install`
- Start Command: `npm start`

Set Render env vars:
- `STATS_STORAGE=firestore`
- `STATS_BASE_PATH=/v1`
- `FIREBASE_PROJECT_ID=<your-firebase-project-id>` (lowercase, e.g. `jarrows-443ec`)
- `FIREBASE_SERVICE_ACCOUNT=<paste full JSON>`
- `CORS_ORIGIN=https://ozlphrt.github.io` (or your site origin)

Then set the frontend env:
- `VITE_STATS_API_URL=https://<your-render-service>.onrender.com/v1`

