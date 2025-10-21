# Deployment Guide

Your Windows XP Portfolio is ready to deploy! Here are the easiest methods:

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended - 2 minutes)

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New Project"
4. Import your repository
5. Vercel auto-detects Vite - just click "Deploy"
6. Done! Your site is live at `your-project.vercel.app`

**Benefits:**
- Automatic HTTPS
- Global CDN
- Auto-deploys on Git push
- Free for personal projects

### Option 2: Netlify (Also Easy)

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Connect to your repository
5. Build settings are auto-configured (already in `netlify.toml`)
6. Click "Deploy"
7. Live at `your-project.netlify.app`

**Benefits:**
- Free SSL
- Continuous deployment
- Custom domain support

### Option 3: GitHub Pages

1. First, update your `vite.config.ts` to set the base path:

\`\`\`typescript
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/', // Replace with your repo name
})
\`\`\`

2. Install gh-pages:
\`\`\`bash
npm install --save-dev gh-pages
\`\`\`

3. Add to `package.json` scripts:
\`\`\`json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
\`\`\`

4. Deploy:
\`\`\`bash
npm run deploy
\`\`\`

5. Enable GitHub Pages in repo settings (select gh-pages branch)
6. Live at `username.github.io/repo-name`

### Option 4: Manual Deployment

If you have your own server:

1. Build the project:
\`\`\`bash
npm run build
\`\`\`

2. Upload the entire `dist` folder to your web server
3. Configure your server to serve `index.html` for all routes
4. Done!

## 🌐 Custom Domain

After deploying to Vercel or Netlify:

1. Buy a domain (Namecheap, Google Domains, etc.)
2. In your deployment platform, go to Settings → Domains
3. Add your custom domain
4. Update your domain's DNS records as instructed
5. Wait for DNS propagation (5-30 minutes)

## 📝 Before Deploying

Make sure to:

✅ Update content in:
- `/src/pages/Projects.tsx` - Add your real projects
- `/src/pages/Experiences.tsx` - Add your work experience
- `/src/pages/Autobiography.tsx` - Add your bio

✅ Replace placeholder images:
- Profile image is at `/public/assets/icons/profile_image.jpeg`

✅ Test locally:
\`\`\`bash
npm run dev
\`\`\`

✅ Build successfully:
\`\`\`bash
npm run build
\`\`\`

## 🔧 Environment Setup

No environment variables needed for this project - it's a static site!

## 📊 Analytics (Optional)

Add Google Analytics by editing `index.html`:

\`\`\`html
<head>
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  </script>
</head>
\`\`\`

## 🐛 Troubleshooting

**Build fails:**
- Run `npm install` to ensure all dependencies are installed
- Check for TypeScript errors: `npm run build`

**Page shows 404 on refresh:**
- Ensure `vercel.json` or `netlify.toml` is configured correctly
- For custom servers, configure to serve `index.html` for all routes

**Images not loading:**
- Images must be in `/public/` folder
- Use absolute paths: `/assets/icons/image.png`

## 🎉 You're Done!

Your Windows XP portfolio is now live on the internet!

