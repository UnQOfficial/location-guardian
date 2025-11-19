# UnQTraker - Deployment Guide

## 🚀 Deployment Options

UnQTraker is ready to deploy to multiple platforms. Choose the option that works best for you.

---

## 📦 Pre-Deployment Checklist

✅ Google Cloud project created  
✅ OAuth credentials configured  
✅ Environment variables ready  
✅ Code pushed to GitHub  

---

## 🌐 Option 1: Vercel (Recommended)

### Why Vercel?
- ✅ Zero configuration
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Free tier available
- ✅ Perfect for React apps

### Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click **Add New** > **Project**
   - Import your GitHub repository
   - Vercel will auto-detect Vite configuration

3. **Configure Environment Variables**
   - Click **Environment Variables**
   - Add:
     ```
     VITE_GOOGLE_CLIENT_ID = your_client_id_here
     VITE_GOOGLE_API_KEY = your_api_key_here
     ```
   - Make sure to add for all environments (Production, Preview, Development)

4. **Deploy**
   - Click **Deploy**
   - Wait 1-2 minutes for build to complete
   - Your app will be live at `your-app.vercel.app`

5. **Update Google OAuth Settings**
   - Add your Vercel URL to authorized origins:
     ```
     https://your-app.vercel.app
     ```

### Custom Domain (Optional)
1. In Vercel dashboard, go to **Settings** > **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update Google OAuth with custom domain

---

## ☁️ Option 2: Cloudflare Pages

### Why Cloudflare Pages?
- ✅ Lightning fast global network
- ✅ Unlimited bandwidth (free)
- ✅ Built-in analytics
- ✅ Excellent DDoS protection

### Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create Cloudflare Pages Project**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Navigate to **Workers & Pages** > **Create application**
   - Select **Pages** > **Connect to Git**
   - Authorize GitHub and select your repository

3. **Configure Build Settings**
   ```
   Framework preset: Vite
   Build command: npm run build
   Build output directory: dist
   ```

4. **Add Environment Variables**
   - Go to **Settings** > **Environment variables**
   - Add Production variables:
     ```
     VITE_GOOGLE_CLIENT_ID = your_client_id_here
     VITE_GOOGLE_API_KEY = your_api_key_here
     ```

5. **Deploy**
   - Click **Save and Deploy**
   - Your app will be live at `your-app.pages.dev`

6. **Update Google OAuth Settings**
   - Add Cloudflare Pages URL to authorized origins

### Custom Domain (Optional)
1. Go to **Custom domains**
2. Click **Set up a custom domain**
3. Follow DNS configuration
4. Update Google OAuth

---

## 🐳 Option 3: Self-Hosted with Docker

### Prerequisites
- Docker installed
- Server with public IP
- Domain pointed to server

### Create Dockerfile

```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_GOOGLE_API_KEY
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_API_KEY=$VITE_GOOGLE_API_KEY

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Create nginx.conf

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### Build and Run

```bash
# Build
docker build \
  --build-arg VITE_GOOGLE_CLIENT_ID=your_client_id \
  --build-arg VITE_GOOGLE_API_KEY=your_api_key \
  -t unqtraker .

# Run
docker run -d -p 80:80 unqtraker
```

---

## 🔒 Post-Deployment Security Checklist

✅ HTTPS enabled (automatic on Vercel/Cloudflare)  
✅ Environment variables set  
✅ OAuth redirect URIs updated  
✅ Authorized JavaScript origins configured  
✅ API keys restricted (optional but recommended)  
✅ Test login flow  
✅ Test location capture  
✅ Verify Google Drive sync  

---

## 📊 Monitoring & Analytics

### Vercel Analytics
- Go to your project dashboard
- Click **Analytics** tab
- View real-time traffic data

### Cloudflare Analytics
- Go to **Workers & Pages** > Your project
- Click **Analytics** tab
- View detailed metrics

---

## 🔄 Continuous Deployment

Both Vercel and Cloudflare Pages automatically deploy when you push to GitHub:

```bash
git add .
git commit -m "Update features"
git push origin main
```

Your changes will be live in 1-2 minutes!

---

## 🎯 Performance Optimization

### Already Configured ✅
- Code splitting (React, UI, Charts, Maps)
- Tree shaking
- Minification
- Gzip compression

### Additional Optimizations (Optional)

1. **Enable Cloudflare Caching**
   - Configure cache rules in Cloudflare dashboard
   - Cache static assets for 1 year

2. **Optimize Images**
   - Use WebP format
   - Compress images before upload

3. **Enable Analytics**
   - Add Google Analytics (optional)
   - Use Vercel/Cloudflare built-in analytics

---

## 🧪 Testing Production Build Locally

```bash
# Build
npm run build

# Preview
npm run preview
```

Navigate to `http://localhost:4173` to test production build.

---

## 🆘 Common Deployment Issues

### Build Fails
- Check Node.js version (18+ required)
- Verify all dependencies are installed
- Check for TypeScript errors

### OAuth Not Working in Production
- Verify redirect URIs match exactly
- Check authorized JavaScript origins
- Ensure HTTPS is enabled

### Environment Variables Not Loading
- Prefix must be `VITE_` for client-side access
- Redeploy after adding variables
- Clear build cache if needed

---

## 📈 Scaling Considerations

### Current Setup (Free Tier)
- ✅ Handles 100s of concurrent users
- ✅ Google Drive API free tier
- ✅ Automatic scaling on Vercel/Cloudflare

### Need More Scale?
- Upgrade to Vercel Pro ($20/month)
- Use Cloudflare Workers for edge computing
- Implement database for better data management
- Add Redis for caching

---

## 📞 Support

Need help with deployment?
- Check platform documentation
- Review Google Cloud Console logs
- Test locally first with `npm run preview`

---

Built with ❤️ by Sandeep Gaddam
