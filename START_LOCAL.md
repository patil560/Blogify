# Run locally

## 1. Configure environment
```bash
cp .env.example .env
```
Edit `.env` and set at least:
- `MONGO_URL`
- `JWT_SECRET` (32+ characters)

## 2. Install
```bash
npm run install:all
```

## 3. Start backend
```bash
npm run dev:server
```

## 4. Start frontend in another terminal
```bash
npm run dev:client
```

Open the Vite URL, normally `http://localhost:5173`.

## 5. Tests
```bash
npm test
```

## 6. Production frontend build
```bash
npm run build:client
```
