# Blogify — Production-Grade Blogging Platform

Blogify is a full-stack blogging platform rebuilt from the original Express/EJS application into a production-oriented **React + Express + MongoDB** architecture.

## Stack
- Frontend: React, Vite, React Router
- Backend: Node.js, Express
- Database: MongoDB + Mongoose
- Authentication: JWT in secure HTTP-only cookies
- CSRF: double-submit token for state-changing requests
- Password hashing: bcryptjs
- Security: Helmet, CORS, rate limiting, validation
- Images: Cloudinary in production; local `uploads/` fallback in development

## Architecture
```text
React/Vite (Vercel)
        |
      HTTPS
        |
Express REST API (Render)
   |       |        |
 Auth   Blogs    Admin
        |
     MongoDB Atlas
        |
     Cloudinary
```

## Local setup
1. Install Node.js 20+.
2. Copy `.env.example` to `.env`.
3. Set `MONGO_URL`, `JWT_SECRET`, and `CLIENT_URL`.
4. Install dependencies:
   - `cd server && npm install`
   - `cd ../client && npm install`
5. Run backend: `cd server && npm run dev`
6. Run frontend: `cd client && npm run dev`
7. Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

## Production deployment
### Render
Create a Web Service from the repository:
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`
- Environment variables: all variables in `server/.env.example`
- Use MongoDB Atlas for `MONGO_URL`.
- Use Cloudinary credentials for production image uploads.

### Vercel
Create a project from the same repository:
- Root Directory: `client`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment variable: `VITE_API_URL=https://YOUR-RENDER-SERVICE.onrender.com/api`

After deploying the frontend, update Render's `CLIENT_URL` to the exact Vercel origin, for example `https://your-blogify.vercel.app`.

### Important production cookie note
The API uses secure HTTP-only cookies. Vercel and Render have different site origins, so for the most reliable production authentication experience use a custom domain setup where the frontend and API share the same registrable domain (for example `app.example.com` and `api.example.com`), or put the API behind a same-origin Vercel proxy. The included CORS and `SameSite=None` configuration is suitable for the normal Vercel/Render setup where the browser permits cross-site cookies.

## Security notes
- Never commit `.env`.
- Rotate any secret that was previously committed to GitHub.
- Production image uploads require Cloudinary because Render's local filesystem is not durable.
- Authentication uses an HTTP-only cookie; the React app never reads the JWT.

## Main API routes
- `GET /health`
- `GET /api/auth/me`
- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `POST /api/auth/logout`
- `GET /api/blogs`
- `GET /api/blogs/:id`
- `POST /api/blogs`
- `PATCH /api/blogs/:id`
- `DELETE /api/blogs/:id`
- `POST /api/blogs/:id/comments`
- `POST /api/blogs/:id/like`
- `POST /api/blogs/:id/bookmark`
- `POST /api/blogs/:id/report`
- `PATCH /api/comments/:id`
- `DELETE /api/comments/:id`
- `GET /api/users/profile/:id`
- `GET /api/users/bookmarks`
- `GET /api/users/notifications`
- `GET /api/admin/stats`

## Testing
Backend validation tests:
`cd server && npm test`
