# Campusly

> Smart Campus & Student Productivity Platform

Campusly is a full-stack web application designed to bring essential academic and campus activities into one centralized platform. It helps students manage attendance, assignments, tasks, events, announcements, profile information, and AI-powered assistance from a single dashboard.

Built for the **Pixels to Products / Cloudinary AI Hackathon 2026**.

---

## 🚀 Overview

Students often use multiple platforms to track attendance, assignments, deadlines, events, announcements, and other academic activities. This makes it difficult to stay organized and quickly find important information.

**Campusly** solves this problem by providing a unified student productivity platform where users can:

- Track attendance
- Manage assignments
- Organize personal tasks
- Discover and register for campus events
- Stay updated with announcements
- Get assistance from an AI-powered campus assistant
- Manage their profile and account
- View important academic information from one dashboard

The goal is to make everyday campus life more organized, accessible, and productive.

---

## ✨ Features

### 🔐 Authentication

- User registration
- User login
- JWT-based authentication
- Protected routes
- User profile
- Change password
- Logout functionality

### 📊 Dashboard

The dashboard provides a quick overview of the student's academic and campus activities.

It includes:

- Attendance overview
- Pending assignments
- Task summary
- Upcoming events
- Recent announcements
- Quick access to important sections

### 📚 Attendance Management

Students can:

- View attendance records
- Track attendance percentage
- View subject-wise attendance
- Identify subjects requiring attention
- Add and update attendance records

Attendance indicators use semantic status colors to make important information easy to understand.

### 📝 Assignment Management

Students can:

- View assignments
- Filter assignments by status
- Create assignments
- Update assignments
- Delete assignments
- Track due dates
- Mark assignments as completed
- Track assignment progress

### ✅ Task Management

Campusly includes a personal task management system where students can:

- Create tasks
- Edit tasks
- Delete tasks
- Mark tasks as completed
- Filter tasks
- Set task priorities
- Track due dates

Task priorities include:

- High
- Medium
- Low

### 📅 Campus Events

Students can:

- Browse campus events
- Filter events by type
- View event details
- Register for events
- Unregister from events
- Track registered events

### 📢 Announcements

Students can stay updated with important campus information through announcements.

Features include:

- Announcement listing
- Search
- Category filtering
- Important academic updates
- Event announcements
- Assignment announcements
- Examination announcements

### 🤖 AI Campus Assistant

Campusly includes an AI-powered assistant using the **Groq API**.

Students can use the assistant to:

- Ask questions
- Get academic guidance
- Get help understanding campus-related information
- Receive productivity suggestions
- Interact through a conversational chat interface

The Groq API is accessed from the backend so API credentials are not exposed to the frontend.

### 👤 Profile Management

Users can:

- View their profile
- Update their profile
- Change their password
- Logout securely

### 📱 Responsive Design

Campusly is designed to work across:

- Desktop
- Tablet
- Mobile

The application includes responsive navigation, mobile sidebar controls, adaptive layouts, and mobile-friendly forms and cards.

---

## 🛠️ Tech Stack

### Frontend

- React.js
- JavaScript
- Vite
- React Router
- Axios
- Context API
- Lucide React
- Recharts
- React Hot Toast
- CSS / CSS Modules

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- REST APIs

### AI

- Groq API

### Database

- MongoDB Atlas

### Development Tools

- Git
- GitHub
- VS Code
- npm

### Deployment

- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database

---

## 🏗️ Project Structure

```text
pixels-to-products-cloudinary-ai-hackathon-2026-justus/
│
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
```

> The `.env` file is used locally and should **not** be committed to Git.

---

## 🔄 Application Architecture

Campusly follows a client-server architecture.

```text
                         ┌─────────────────────┐
                         │      Student        │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     React.js        │
                         │      Frontend       │
                         └──────────┬──────────┘
                                    │
                                  Axios
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Node.js / Express │
                         │       Backend       │
                         └───────┬───────┬─────┘
                                 │       │
                         Mongoose│       │AI Service
                                 │       │
                                 ▼       ▼
                         ┌──────────┐  ┌──────────┐
                         │ MongoDB  │  │  Groq AI │
                         │  Atlas   │  │   API    │
                         └──────────┘  └──────────┘
```

### Frontend Flow

```text
User
  ↓
React Components
  ↓
Context / Hooks
  ↓
Axios Services
  ↓
Backend REST API
```

### Backend Flow

```text
Request
  ↓
Express Route
  ↓
Authentication Middleware
  ↓
Controller
  ↓
Service / Business Logic
  ↓
Mongoose Model
  ↓
MongoDB
```

---

## 🔐 Authentication Flow

Campusly uses JWT-based authentication.

```text
Register / Login
      ↓
Backend validates credentials
      ↓
JWT generated
      ↓
Token returned to client
      ↓
Client stores authentication state
      ↓
Protected API requests include token
      ↓
Backend verifies JWT
      ↓
Authorized request continues
```

Passwords are securely hashed using `bcrypt`.

Protected routes require a valid authentication token.

---

## 🤖 AI Architecture

The AI assistant communicates with Groq through the Campusly backend.

```text
React AI Assistant
        ↓
Axios Request
        ↓
Express Backend
        ↓
AI Service
        ↓
Groq API
        ↓
AI Response
        ↓
Backend
        ↓
React Chat Interface
```

The Groq API key is stored in the backend environment variables and is never exposed directly to the client.

This architecture keeps the AI integration separate from the frontend and allows the backend to control API access and error handling.

---

## ⚙️ Installation

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- MongoDB Atlas account
- Groq API key
- Git

### 1. Clone the repository

```bash
git clone <repository-url>
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

Open another terminal:

```bash
cd server
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000

MONGODB_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_jwt_secret

GROQ_API_KEY=your_groq_api_key

CLIENT_URL=http://localhost:5173
```

### Environment Variable Description

| Variable | Description |
|---|---|
| `PORT` | Port used by the Express backend |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret used to sign and verify JWTs |
| `GROQ_API_KEY` | API key used by the AI assistant |
| `CLIENT_URL` | Frontend URL used by the backend |

> **Never commit `.env` files, database credentials, JWT secrets, or API keys to GitHub.**

---

## ▶️ Running the Project

### Start the Backend

```bash
cd server
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### Start the Frontend

In another terminal:

```bash
cd client
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

Open the frontend URL in your browser to use Campusly.

---

## 🌐 API Modules

Campusly uses REST APIs to connect the frontend with the backend.

### Authentication

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
PUT    /api/auth/profile
PUT    /api/auth/change-password
POST   /api/auth/logout
```

### Attendance

```text
GET    /api/attendance
POST   /api/attendance
PUT    /api/attendance/:id
DELETE /api/attendance/:id
```

### Assignments

```text
GET    /api/assignments
POST   /api/assignments
PUT    /api/assignments/:id
DELETE /api/assignments/:id
```

### Tasks

```text
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

### Events

```text
GET    /api/events
POST   /api/events
PUT    /api/events/:id
DELETE /api/events/:id
POST   /api/events/:id/register
DELETE /api/events/:id/register
```

### Announcements

```text
GET    /api/announcements
POST   /api/announcements
PUT    /api/announcements/:id
DELETE /api/announcements/:id
```

### AI Assistant

```text
POST   /api/ai/chat
```

> Update the endpoint names above if the final route implementation uses different paths.

---

## 🎨 Design System

Campusly uses a warm, modern visual identity based on the following palette:

| Color | Hex | Usage |
|---|---|---|
| Reptile Revenge | `#595C27` | Primary actions and navigation |
| Olivia | `#9F601E` | Secondary elements |
| Coral Kiss | `#FFDDC8` | Accent and highlights |
| Close but No Cigar | `#341600` | Sidebar and primary dark text |
| Milk Chocolate | `#7A521E` | Supporting elements |

Semantic colors are also used for application states:

- **Success** — completed/positive states
- **Warning** — attention-required states
- **Danger** — destructive/error states
- **Info** — informational states

The design system is implemented through reusable CSS variables to maintain visual consistency across the application.

---

## 📊 Core Modules

| Module | Purpose |
|---|---|
| Dashboard | Central overview of student activity |
| Attendance | Subject and attendance tracking |
| Assignments | Academic assignment management |
| Tasks | Personal productivity and task tracking |
| Events | Campus event discovery and registration |
| Announcements | Campus and academic updates |
| AI Assistant | AI-powered student assistance |
| Profile | Account and profile management |
| Authentication | Secure user access |

---

## 🧪 Project Completion Checklist

### 🔐 Authentication

- [x] User registration
- [x] User login
- [x] JWT-based authentication
- [x] Protected routes
- [x] Invalid credential handling
- [x] User profile
- [x] Profile update
- [x] Password change
- [x] Logout functionality

### 📊 Dashboard

- [x] Dashboard overview
- [x] Attendance statistics
- [x] Pending assignment summary
- [x] Task summary
- [x] Upcoming events
- [x] Recent announcements
- [x] Quick-access navigation
- [x] Loading states
- [x] Empty states
- [x] Error states

### 📚 Attendance

- [x] Attendance records
- [x] Subject-wise attendance
- [x] Attendance percentage calculation
- [x] Add attendance record
- [x] Update attendance record
- [x] Delete attendance record
- [x] Attendance status indicators
- [x] Loading states
- [x] Empty states
- [x] Error handling

### 📝 Assignments

- [x] Assignment listing
- [x] Assignment creation
- [x] Assignment editing
- [x] Assignment deletion
- [x] Assignment status filtering
- [x] Assignment progress tracking
- [x] Due-date tracking
- [x] Assignment completion
- [x] Loading states
- [x] Empty states
- [x] Error handling

### ✅ Tasks

- [x] Task listing
- [x] Task creation
- [x] Task editing
- [x] Task deletion
- [x] Task completion
- [x] Task filtering
- [x] Task priorities
- [x] Due-date tracking
- [x] Task summary
- [x] Loading states
- [x] Empty states
- [x] Error handling

### 📅 Campus Events

- [x] Event listing
- [x] Event details
- [x] Event type filtering
- [x] Event registration
- [x] Event unregistration
- [x] Registered-event tracking
- [x] Event creation
- [x] Event editing
- [x] Event deletion
- [x] Loading states
- [x] Empty states
- [x] Error handling

### 📢 Announcements

- [x] Announcement listing
- [x] Announcement creation
- [x] Announcement deletion
- [x] Announcement search
- [x] Category filtering
- [x] Academic announcements
- [x] Assignment announcements
- [x] Examination announcements
- [x] Event announcements
- [x] Loading states
- [x] Empty states
- [x] Error handling

### 🤖 AI Campus Assistant

- [x] AI chat interface
- [x] Conversational interaction
- [x] Groq API integration
- [x] Backend AI service
- [x] Server-side API key protection
- [x] AI loading state
- [x] AI error handling
- [x] User and assistant message display
- [x] Suggested prompts

### 👤 Profile

- [x] Profile information display
- [x] Profile update
- [x] Password change
- [x] Account status display
- [x] Logout functionality
- [x] Responsive profile layout
- [x] Form validation
- [x] Loading states
- [x] Error handling

### 🎨 UI/UX

- [x] Consistent design system
- [x] Campusly color palette
- [x] Reusable components
- [x] Responsive desktop layout
- [x] Responsive tablet layout
- [x] Responsive mobile layout
- [x] Responsive sidebar
- [x] Mobile navigation
- [x] Responsive forms
- [x] Responsive cards
- [x] Responsive modals
- [x] Loading indicators
- [x] Empty states
- [x] Error states
- [x] Success notifications
- [x] Toast notifications
- [x] Semantic status colors

### 🔒 Security

- [x] Password hashing with bcrypt
- [x] JWT authentication
- [x] Protected backend routes
- [x] Authentication middleware
- [x] Environment variables for secrets
- [x] Groq API key kept server-side
- [x] `.env` excluded from Git
- [x] Client/server separation
- [x] Authenticated API requests

### 🗄️ Database

- [x] MongoDB Atlas integration
- [x] Mongoose configuration
- [x] User model
- [x] Attendance model
- [x] Assignment model
- [x] Task model
- [x] Event model
- [x] Announcement model
- [x] Database connection handling
- [x] Seed/sample data

### 🏗️ Backend

- [x] Node.js backend
- [x] Express.js server
- [x] REST API architecture
- [x] Route organization
- [x] Controller organization
- [x] Service layer
- [x] Authentication middleware
- [x] Error handling
- [x] Environment configuration
- [x] MongoDB integration
- [x] Groq AI integration

### 💻 Frontend

- [x] React.js application
- [x] Vite configuration
- [x] React Router
- [x] Context API
- [x] Axios API integration
- [x] Reusable components
- [x] Page-based architecture
- [x] Layout system
- [x] Loading states
- [x] Error states
- [x] Empty states
- [x] Toast notifications
- [x] Responsive styling

### 📱 Responsive Testing

- [x] Desktop navigation
- [x] Tablet navigation
- [x] Mobile navigation
- [x] Sidebar open/close behavior
- [x] Dashboard responsiveness
- [x] Attendance responsiveness
- [x] Assignment responsiveness
- [x] Task responsiveness
- [x] Events responsiveness
- [x] Announcements responsiveness
- [x] AI assistant responsiveness
- [x] Profile responsiveness
- [x] Mobile forms
- [x] Mobile modals

### 🚀 Deployment Readiness

- [x] Frontend production build configuration
- [x] Backend production configuration
- [x] Environment variable configuration
- [x] MongoDB Atlas configuration
- [x] Frontend deployment readiness for Vercel
- [x] Backend deployment readiness for Render
- [x] CORS configuration
- [x] Production API configuration
- [x] Git repository configuration
- [x] `.gitignore` configuration

### 📖 Documentation

- [x] Project overview
- [x] Feature documentation
- [x] Tech stack documentation
- [x] Project structure
- [x] Application architecture
- [x] Authentication architecture
- [x] AI architecture
- [x] Installation instructions
- [x] Environment variable documentation
- [x] API module documentation
- [x] Design system documentation
- [x] Deployment instructions
- [x] Security considerations
- [x] Future improvements
- [x] Hackathon information
- [x] Team information

### 🏆 Final Project Status

- [x] Core functionality completed
- [x] Frontend completed
- [x] Backend completed
- [x] Database integration completed
- [x] Authentication completed
- [x] AI integration completed
- [x] Responsive UI completed
- [x] Error and loading states implemented
- [x] Design system implemented
- [x] README documentation completed

---

## 🔒 Security Considerations

Campusly follows several security practices:

- Passwords are hashed using `bcrypt`
- JWT authentication protects private resources
- Authentication middleware validates protected requests
- API keys are stored in environment variables
- Groq credentials remain on the backend
- Environment files are excluded from Git
- Backend validates authenticated requests
- Client and server responsibilities are separated

---

## 🏆 Hackathon

**Pixels to Products — Cloudinary AI Hackathon 2026**

Campusly was developed as a student-focused productivity and campus management solution combining:

- Modern React development
- Full-stack REST APIs
- Secure authentication
- MongoDB
- AI integration
- Responsive UI/UX
- Real-world student productivity workflows

The project focuses on turning a common student problem into a practical, scalable digital product.

---

## 👨‍💻 Team

### JUST_us

Team Members:

- **Piyush Bachani**
- **Akshat Maheshwari**

Hackathon team repository: `https://github.com/HackIndiaXYZ/pixels-to-products-cloudinary-ai-hackathon-2026-justus`

---

## 📄 License

This project was created for the **Pixels to Products / Cloudinary AI Hackathon 2026**.

All rights reserved unless otherwise specified by the project owners.