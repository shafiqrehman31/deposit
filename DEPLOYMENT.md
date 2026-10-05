# Deposit Hero - Local Setup & Vercel Deployment Guide

This guide walks you through configuring the project locally on your machine and deploying it seamlessly to **Vercel**.

---

## 1. Local Configuration & Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended). Check via: `node -v`
- **npm**: v9+ (or `pnpm` / `yarn`). Check via: `npm -v`
- **Git**: installed on your computer.

### Step-by-Step Local Run

1. **Clone or Download the Repository**:
   ```bash
   git clone <YOUR_GIT_REPO_URL>
   cd react-example
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to a new `.env` file:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and set your preferred keys (or use the defaults):
   ```env
   PORT=3000
   ENCRYPTION_SECRET="deposit-hero-secure-master-salt-2026-uk"
   ```

4. **Start the Local Development Server**:
   ```bash
   npm run dev
   ```
   You will see:
   ```
   Deposit Hero Full-Stack Server running on http://0.0.0.0:3000
   ```

5. **Access the Application in your Browser**:
   - **Public Client Website**: `http://localhost:3000`
   - **Protected Admin Dashboard**: `http://localhost:3000/#admin` (or `http://localhost:3000/admin`)

6. **Admin Login Credentials**:
   - **Username**: `admin` (or `admin@mydeposithero.co.uk`)
   - **Master Password**: `DepositHero2026!`
   - **Two-Factor Authentication (2FA) Code**: `123456` (or emergency backup code: `849201`)

---

## 2. Deploying to Vercel (Step-by-Step)

The project has already been configured with `vercel.json` and a serverless entry point at `api/index.ts`.

### Option A: Deploy via GitHub (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Deposit Hero"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git
   git push -u origin main
   ```

2. **Log into Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in or sign up.

3. **Import Project**:
   - In your Vercel Dashboard, click **"Add New..."** → **"Project"**.
   - Select your GitHub repository and click **"Import"**.

4. **Configure Project Settings**:
   - **Framework Preset**: Vite (detected automatically).
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Set Environment Variables in Vercel**:
   Under **"Environment Variables"**, add:
   - `ENCRYPTION_SECRET`: (e.g. `your-long-secure-random-32-character-secret`)
   - `NODE_ENV`: `production`

6. **Click "Deploy"**:
   - Vercel will install dependencies, compile the Vite SPA frontend, and configure the `/api` serverless backend.
   - Within 60 seconds, your site will be live at `https://<your-project>.vercel.app`!

---

### Option B: Deploy via Vercel CLI

If you prefer deploying directly from your terminal:

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Run Vercel Deploy**:
   ```bash
   vercel
   ```
   Follow the CLI prompts:
   - Set up and deploy? **Yes**
   - Which scope? **Select your personal/team account**
   - Link to existing project? **No**
   - Project name? **deposit-hero**
   - In which directory? **./**

3. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

---

## 3. Post-Deployment Checklist

- ✅ **Public Site Check**: Visit `https://your-domain.vercel.app` to test the Deposit Calculator, Eligibility Quiz, and Contact Form.
- ✅ **Admin Panel Check**: Navigate to `https://your-domain.vercel.app/#admin`, log in with `admin` / `DepositHero2026!`, and enter `123456`.
- ✅ **CMS Updates**: In the admin section, update phone numbers, hero text, and upload your custom company logo and favicon.
- ✅ **Pipedrive CRM**: Go to the **Pipedrive CRM** tab in the admin panel, enter your Pipedrive API token, and verify the connection.
