# Deployment checklist

## MongoDB Atlas
1. Create a database.
2. Create a database user.
3. Add Render's outbound access as allowed network access (or temporarily allow `0.0.0.0/0` while learning).
4. Copy the connection string into Render's `MONGO_URL`.

## Cloudinary
Create a Cloudinary account and copy:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Render
- Root Directory: `server`
- Build: `npm install`
- Start: `npm start`
- Health check: `/health`
- `NODE_ENV=production`
- `JWT_SECRET`: 32+ random characters
- `MONGO_URL`: Atlas connection string
- `CLIENT_URL`: exact frontend origin
- `SERVER_URL`: exact Render API origin
- Cloudinary variables

## Vercel
- Root Directory: `client`
- Build: `npm run build`
- Output: `dist`
- `VITE_API_URL=https://YOUR-RENDER-SERVICE.onrender.com/api`

## Final verification
1. Open Render `/health`.
2. Open the Vercel site.
3. Sign up.
4. Refresh the browser and confirm the user remains signed in.
5. Create a blog without an image.
6. Create a blog with a Cloudinary image.
7. Edit and delete your own blog.
8. Try editing another user's blog and confirm `403`.
9. Like/unlike.
10. Bookmark/unbookmark.
11. Add and delete a comment.
12. Report a blog.
13. Verify admin routes with an admin account.
