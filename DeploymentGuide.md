# Deployment Guide

This guide covers deploying the frontend to Netlify and the backend to Render.

## 1. Backend Deployment (Render)

1. Create a [Render](https://render.com/) account.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub/GitLab repository.
4. Fill in the following details:
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Click **Create Web Service**. Render will automatically detect the free tier.
6. Once deployed, note your Render URL (e.g., `https://your-backend.onrender.com`).

*(Note: Currently, the backend serves as a health check since Firebase handles data. Ensure it stays active for any future API endpoints.)*

## 2. Frontend Deployment (Netlify)

1. Create a [Netlify](https://www.netlify.com/) account.
2. Click **Add new site** -> **Import an existing project**.
3. Connect your repository.
4. Fill in the following details:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **Show advanced** and add your environment variables from your local `frontend/.env` file:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
6. Click **Deploy site**.

## Verification
- Visit the Netlify frontend URL to ensure the UI loads.
- Test creating a mock order to verify Firebase connection.
- Visit your Render URL `/api/health` to confirm the backend is running.
