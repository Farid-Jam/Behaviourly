# Backend

## Login (Auth server) — required for "Try it for free"

The Auth server serves `/login` and `/callback` for Google sign-in. **It must be running** or you’ll get “localhost sent an invalid response” when the app redirects to login.

1. **Create `.env`** from the example:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`, and `FLASK_SECRET_KEY`.

2. **Install dependencies** (if needed):
   ```bash
   pip install flask requests python-dotenv sqlalchemy
   ```

3. **Run the Auth server** (default port 5000):
   ```bash
   python Auth.py
   ```
   You should see a log like: `Auth server starting at http://localhost:5000 — login: ... callback: ...`

4. **Use a different port** (e.g. if 5000 is in use):
   ```bash
   PORT=5001 python Auth.py
   ```
   Then in `.env` set `REDIRECT_URI=http://localhost:5001/callback` and add that exact URL to Auth0 **Allowed Callback URLs**. In the frontend `.env` set `VITE_API_URL=http://localhost:5001`.

5. **Auth0 (fixes 403)**: With the Auth server running, open **http://localhost:5000/auth/config** and copy the `redirect_uri` value. In Auth0 → Application → Settings → **Allowed Callback URLs**, add that exact string. Add your frontend URL to **Allowed Logout URLs** and **Allowed Web Origins**.

Once the Auth server is running, “Try it for free” should redirect to login and back correctly.
