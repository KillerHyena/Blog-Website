# 📰 MERN Blog Website

A **full-stack blogging platform** built with the **MERN stack** as part of the **GDSC NSUT Dev Department Membership Task**.
It allows users to **create, read, update, and delete** blog posts with authentication, comments, categories, tags, and admin features.

---

## 🚀 Features

* 🔐 **Authentication & Authorization**

  * User Sign Up / Sign In
  * Secure JWT authentication
  * OAuth (Google Authentication)

* 📝 **Blog Management**

  * Create, edit, update, and delete posts
  * Categorize and tag posts
  * Filter & search posts

* 💬 **Comment System**

  * Add and manage comments on individual posts

* 🧑‍💻 **User Dashboard**

  * Profile management
  * View and manage own posts
  * Admin access for managing users/posts

* 🎨 **Theming**

  * Light & dark mode toggle with Redux state


## 🛠 Tech Stack

**Frontend (client):**

* React + Vite
* Redux Toolkit (state management)
* Tailwind CSS (styling)
* Firebase (OAuth login)

**Backend (api):**

* Node.js + Express.js
* MongoDB with Mongoose (database)
* JWT for authentication
* REST API structure (controllers, routes, models, utils)

---

## 📂 Project Structure

```
.
├── api/                    # Backend
│   ├── controllers/        # Route controllers (auth, post, user, comment)
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── utils/              # Error handling & middleware
│   └── index.js            # Entry point
│
├── client/                 # Frontend
│   └── src/
│       ├── components/     # Reusable React components
│       ├── pages/          # Page-level components (Home, Post, Dashboard, etc.)
│       ├── redux/          # Redux slices & store
│       ├── App.jsx         # Main React app
│       ├── firebase.js     # Firebase config
│       ├── index.css       # Global styles
│       └── main.jsx        # Entry point
│
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 📌 Requirements Fulfilled (per GDSC Task)

* ✅ Authentication (SignIn/SignUp, OAuth)
* ✅ Home page with posts list
* ✅ Post creation & management (CRUD)
* ✅ Dynamic post display with comments
* ✅ Categories & tags with filtering
* ✅ User dashboard + Admin routes
* ✅ Theming (Dark/Light mode)

---