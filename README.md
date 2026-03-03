# Review.it

Review.it is a full-stack review platform where users can discover, rate, and review Books, Movies, Series, and Courses in one unified ecosystem.

The goal is to eliminate the need for separate platforms for different types of content and provide a centralized, modern review experience.

---

## Overview

Review.it allows users to:

* Create an account and authenticate securely
* Browse content across multiple categories
* Write and manage reviews
* Rate items using a star-based system
* View trending and top-rated content
* Maintain personal lists (watchlist, reading list, course list)
* Interact with other users

---

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* ShadCN UI

### Backend

* Node.js
* Express.js
* PostgreSQL
* Prisma ORM

---

## Architecture

The project follows a full-stack architecture with a separated frontend and backend.

```
review-it/
│
├── frontend/      # React + Vite client
└── backend/       # Node + Express + PostgreSQL API
```

### Frontend

* Handles UI and user interaction
* Communicates with backend via REST API
* Responsive and optimized for performance

### Backend

* Handles authentication and authorization
* Manages users, reviews, ratings, and content
* Provides RESTful APIs
* Uses Prisma for database access

---

## Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd review-it
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Runs on:

```
http://localhost:8080
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_secret_key"
```

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Start backend server:

```bash
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

---

## Core Features

* User authentication (JWT-based)
* Create, update, delete reviews
* Rating aggregation system
* Category-based filtering
* Search functionality
* Follow users (planned/optional)
* Personalized recommendation system (planned)

---

## Database Design (Core Models)

* User
* Review
* Rating
* Content (Book, Movie, Series, Course)
* Category
* Lists (Watchlist, Reading list, etc.)

---

## Future Improvements

* Advanced recommendation engine
* AI-based review insights
* Notification system
* Admin moderation dashboard
* Performance optimization and caching
* Deployment (Docker + CI/CD)
