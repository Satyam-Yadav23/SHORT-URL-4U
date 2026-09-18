<div align="center">

# ShortUrl4U

**A modern, full-stack URL shortener with QR code generation, click analytics, and secure authentication.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

</div>

---

## Features

| Feature | Description |
|---------|-------------|
| **Instant URL Shortening** | Shorten any URL in one click, no sign-up required |
| **QR Code Generation** | Generate scannable QR codes for any link |
| **Click Analytics** | Track how many times your shortened links are clicked |
| **User Dashboard** | Manage all your shortened URLs in one place |
| **Authentication** | Secure sign-up, login, and password reset via email |

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, TanStack Router, Redux Toolkit, Tailwind CSS, Vite |
| **Backend** | Express 5, MongoDB (Mongoose), JWT, Nodemailer, nanoid |

## Getting Started

### Prerequisites

- **Node.js** 18+
- **MongoDB** (local or [Atlas](https://www.mongodb.com/atlas))

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Satyam-Yadav23/URL-Shortener-Project.git
cd URL-Shortener-Project
```

**2. Setup Backend**

```bash
cd BACKEND
npm install
```

Create a `.env` file in `BACKEND/` with:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
APP_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

```bash
npm run dev
```

For deployment, set `APP_URL` on the backend to its public URL and set `VITE_API_URL` on the frontend to that same backend URL. For example, `APP_URL=https://your-backend.onrender.com` and `VITE_API_URL=https://your-backend.onrender.com`.

**3. Setup Frontend**

```bash
cd FRONTEND
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:3000`.

## Project Structure

```
BACKEND/                Express REST API
  src/
    config/             App & database configuration
    controller/         Route handlers
    dao/                Data access layer
    middleware/          Auth middleware (JWT)
    models/             Mongoose schemas
    routes/             API route definitions
    services/           Business logic
    utils/              Helpers & error handling

FRONTEND/               React SPA (Vite)
  src/
    api/                Axios API calls
    components/         Reusable UI components
    pages/              Page components
    routing/            TanStack Router config
    store/              Redux store & slices
    utils/              Axios instance & helpers
```

## License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built by <a href="https://github.com/Satyam-Yadav23">Satyam Yadav</a></sub>
</div>