# 📊 DSA Tracker

A premium MERN-stack spaced repetition (SRS) dashboard built to plan, log, review, and master data structures and algorithms (DSA) problems. Organize curated lists, write markdown study notes, and track your daily consistency with an integrated contribution heatmap.

---

## ✨ Features

### 📅 Spaced Repetition (SRS) Engine
* **Next Review Calculations**: Configurable review intervals (1, 2, 3, 7, 14, 30, 60 days) to optimize long-term memory retention.
* **Triage Sections**: Review queue divided into **Due Today**, **Over Due**, and **Upcoming** categories.
* **Marked Done Actions**: Effortlessly update review schedules and increment solve counts in a single click.

### 📊 Interactive Analytics Dashboard
* **Consistency Heatmap**: A GitHub-style 90-day activity calendar displaying your daily submission counts and consistency.
* **Quick Stats**: Real-time trackers for Total Solved, Solved Today, Due Reviews, and Total Logged.
* **Visual Guides**: Difficulty distribution indicators (Easy, Medium, Hard).

### 📁 Curated Collections & Topics
* **Custom Lists**: Group problems into custom lists (e.g. Blind 75, Top Interview 150) styled with custom description headers and color gradients.
* **Topic Categorization**: Filter and sort problems dynamically by specific data structures or algorithmic patterns.

### 📝 Notes & Editor
* **Markdown Support**: Take extensive notes, copy code snippets, and review syntax inside a clean markdown parser.
* **Quick View**: Preview notes directly from the logs using an interactive overlay dialog without leaving the table.

### ⚙️ Premium UX & UI
* **Collapsible Sidebar**: Slide the sidebar open or collapse it into a narrow icon-only desktop navigation panel.
* **Recycle Bin**: Recover accidentally deleted problems or empty the trash permanently.
* **Data Portability**: Export your collection and logs anytime in JSON or CSV format.
* **Keyboard Shortcuts**: Open the helper modal using the `?` key for fast navigation.
* **Dual Modes**: Learn locally in **Guest Mode** (client-side state) or sync across devices by creating an account.

---

## 🛠️ Tech Stack

* **Frontend**: React (Vite), TailwindCSS, Lucide React (Icons)
* **Backend**: Node.js, Express.js
* **Database**: MongoDB (Mongoose ODM)
* **Authentication**: JSON Web Tokens (JWT)

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) installed on your machine.
* [MongoDB](https://www.mongodb.com/) server running locally or a MongoDB Atlas URI connection string.

### Repository Structure
```
├── backend/          # Node.js Express server code & database models
├── frontend/         # React SPA client code built with Vite
└── README.md         # Documentation
```

### Installation & Local Setup

#### 1. Clone the repository
```bash
git clone https://github.com/rahulkamti11/DSA-Tracker-MERN.git
cd dsa-tracker-react
```

#### 2. Configure Environment Variables

**Backend (`backend/.env`)**:
Create a `.env` file in the `backend/` folder matching the `.env.example` template:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/dsa-tracker
JWT_SECRET=your_super_secret_jwt_key
```

**Frontend (`frontend/.env`)**:
Create a `.env` file in the `frontend/` folder matching the `.env.example` template:
```env
VITE_API_URL=http://localhost:5000/api
```

#### 3. Install Dependencies & Run

You can manage both frontend and backend folders directly from the root workspace directory using the helper scripts configured in the root `package.json`:

* **Install all dependencies** (installs node modules for both backend and frontend):
  ```bash
  npm run install-all
  ```
* **Run both services concurrently** (opens separate command shell windows to boot both frontend and backend development servers concurrently):
  ```bash
  npm run dev
  ```
Open your browser and navigate to `http://localhost:5173`.

---

## 🛡️ API Endpoints

### Authentication
* `POST /api/auth/register` - Create a new user account.
* `POST /api/auth/login` - Authenticate user credentials and return a token.
* `GET /api/auth/profile` - Retrieve user profile and activity.
* `POST /api/auth/activity` - Increment submissions and update the heatmap.

### Problems
* `GET /api/problems` - Fetch all problems.
* `POST /api/problems` - Log a new solved question.
* `PUT /api/problems/:id` - Edit details (name, difficulty, tags, notes).
* `DELETE /api/problems/:id` - Permanently delete from trash.
* `PUT /api/problems/:id/trash` - Move problem to recycle bin or restore it.
* `DELETE /api/problems/trash/empty` - Permanent empty trash cleanup.

### Collections
* `GET /api/collections` - Fetch all user lists.
* `POST /api/collections` - Create a custom collection list (with description and color styling).
* `DELETE /api/collections/:id` - Delete a collection.
