# LMS Cloud Sai 🎓

A full-stack **Learning Management System (LMS)** built for IT students, featuring role-based access control, gamification, mock tests, and cloud-hosted resources.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, TailwindCSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT (JSON Web Tokens) |
| File Storage | Cloudinary |
| Deployment | Render (Backend) · Vercel (Frontend) |

---

## 🏗️ Project Structure

```
lms/
├── client/          # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── context/
│   └── vercel.json
└── server/          # Node.js backend (Express)
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── utils/
    └── .env.example
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

### Backend Setup

```bash
cd server
npm install
cp .env.example .env   # Fill in your credentials
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## 🔐 Environment Variables

Copy `server/.env.example` to `server/.env` and fill in:

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `PORT` | Server port (default: 5000) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

---

## 👥 Roles

| Role | Capabilities |
|------|-------------|
| **Admin** | Manage courses, users, content, mock tests |
| **Student** | Enroll, track progress, take mock tests, earn XP |

---

## 📦 Deployment

- **Backend**: Deploy `server/` on [Render](https://render.com) — set all env vars in the dashboard
- **Frontend**: Deploy `client/` on [Vercel](https://vercel.com) — set `VITE_API_BASE_URL` to your Render URL

---

## 📄 License

MIT © Sairitik008
