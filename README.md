## Authentication System (Node.js + Express + MongoDB)

JWT auth with HTTP-only cookie, bcrypt passwords, role-based access, forgot/reset password (Nodemailer), rate-limited login, and admin user list.

### Stack
- Node.js, Express, Mongoose, JWT
- bcrypt (salt rounds 10), express-validator, express-rate-limit
- cookie-parser, cors, morgan
- Nodemailer (SMTP)

### Folder Structure
```
config/          # db connection
controllers/     # route handlers
middlewares/     # auth, error handler, rate limiter
models/          # Mongoose models
routes/          # express routes
utils/           # helpers (jwt, mailer)
public/          # optional demo page
server.js
package.json
.env.example
```

### Environment Variables
Copy `.env.example` to `.env` and set values:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/auth-db
JWT_SECRET=supersecretjwt
CLIENT_URL=http://localhost:3000
COOKIE_NAME=token
RESET_TOKEN_EXP_MINUTES=15

SMTP_SERVICE=gmail          # e.g., gmail (optional if host/port used)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587               # 465 for SMTPS
SMTP_USER=your_gmail_address
SMTP_PASS=your_app_password # Gmail app password (not your login)
SMTP_FROM="Auth App <your_gmail_address>"
```

### Install & Run
```bash
npm install
npm run dev   # nodemon
# or npm start
```

### API Routes
- `POST /auth/signup` — body: `{ name, email, password, role? }`
- `POST /auth/login` — body: `{ email, password }` (rate-limited 5/15m)
- `POST /auth/logout`
- `POST /auth/forgot-password` — body: `{ email }`
- `POST /auth/reset-password/:token` — body: `{ password }`
- `GET  /auth/profile` — auth required (cookie)
- `GET  /auth/admin/users` — admin role required

### Testing with PowerShell
Signup:
```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:5000/auth/signup" `
  -ContentType "application/json" `
  -Body '{ "name":"Test", "email":"test@example.com", "password":"secret123", "role":"admin" }'
```
Login (stores session):
```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:5000/auth/login" `
  -ContentType "application/json" `
  -Body '{ "email":"test@example.com", "password":"secret123" }' `
  -SessionVariable sess
```
Profile:
```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:5000/auth/profile" -WebSession $sess
```
Admin list:
```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:5000/auth/admin/users" -WebSession $sess
```
Forgot password (email must exist):
```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:5000/auth/forgot-password" `
  -ContentType "application/json" `
  -Body '{ "email":"test@example.com" }'
```
Reset password (token from email/log):
```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:5000/auth/reset-password/<token>" `
  -ContentType "application/json" `
  -Body '{ "password":"newpass123" }'
```
Logout:
```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:5000/auth/logout" -WebSession $sess
```

### SMTP (Gmail)
- Enable 2FA on the Gmail account.
- Create an App Password (16 chars) and set `SMTP_PASS` to it.
- Set `SMTP_USER` and `SMTP_FROM` to your Gmail address.
- Restart the server after updating `.env`.

### Notes
- JWT expiry: 1 day; stored in HTTP-only cookie named by `COOKIE_NAME`.
- Bcrypt salt rounds: 10.
- CORS allows `CLIENT_URL` with credentials.
- Login rate limit: 5 attempts per 15 minutes.
- Forgot/reset will log the reset link if email fails (fallback for debugging).
