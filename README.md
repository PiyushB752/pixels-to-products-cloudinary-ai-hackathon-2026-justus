# Campusly

> Smart Campus & Student Productivity Platform

Campusly is a full-stack web application designed to bring essential academic and campus activities into one centralized platform. It helps students manage attendance, assignments, tasks, events, announcements, profile information, and AI-powered assistance from a single dashboard.

Built for the **Pixels to Products / Cloudinary AI Hackathon 2026**.

---

## 🚀 Overview

Students often use multiple platforms to track attendance, assignments, deadlines, events, announcements, and other academic activities. This makes it difficult to stay organized and quickly find important information.

**Campusly** solves this problem by providing a unified student productivity platform where users can:

* Track attendance
* Manage assignments
* Organize personal tasks
* Discover and register for campus events
* Stay updated with announcements
* Get assistance from an AI-powered campus assistant
* Manage their profile and account
* View important academic information from one dashboard

The goal is to make everyday campus life more organized, accessible, and productive.

---

## ✨ Features

### 🔐 Authentication

* User registration
* User login
* JWT-based authentication
* Protected routes
* User profile
* Profile information update
* Change password
* Logout functionality

### 📊 Dashboard

The dashboard provides a quick overview of the student's academic and campus activities.

It includes:

* Attendance overview
* Pending assignments
* Task summary
* Upcoming events
* Recent announcements
* Quick access to important sections
* Loading, empty, and error states

### 📚 Attendance Management

Students can:

* View attendance records
* Track attendance percentage
* View subject-wise attendance
* Identify subjects requiring attention
* Add attendance records
* Update attendance records
* Delete attendance records

Attendance indicators use semantic status colors to make important information easy to understand.

### 📝 Assignment Management

Students can:

* View assignments
* Filter assignments by status
* Create assignments
* Update assignments
* Delete assignments
* Track due dates
* Mark assignments as completed
* Track assignment progress

### ✅ Task Management

Campusly includes a personal task management system where students can:

* Create tasks
* Edit tasks
* Delete tasks
* Mark tasks as completed
* Filter tasks
* Set task priorities
* Track due dates

Task priorities include:

* High
* Medium
* Low

### 📅 Campus Events

Students can:

* Browse campus events
* Filter events by type
* View event details
* Register for events
* Unregister from events
* Track registered events

### 📢 Announcements

Students can stay updated with important campus information through announcements.

Features include:

* Announcement listing
* Search
* Category filtering
* Academic updates
* Event announcements
* Assignment announcements
* Examination announcements

### 🤖 AI Campus Assistant

Campusly includes an AI-powered assistant using the **Groq API**.

Students can use the assistant to:

* Ask questions
* Get academic guidance
* Get help understanding campus-related information
* Receive productivity suggestions
* Interact through a conversational chat interface
* Use suggested prompts

The Groq API is accessed from the backend so API credentials are never exposed to the frontend.

### 👤 Profile Management

Users can:

* View their profile
* Update their name and email
* Upload a profile picture
* Change their profile picture
* Remove their profile picture
* Change their password
* View account status
* Logout

Profile pictures are stored using **Cloudinary**, while the user's Cloudinary image information is maintained in MongoDB.

### 📱 Responsive Design

Campusly is designed to work across:

* Desktop
* Tablet
* Mobile

The application includes responsive navigation, mobile sidebar controls, adaptive layouts, and mobile-friendly forms and cards.

---

## ☁️ Cloudinary Integration

Campusly uses **Cloudinary specifically for profile picture management**.

Cloudinary is not used as general application storage.

### Profile Picture Flow

```text
User selects image
       │
       ▼
React Profile Page
       │
       │ multipart/form-data
       ▼
Express API
       │
       ▼
Multer validation
       │
       ▼
Cloudinary
       │
       ├── Store profile image
       └── Return secure image URL
       │
       ▼
MongoDB User document
       │
       ├── avatar URL
       └── avatarPublicId
       │
       ▼
Campusly Profile / Navbar
```

### Profile Picture Rules

* Supported formats: JPG, PNG, WebP
* Maximum file size: 5 MB
* Images are uploaded through the backend
* Cloudinary credentials never reach the frontend
* Images are stored under the `campusly/profile-pictures` folder
* Each user has a stable Cloudinary public ID
* Changing a picture replaces the user's previous Cloudinary asset
* Removing a picture deletes the Cloudinary asset
* The secure Cloudinary image URL is stored in MongoDB

### Profile Picture APIs

```text
POST   /api/auth/profile/avatar
DELETE /api/auth/profile/avatar
```

Both endpoints require JWT authentication.

The upload endpoint accepts the image as a multipart form field named:

```text
avatar
```

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* Vite
* React Router
* Axios
* Context API
* Lucide React
* Recharts
* React Hot Toast
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Multer
* REST APIs

### AI

* Groq API

### Cloud Storage

* Cloudinary

Cloudinary is used specifically for profile picture storage and management.

### Database

* MongoDB Atlas

### Development Tools

* Git
* GitHub
* VS Code
* npm

### Deployment

* Vercel — Frontend
* Render — Backend
* MongoDB Atlas — Database
* Cloudinary — Profile image storage

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
│   │   ├── db.js
│   │   └── cloudinary.js
│   │
│   ├── controllers/
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── avatarUpload.js
│   │
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── .env
│
├── .gitignore
└── README.md
```

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
                        │  Node.js / Express  │
                        │       Backend       │
                        └───────┬───────┬─────┘
                                │       │
                        Mongoose│       │AI Service
                                │       │
                                ▼       ▼
                         ┌──────────┐ ┌──────────┐
                         │ MongoDB  │ │  Groq AI │
                         │  Atlas   │ │   API    │
                         └──────────┘ └──────────┘
                                │
                                │ Profile Images
                                ▼
                         ┌──────────────┐
                         │  Cloudinary  │
                         └──────────────┘
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

### Profile Picture Flow

```text
Profile Page
  ↓
Select Image
  ↓
Axios Multipart Request
  ↓
Express
  ↓
Multer
  ↓
Cloudinary
  ↓
MongoDB
  ↓
Updated User
  ↓
Profile + Navbar
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

The Groq API key is stored in backend environment variables and is never exposed directly to the client.

This architecture keeps the AI integration separate from the frontend and allows the backend to control API access and error handling.

---

## ⚙️ Installation

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* MongoDB Atlas account
* Groq API key
* Cloudinary account
* Git

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
PORT=port_number

MONGO_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_jwt_secret

GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=your_groq_model

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

CLIENT_URL=your_client_url
```

### Environment Variable Description

| Variable                | Description                                         |
| ----------------------- | --------------------------------------------------- |
| `PORT`                  | Port used by the Express backend                    |
| `MONGO_URI`             | MongoDB Atlas connection string                     |
| `JWT_SECRET`            | Secret used to sign and verify JWTs                 |
| `GROQ_API_KEY`          | API key used by the AI assistant                    |
| `GROQ_MODEL`            | Groq model used by the AI service                   |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary product environment cloud name           |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                                  |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                               |
| `CLIENT_URL`            | Frontend URL used by the backend CORS configuration |

---

## ▶️ Running the Project

### Start the Backend

```bash
cd server
npm run dev
```

### Start the Frontend

In another terminal:

```bash
cd client
npm run dev
```

---

## 🌐 API Modules

Campusly uses REST APIs to connect the frontend with the backend.

### Health

```text
GET /api/health
```

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
PUT  /api/auth/profile
POST /api/auth/profile/avatar
DELETE /api/auth/profile/avatar
PUT  /api/auth/change-password
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
POST /api/ai/chat
```

---

## 🎨 Design System

Campusly uses a warm, modern visual identity based on the following palette:

| Color              | Hex       | Usage                          |
| ------------------ | --------- | ------------------------------ |
| Reptile Revenge    | `#595C27` | Primary actions and navigation |
| Olivia             | `#9F601E` | Secondary elements             |
| Coral Kiss         | `#FFDDC8` | Accent and highlights          |
| Close but No Cigar | `#341600` | Sidebar and primary dark text  |
| Milk Chocolate     | `#7A521E` | Supporting elements            |

Semantic colors are also used for application states:

* **Success** — completed and positive states
* **Warning** — attention-required states
* **Danger** — destructive and error states
* **Info** — informational states

The design system is implemented through reusable CSS variables to maintain visual consistency across the application.

---

## 📊 Core Modules

| Module         | Purpose                                 |
| -------------- | --------------------------------------- |
| Dashboard      | Central overview of student activity    |
| Attendance     | Subject and attendance tracking         |
| Assignments    | Academic assignment management          |
| Tasks          | Personal productivity and task tracking |
| Events         | Campus event discovery and registration |
| Announcements  | Campus and academic updates             |
| AI Assistant   | AI-powered student assistance           |
| Profile        | Account and profile management          |
| Authentication | Secure user access                      |

---

## 🧪 Project Completion Checklist

### 🔐 Authentication

* [x] User registration
* [x] User login
* [x] JWT-based authentication
* [x] Protected routes
* [x] Invalid credential handling
* [x] User profile
* [x] Profile update
* [x] Password change
* [x] Logout functionality

### 📊 Dashboard

* [x] Dashboard overview
* [x] Attendance statistics
* [x] Pending assignment summary
* [x] Task summary
* [x] Upcoming events
* [x] Recent announcements
* [x] Quick-access navigation
* [x] Loading states
* [x] Empty states
* [x] Error states

### 📚 Attendance

* [x] Attendance records
* [x] Subject-wise attendance
* [x] Attendance percentage calculation
* [x] Add attendance record
* [x] Update attendance record
* [x] Delete attendance record
* [x] Attendance status indicators
* [x] Loading states
* [x] Empty states
* [x] Error handling

### 📝 Assignments

* [x] Assignment listing
* [x] Assignment creation
* [x] Assignment editing
* [x] Assignment deletion
* [x] Assignment status filtering
* [x] Assignment progress tracking
* [x] Due-date tracking
* [x] Assignment completion
* [x] Loading states
* [x] Empty states
* [x] Error handling

### ✅ Tasks

* [x] Task listing
* [x] Task creation
* [x] Task editing
* [x] Task deletion
* [x] Task completion
* [x] Task filtering
* [x] Task priorities
* [x] Due-date tracking
* [x] Task summary
* [x] Loading states
* [x] Empty states
* [x] Error handling

### 📅 Campus Events

* [x] Event listing
* [x] Event details
* [x] Event type filtering
* [x] Event registration
* [x] Event unregistration
* [x] Registered-event tracking
* [x] Event creation
* [x] Event editing
* [x] Event deletion
* [x] Loading states
* [x] Empty states
* [x] Error handling

### 📢 Announcements

* [x] Announcement listing
* [x] Announcement creation
* [x] Announcement deletion
* [x] Announcement search
* [x] Category filtering
* [x] Academic announcements
* [x] Assignment announcements
* [x] Examination announcements
* [x] Event announcements
* [x] Loading states
* [x] Empty states
* [x] Error handling

### 🤖 AI Campus Assistant

* [x] AI chat interface
* [x] Conversational interaction
* [x] Groq API integration
* [x] Backend AI service
* [x] Server-side API key protection
* [x] AI loading state
* [x] AI error handling
* [x] User and assistant message display
* [x] Suggested prompts

### 👤 Profile

* [x] Profile information display
* [x] Profile update
* [x] Profile picture upload
* [x] Profile picture change
* [x] Profile picture removal
* [x] Cloudinary profile image storage
* [x] Cloudinary profile image deletion
* [x] MongoDB avatar URL storage
* [x] Password change
* [x] Account status display
* [x] Logout functionality
* [x] Responsive profile layout
* [x] Form validation
* [x] Loading states
* [x] Error handling

### ☁️ Cloudinary

* [x] Cloudinary backend configuration
* [x] Secure server-side credentials
* [x] Profile image upload
* [x] Profile image replacement
* [x] Profile image deletion
* [x] File type validation
* [x] 5 MB file size validation
* [x] Stable per-user Cloudinary public ID
* [x] Secure Cloudinary image URLs

### 🎨 UI/UX

* [x] Consistent design system
* [x] Campusly color palette
* [x] Reusable components
* [x] Responsive desktop layout
* [x] Responsive tablet layout
* [x] Responsive mobile layout
* [x] Responsive sidebar
* [x] Mobile navigation
* [x] Responsive forms
* [x] Responsive cards
* [x] Responsive modals
* [x] Loading indicators
* [x] Empty states
* [x] Error states
* [x] Success notifications
* [x] Toast notifications
* [x] Semantic status colors

### 🔒 Security

* [x] Password hashing with bcrypt
* [x] JWT authentication
* [x] Protected backend routes
* [x] Authentication middleware
* [x] Environment variables for secrets
* [x] Groq API key kept server-side
* [x] Cloudinary credentials kept server-side
* [x] `.env` excluded from Git
* [x] Client/server separation
* [x] Authenticated API requests
* [x] Profile image validation

### 🗄️ Database

* [x] MongoDB Atlas integration
* [x] Mongoose configuration
* [x] User model
* [x] Attendance model
* [x] Assignment model
* [x] Task model
* [x] Event model
* [x] Announcement model
* [x] Avatar URL storage
* [x] Cloudinary public ID storage
* [x] Database connection handling
* [x] Seed/sample data

### 🏗️ Backend

* [x] Node.js backend
* [x] Express.js server
* [x] REST API architecture
* [x] Route organization
* [x] Controller organization
* [x] Service layer
* [x] Authentication middleware
* [x] Error handling
* [x] Environment configuration
* [x] MongoDB integration
* [x] Groq AI integration
* [x] Cloudinary integration
* [x] Multer file handling

### 💻 Frontend

* [x] React.js application
* [x] Vite configuration
* [x] React Router
* [x] Context API
* [x] Axios API integration
* [x] Reusable components
* [x] Page-based architecture
* [x] Layout system
* [x] Loading states
* [x] Error states
* [x] Empty states
* [x] Toast notifications
* [x] Responsive styling
* [x] Profile image management

### 📱 Responsive Testing

* [x] Desktop navigation
* [x] Tablet navigation
* [x] Mobile navigation
* [x] Sidebar open/close behavior
* [x] Dashboard responsiveness
* [x] Attendance responsiveness
* [x] Assignment responsiveness
* [x] Task responsiveness
* [x] Events responsiveness
* [x] Announcements responsiveness
* [x] AI assistant responsiveness
* [x] Profile responsiveness
* [x] Mobile forms
* [x] Mobile modals

### 🚀 Deployment Readiness

* [x] Frontend production build configuration
* [x] Backend production configuration
* [x] Environment variable configuration
* [x] MongoDB Atlas configuration
* [x] Cloudinary configuration
* [x] Frontend deployment configuration for Vercel
* [x] Backend deployment configuration for Render
* [x] CORS configuration
* [x] Production API configuration
* [x] Git repository configuration
* [x] `.gitignore` configuration

### 📖 Documentation

* [x] Project overview
* [x] Feature documentation
* [x] Tech stack documentation
* [x] Project structure
* [x] Application architecture
* [x] Authentication architecture
* [x] AI architecture
* [x] Cloudinary integration documentation
* [x] Installation instructions
* [x] Environment variable documentation
* [x] API documentation
* [x] Design system documentation
* [x] Security considerations
* [x] Hackathon information
* [x] Team information

---

## 🔒 Security Considerations

Campusly follows several security practices:

* Passwords are hashed using `bcrypt`
* JWT authentication protects private resources
* Authentication middleware validates protected requests
* API keys are stored in environment variables
* Groq credentials remain on the backend
* Cloudinary credentials remain on the backend
* Environment files are excluded from Git
* Backend validates authenticated requests
* Client and server responsibilities are separated
* Profile uploads are validated by file type and size
* Profile images are uploaded through the authenticated backend

---

## 🚀 Future Improvements

Potential future improvements include:

* Push notifications
* Calendar integration
* Advanced attendance analytics
* Assignment reminders
* Campus timetable management
* More personalized AI assistance
* Role-based access for faculty and administrators
* Additional campus services and integrations

These features are outside the current core scope and can be introduced incrementally.

---

## 🏆 Hackathon

**Pixels to Products — Cloudinary AI Hackathon 2026**

Campusly was developed as a student-focused productivity and campus management solution combining:

* Modern React development
* Full-stack REST APIs
* Secure authentication
* MongoDB
* AI integration
* Cloudinary profile image management
* Responsive UI/UX
* Real-world student productivity workflows

The project focuses on turning a common student problem into a practical, scalable digital product.

---

## 👨‍💻 Team

### JUST_us

Team Members:

* **Piyush Bachani**
* **Akshat Maheshwari**

Hackathon team repository:

```text
hackindia-team:pixels-to-products-cloudinary-ai-hackathon-2026-justus
```

---

## 📄 License

This project was created for the **Pixels to Products / Cloudinary AI Hackathon 2026**.

All rights reserved unless otherwise specified by the project owners.