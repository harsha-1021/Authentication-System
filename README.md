🔐 Authentication System (Node.js + Express + MongoDB)

A secure and production-ready authentication system featuring JWT auth, HTTP-only cookies, bcrypt password hashing, role-based access, forgot/reset password via Nodemailer, and rate-limited login.
Perfect for full-stack apps, dashboards, admin panels, and placement projects.

🚀 Tech Stack

- Node.js, Express.js

- MongoDB + Mongoose

- JWT (JSON Web Tokens)

- bcrypt (salt rounds = 10)

- express-validator

- express-rate-limit

- cookie-parser, cors, morgan

- Nodemailer (SMTP)

📁 Folder Structure
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

🔧 Environment Variables
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


🛠 Installation & Run
```bash
npm install
npm run dev   # nodemon
# or npm start
```


📌 API Routes
| Method | Endpoint                      | Description                |
| ------ | ----------------------------- | -------------------------- |
| POST   | `/auth/signup`                | Create new user            |
| POST   | `/auth/login`                 | Login (rate-limited 5/15m) |
| POST   | `/auth/logout`                | Logout                     |
| POST   | `/auth/forgot-password`       | Send reset link            |
| POST   | `/auth/reset-password/:token` | Reset password             |


Protected Routes
| Method | Endpoint            | Access              |
| ------ | ------------------- | ------------------- |
| GET    | `/auth/profile`     | Authenticated users |
| GET    | `/auth/admin/users` | Admin only          |


🧪 Testing (PowerShell Examples)
Signup
```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:5000/auth/signup" `
  -ContentType "application/json" `
  -Body '{ "name":"Test", "email":"test@example.com", "password":"secret123", "role":"admin" }'
```

Login (stores session)
```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:5000/auth/login" `
  -ContentType "application/json" `
  -Body '{ "email":"test@example.com", "password":"secret123" }' `
  -SessionVariable sess
```

Profile
```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:5000/auth/profile" -WebSession $sess
```

Admin users list
```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:5000/auth/admin/users" -WebSession $sess
```

Forgot Password
```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:5000/auth/forgot-password" `
  -ContentType "application/json" `
  -Body '{ "email":"test@example.com" }'
```

Reset Password
```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:5000/auth/reset-password/<token>" `
  -ContentType "application/json" `
  -Body '{ "password":"newpass123" }'
```

Logout
```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:5000/auth/logout" -WebSession $sess
```

📬 SMTP Setup (Gmail)
1. Enable 2-Step Verification on your Gmail account.
2. Create an App Password (16 characters).
3. Set SMTP_PASS to that app password.
4. Restart your server.

📝 Notes
- JWT expiry: 1 day, stored in HTTP-only cookie
- Bcrypt salt rounds: 10
- CORS allows CLIENT_URL with credentials
- Login rate limit: 5 attempts per 15 minutes
- If SMTP fails, reset link will still print in console for debugging

