# UnQTraker - Google OAuth & Drive Setup Guide

## 🚀 Quick Start

UnQTraker now requires Google OAuth authentication and uses Google Drive for cloud storage. Follow these steps to configure your application.

---

## 📋 Prerequisites

1. A Google Cloud Platform account (free tier works)
2. A domain or deployed URL (Vercel/Cloudflare Pages deployment)

---

## 🔑 Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Create Project** or select an existing project
3. Name your project (e.g., "UnQTraker")
4. Wait for project creation to complete

---

## 🛠️ Step 2: Enable Required APIs

1. In your Google Cloud project, go to **APIs & Services > Library**
2. Search for and enable these APIs:
   - **Google Drive API**
   - **Google+ API** (for user info)

---

## 🔐 Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services > OAuth consent screen**
2. Select **External** (for public access) and click **Create**
3. Fill in the required fields:
   - **App name**: UnQTraker
   - **User support email**: Your email
   - **Developer contact email**: Your email
4. Click **Save and Continue**
5. On the **Scopes** page, click **Add or Remove Scopes**
6. Add these scopes:
   ```
   .../auth/userinfo.email
   .../auth/userinfo.profile
   .../auth/drive.file
   .../auth/drive.appdata
   ```
7. Click **Save and Continue**
8. Review and click **Back to Dashboard**

---

## 🔑 Step 4: Create OAuth 2.0 Credentials

### Create OAuth Client ID

1. Go to **APIs & Services > Credentials**
2. Click **+ CREATE CREDENTIALS** > **OAuth client ID**
3. Choose **Web application**
4. Configure the client:

   **Name**: UnQTraker Web Client

   **Authorized JavaScript origins**:
   ```
   http://localhost:8080
   https://yourdomain.com
   https://your-app.vercel.app
   https://your-app.pages.dev
   ```

   **Authorized redirect URIs**:
   ```
   http://localhost:8080
   https://yourdomain.com
   https://your-app.vercel.app
   https://your-app.pages.dev
   ```

5. Click **Create**
6. **IMPORTANT**: Copy your **Client ID** - you'll need this!

### Create API Key

1. Still in **Credentials**, click **+ CREATE CREDENTIALS** > **API key**
2. Copy the generated API key
3. (Optional but recommended) Click **Restrict key** and limit to:
   - **Application restrictions**: HTTP referrers
   - **API restrictions**: Google Drive API

---

## 📝 Step 5: Configure Environment Variables

Create a `.env` file in your project root:

```env
VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=your_api_key_here
```

Replace with your actual Client ID and API Key from Step 4.

---

## ☁️ Step 6: Deploy to Production

### Option A: Vercel Deployment

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard:
   - `VITE_GOOGLE_CLIENT_ID`
   - `VITE_GOOGLE_API_KEY`
5. Deploy!

### Option B: Cloudflare Pages

1. Push your code to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com)
3. Create a new project
4. Connect your repository
5. Build settings:
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
6. Add environment variables:
   - `VITE_GOOGLE_CLIENT_ID`
   - `VITE_GOOGLE_API_KEY`
7. Deploy!

---

## 🔒 Step 7: Update OAuth Redirect URIs (After Deployment)

1. Go back to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services > Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **Authorized JavaScript origins**, add your production URL:
   ```
   https://your-production-domain.com
   ```
5. Under **Authorized redirect URIs**, add:
   ```
   https://your-production-domain.com
   ```
6. Click **Save**

---

## 🧪 Testing the Setup

1. Navigate to your deployed app
2. You should be redirected to the login page
3. Click **Sign in with Google**
4. Authorize the app to access your Google Drive
5. You should be redirected to the admin dashboard

---

## 📱 How It Works

### Authentication Flow
1. User clicks "Sign in with Google"
2. Google OAuth popup appears
3. User authorizes the app
4. App receives access token
5. User info is fetched and stored
6. User is redirected to admin dashboard

### Data Storage Flow
1. Location data is captured
2. Data is saved to localStorage (instant)
3. Data is synced to Google Drive (background)
4. On admin page load, latest data is fetched from Drive
5. If Drive is unavailable, fallback to localStorage

---

## 🔧 Troubleshooting

### "redirect_uri_mismatch" Error
- Make sure your redirect URIs in Google Cloud Console match your app URL exactly
- Check for trailing slashes - they must match exactly
- Protocol (http vs https) must match

### "Access blocked: This app's request is invalid"
- Ensure OAuth consent screen is configured
- Make sure all required scopes are added
- Check that APIs are enabled (Drive API, Google+ API)

### "idpiframe_initialization_failed"
- Check that your domain is in Authorized JavaScript origins
- Make sure cookies are enabled
- Check browser console for detailed errors

### Data Not Syncing to Drive
- Verify VITE_GOOGLE_API_KEY is set correctly
- Check browser console for Drive API errors
- Ensure Drive API is enabled in Google Cloud Console
- Verify user has granted Drive permissions

---

## 🎯 Features

✅ Secure OAuth 2.0 authentication  
✅ Automatic Google Drive sync  
✅ Fallback to localStorage  
✅ Protected admin routes  
✅ User profile display  
✅ Real-time sync status  
✅ No localhost restrictions  
✅ Production-ready deployment  

---

## 🆘 Support

If you encounter issues:
1. Check browser console for errors
2. Verify all environment variables are set
3. Confirm Google Cloud Console configuration
4. Check OAuth redirect URIs match exactly

---

## 📄 License

Built with ❤️ by Sandeep Gaddam
