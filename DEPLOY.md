# GitHub Pages Deployment Guide

## Enable GitHub Pages (One-time setup)

1. Go to your repository settings: https://github.com/ozlphrt/Jarrows/settings/pages

2. Under **"Source"**, select **"GitHub Actions"**

3. Click **"Save"**

4. The workflow will automatically deploy on the next push!

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

