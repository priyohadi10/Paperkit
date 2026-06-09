# Deployment Guide

## GitHub Repository

### Setup Pertama Kali

```bash
# Initialize git
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Paper Arcade v1.0"

# Create GitHub repository (using gh CLI)
gh repo create paper-arcade --public --source=. --push

# Or create manually on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/paper-arcade.git
git branch -M main
git push -u origin main
```

### Branch Strategy

```
main     — Production-ready code
develop  — Development branch
feature/* — Feature branches
```

## Vercel Deployment

### Option 1: GitHub Integration (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository `paper-arcade`
4. Framework Preset: **Vite**
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Click **Deploy**

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Vercel Configuration

Create `vercel.json` in project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Environment Variables

No environment variables required. This is a fully client-side application.

## Post-Deployment Checklist

- [ ] App loads correctly on the deployed URL
- [ ] All 4 games are playable
- [ ] PWA install prompt appears (Chrome/Edge)
- [ ] Dark mode toggle works
- [ ] Statistics persist after refresh
- [ ] Offline mode works (disconnect internet and test)
- [ ] Mobile layout looks good
- [ ] All icons and images load properly

## Troubleshooting

### Build Fails

```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 404 on Refresh (SPA Routing)

Add `vercel.json` with SPA rewrite rules (see Option 2 above).

### PWA Not Installing

- Check that `manifest.json` is served correctly
- Verify icons exist in `dist/`
- Check browser console for SW registration errors
- Must be served over HTTPS (Vercel handles this)

## Domain Customization

1. Go to Vercel Dashboard > Project Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions
