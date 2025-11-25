# LinkShort - URL Shortener

TinyLink is a simple web application to shorten URLs, track clicks, and view link statistics. Think of it as a mini version of Bit.ly.  

**Live Demo:** [https://url-shortner-service-1.onrender.com](https://url-shortner-service-1.onrender.com)

---

## Features

- **Shorten URLs:** Create custom or random short codes for any URL.  
- **Redirect:** Visiting `/<shortcode>` redirects to the original URL and increments click count.  
- **Dashboard:** View all links, their target URLs, total clicks, and last clicked time.  
- **Delete Links:** Remove a link and stop redirects.  
- **Statistics:** View per-link stats at `/code/:code`.  
- **Health Check:** System status available at `/healthz`.  
- **Responsive UI:** Works on mobile and desktop.  
- **User Authentication:** Secure signup and login to manage your links.

---

## Tech Stack

- **Frontend:** React.js, Tailwind CSS, Recharts  
- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL (Neon/Postgres)  
- **Deployment:** Render  

---

## Project Structure

```

.
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/   # Navbar, forms, etc.
│   │   ├── pages/        # Dashboard, Stats, Login, Signup
│   │   └── config/       # API config
│   └── package.json
├── backend/               # Node/Express backend
│   ├── src/
│   │   ├── controllers/   # Auth and Link controllers
│   │   ├── routes/        # Auth and Link routes
│   │   └── config/        # DB config
│   └── server.js
├── .env.example           # Environment variables example
├── package.json
└── README.md

````

---

## API Endpoints

| Method | Path               | Description                                 |
|--------|-------------------|---------------------------------------------|
| POST   | /api/links        | Create a short link (409 if code exists)    |
| GET    | /api/links        | Get all links for a user                     |
| GET    | /api/links/:code  | Get stats for a single code                 |
| DELETE | /api/links/:code  | Delete a link                               |
| GET    | /:code            | Redirect to original URL                    |
| GET    | /healthz          | Health check (returns JSON status)         |

---

## URL Conventions

- Dashboard: `/`  
- Stats page: `/code/:code`  
- Redirect: `/:code`  
- Health check: `/healthz`  

**Short code format:** `[A-Za-z0-9]{6,8}`  

---

## Installation & Setup

1. **Clone the repository:**

```bash
git clone https://github.com/RahulMetre03/URL_Shortner_Service.git
cd URL_Shortner_Service
````

2. **Install backend dependencies:**

```bash
npm install
```

3. **Setup environment variables** (create `.env`):

```
DATABASE_URL=your_postgres_database_url
BASE_URL=https://url-shortner-service-1.onrender.com
PORT=5000 # optional for local dev
```

4. **Start the backend server:**

```bash
npm run dev
```

5. **Install and start the frontend:**

```bash
cd frontend
npm install
npm run dev
```

---


---

## Notes

* All links are validated before saving.
* Deleted links return 404 on redirect.
* Stats page shows total clicks, last clicked, and short URL info.
* Uses JWT-based authentication for user accounts.
* Fully responsive and mobile-friendly.

---

## Contribution

Feel free to fork, modify, or suggest improvements. Ensure endpoints and URL conventions are maintained for automated testing.

---




