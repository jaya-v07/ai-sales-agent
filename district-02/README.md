# District 02

An AI-native B2B sales research workspace. This MVP uses deterministic, clearly labelled demo data and works without API keys.

## Run locally

In one terminal, start the API:

```bash
cd district-02/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --port 8000
```

In another terminal, start the frontend:

```bash
cd district-02/frontend
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. `NEXT_PUBLIC_API_URL` supplies the API base URL; it is intentionally not hardcoded into the application.

## Demo behaviour

The research flow extracts a lightweight intent, creates a plan, and runs distinct discovery, verification, decision-maker, scoring and outreach functions. The provider returns five fictional prospects from a curated demo dataset. No live claim, email address, or email sending is performed.

## Deploy

### Frontend — Vercel

1. Import the repository in Vercel.
2. Set the project **Root Directory** to `district-02/frontend`.
3. Add `NEXT_PUBLIC_API_URL` with the public HTTPS URL of the Render backend, for example `https://district-02-api.onrender.com` (no trailing slash).
4. Deploy using Vercel's default Node build settings (`npm run build`).

### Backend — Render Web Service

1. Create a new Render **Web Service** from this repository.
2. Set the service **Root Directory** to `district-02/backend`.
3. Set the build command to `pip install -r requirements.txt`.
4. Set the start command to `uvicorn main:app --host 0.0.0.0 --port $PORT`.
5. Add `FRONTEND_URL` with the exact Vercel deployment origin, for example `https://district-02.vercel.app`.
6. Add `DEMO_MODE=true`.
7. Deploy, then set the resulting Render URL as `NEXT_PUBLIC_API_URL` in Vercel and redeploy the frontend.

`FRONTEND_URL` also accepts a comma-separated list when both a production and preview frontend origin must be allowed. Do not use wildcard origins with credentialed requests.
