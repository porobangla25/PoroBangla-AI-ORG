# Deployment Guide for Lumina Notes

## 1. Local Development
1. Open `.env` file.
2. Paste your Gemini API Key: `VITE_GEMINI_API_KEY=AIzaSy...`
3. Run `npm install`
4. Run `npm run dev`

## 2. Deploying to Vercel
Since we do not push `.env` to GitHub (for security), you must manually set the environment variable in Vercel.

1. Push your code to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and Import your repository.
3. In the **Configure Project** step, look for **Environment Variables**.
4. Add a new variable:
   - **Key**: `VITE_GEMINI_API_KEY`
   - **Value**: `Your_Actual_Gemini_API_Key_Here`
5. Click **Deploy**.

## 3. If Deployment Fails
If you see a black screen or errors:
1. Ensure the API Key is correct in Vercel Project Settings > Environment Variables.
2. If you changed the key, go to **Deployments** tab and **Redeploy** the latest commit.
