# Blogify API contract

Base URL: `/api`

All authenticated requests use the secure `token` cookie. State-changing requests also require `X-CSRF-Token`; the frontend obtains it from `GET /auth/csrf`.

## Auth
- `GET /auth/csrf` → `{ csrfToken }`
- `POST /auth/signup` body `{ username, email, password }`
- `POST /auth/signin` body `{ email, password }`
- `GET /auth/me`
- `POST /auth/logout`

## Blogs
- `GET /blogs?page=1&limit=10&search=&category=`
- `GET /blogs/:id`
- `POST /blogs` multipart fields: `title`, `body`, `category`, `tags`, `status`, optional `coverImage`
- `PATCH /blogs/:id` same multipart fields
- `DELETE /blogs/:id`
- `POST /blogs/:id/comments` body `{ content }`
- `POST /blogs/:id/like`
- `POST /blogs/:id/bookmark`
- `POST /blogs/:id/report` body `{ reason }`

## Comments
- `PATCH /comments/:id` body `{ content }`
- `DELETE /comments/:id`

## User
- `GET /users/profile/:id`
- `GET /users/bookmarks`
- `GET /users/notifications`
- `PATCH /users/notifications/read`

## Admin
- `GET /admin/stats`
- `GET /admin/users`
- `PATCH /admin/users/:id/toggle`
- `GET /admin/reports`
- `PATCH /admin/reports/:id` body `{ status: "RESOLVED" | "REJECTED" }`
