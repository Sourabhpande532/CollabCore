# Workasana - Project & Task Management System

---

A MERN Stack **Workasana** project management system to manage projects, create and assign tasks, track progress, and organize teams efficiently with secure authentication.  
Built with a React frontend, Express/Node backend, MongoDB database, and JWT-based authentication.

---

## Demo Link

[Live Demo](https://collab-core-br21.vercel.app/)

---

## Quick Start

```
git clone https://github.com/Sourabhpande532/CollabCore.git
npm install
npm start

```

---

## Technologies

- React Js
- React Router
- Node Js
- Express Js
- MongoDB
- Mongoose
- JSON Web Token(JWT)
- bcrypt (Password Hashing)
- Bootstrap
- RESTful APIs

---

## Demo Video

Watch a walkthrough (5-7 minutes) of all major features of this app:

[Drive Video Link](https://drive.google.com/file/d/15QX55FIjWCMrOuBl7EyAmGk_tTM_3pjA/view?usp=sharing)

---

## Features

### Authentication & Authorization

**User Signup**

- Register with name, email, and password
- Password securely hashed using bcrypt
- Password securely hashed using bcrypt

**User Signin**

- Login using email and password
- Password verification using bcrypt
- JWT token issued upon successful login
- Token stored on frontend for authenticated requests

**Protected Routes**

- JWT middleware protects:
  - Project routes
  - Task routes
  - Team routes
- Only authenticated users can:
  - Create tasks
  - Update tasks
  - Delete tasks
  - Create project

**Logout**

- Token removed from frontend storage
- User redirected to login page

---

## Dashboard

- Overview of all projects and tasks
- Task insights by:
  - Status
  - Priority
  - Team
- Displays recently created tasks
- Summary statistics:
  - Total Tasks
  - Completed
  - In Progress
  - Blocked

---

## Project Management

- Create, view, update, and delete projects
- Search projects by name
- Sort projects (A-Z / Z-A / Newest)
- Click anywhere on project card to view details
- Clean and responsive card layout

---

## Task Management

- Create, view, update, and delete tasks
- Assign tasks to:
  - Project
  - Team
  - Owners
- Add:
  - Status
  - Priority
  - Due Date
  - Tags
- Click anywhere on task Card to view task details
- Responsive grid-based UI

---

## Task Filtering & Sorting

**Filtering By:**
`Status`, `Team`, `Owner`, `Project`

**Sorting by:**
`Name (A-Z/Z-A)`, `High - Medium - Low`, `Due Date`, `Newest / Oldest`

Ensured structured workflow tracking.

---

## Team Management

- Create and manage teams
- Assign tasks to teams
- View team-wise task organization

---

## Owner Assignment

- Assign one or multiple owners to tasks
- Populate owner details dynamically

---

## Notification & Responsive UI

- Toast notification for:
  - Success actions
  - Deletion Confirmation
  - Updates
- Responsive Design for:
  - Sidebar navigation system
  - Fully responsive design

---

## API Reference

### Authentication APIs

**POST /api/auth/signup**

Register new user.

Sample Response:

```
{

"user": {"_id": "id", "name":"User", "email":"user@gmail.com", "password":"hash8343**#$"}
}

```

**POST /api/auth/login**

Login existing user.

Sample Response:

```
{
    "token": "jwt_token",
    "user" : {
    "id":"id", "name": "User",
    "email": "user@email.com",
    "token": 'xyzerefdfghereredfd...'
     }
}

```

### Task APIs

**GET /api/tasks**

Retrieve tasks with filtering & sorting.
Query Parameter: `Status`,`team`, `owners`, `projectId`, `tags`, `sort`

Sample Response:

```
[
   {
    "_id": "id",
    "name": "Task Name",
    "status": "To Do",
    "priority": "High",
    "project": {},
    "team": {},
    "owners": [],
    "createdAt": "date"
  }
]

```

**GET /api/tasks/:id**
Fetch single task details

**POST /api/tasks**
Create new task (Protected).

**PUT /api/tasks/:id**
Update existing task (Protected).

**DELETE /api/tasks/:id**
Delete task (Protected).

---

### Project APIs

**GET /api/projects**
Retrieve all projects.

**POST /api/projects**
Create project (Protected).

**DELETE /api/projects/:id**
Delete project (Protected).

---

### Team APIs

**GET /api/teams**
Retrieve all teams.

**POST /api/teams**
Create team (Protected).

---

### Environment Setup

**Backend(/server/.env)**

```
# Server
PORT=4001
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/workasana

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d

# CORS
CLIENT_URL=http://localhost:3000

```

**Frontend(./src/api/)**

```
Base URL=http://localhost:4001/api

```

---

## Contact

For bugs or feature requests, please reach out to [sourabhpande43@gmail.com](mailto:sourabhpande43@gmail.com)

---
