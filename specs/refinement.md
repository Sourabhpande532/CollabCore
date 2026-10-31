# SPEC: CollabCore — Bug Hunt, UI Refinement, and Performance Fix

## 0. Inputs

### 0.1 Project name and type
```
CollabCore (MERN full-stack project)
```

### 0.2 Tech stack and how to run it
- **Stack:** MongoDB, Express, React, Node.js (MERN).
- **UI/UX:** HTML5 and CSS3. Use Tailwind CSS or Bootstrap only if it is really needed (see Section 6).
- **Run commands:** client: `npm start`. Server: `npm run dev`.
- **Note:** the app is already running, so it can be tested directly.

### 0.3 Task for this run
Raise CollabCore to a production-ready, market-standard, recruiter-ready level, without breaking anything that works today.

1. **Study the reference screens first.** Open the two reference PDFs in Section 0.5. See how clean, organised, and complete those screens are, and how every feature in the PRD / checklist / problem statement is presented. Build the CollabCore UI to that same standard (see Section 4.1).
2. **Fix the UI.** The project still has many UI bugs, and it lacks production quality, market standard, and professionalism. Use good, professional colors, remove anything that looks unprofessional, and fix every UI bug.
3. **Fix the slow data after login (see Section 4.2).**
4. **Find and fix all bugs across the whole project**, including theme visibility (dark and light), responsiveness, typos, and checklist verification.
5. **Test every feature and its functionality.** Nothing may be left: no console errors, no CORS errors on deployment, no responsiveness problems, no hidden-text or CSS issues, and no spacing or adjustment problems.

### 0.4 Checklist / PRD / Problem Statement
## Problem Statement

Your task is to build a MERN stack app called CollabCore.

CollabCore is a task management and team collaboration tool where users can create projects, assign tasks to teams and owners, set deadlines, and organize work using tags. It supports authentication, dynamic filtering, URL-based queries, and reporting features to track task progress and team productivity.

collabcore.project.spec

Frontend (React):
**Key Components:**

1.  Login:
    - Provides a form for users to log in to the application.
    - Fields:
      - Email : The user’s registered email.
      - Password : User’s password.
    - Validates the user credentials and stores a JWT token in localStorage upon successful login.
    - Displays error messages for invalid credentials.

2.  Signup:
    - Allows new users to register for the application.
      Fields: - Name : The user's full name. - Email : The email address for authentication. - Password : A secure password for the account.
    - Sends user details to the backend to create an account.
    - Displays appropriate success or error messages based on the response.

3.  Authentication Handling:
    - The app checks for a valid JWT token in localStorage to confirm if the user is logged in.
      collabcore.project.spec 2
    - Users are redirected to the login page if they attempt to access protected routes without authentication.
    - Logout functionality clears the token and redirects the user to the login
      page.

4.  TaskForm:

- A form to create a new task with fields:
  - Task Name
  - Project Name – Dropdown to select the project.
  - Owners (Team Members) – Multi-select dropdown for team members.
  - Team – Dropdown with teams fetched from the backend (Sales,
    Marketing, Development, Finance).
  - Tags – Multi-select tag system (e.g., "Urgent", "Bug").
  - Time to Complete (days) – Number input for estimated completion days.
  - Status – Dropdown with options: To Do , In Progress , Completed , Blocked .
- Submit button to add the task via API.

5.  TaskList:
    Displays a list of tasks with the following filter options:
    - Owner (team member)
    - Team
    - Tags
    - Project Name
    - Status – Filter tasks based on their current status (e.g., To Do , In Progress ).
    - URL-based filtering for tasks (e.g., /tasks?owner=Tanay , /tasks?
      team=development ).

    - Sorting options for task completion dates or priority.

6.  ProjectView:

    collabcore.project.spec 3
    - A view that groups tasks by project. Displays project name, associated tasks, and key task details.
    - Allows filtering within the project view (e.g., filter by tags or owner within a
      specific project).

7.  TeamView:
    - Similar to ProjectView , but tasks are grouped by teams (Sales, Marketing,Development, Finance).
    - Allows filtering within the team view, with the option to sort tasks by status or due dates.

8.  Reports and Visualization:
    - Total Work Done Last Week: A section showing completed tasks over the last week using bar charts or pie charts.
    - Total Days of Work Pending: A calculated sum of the remaining time to complete all tasks, visualized with a bar chart.
    - Tasks Closed by Team/Owner/Project: Show statistics of closed tasks using charts (e.g., tasks closed by each team, most productive owner, tasks closed by project).

    - Chart.js library will be used to create these visualizations.

9.  TaskDetails:

- Clicking a task shows detailed information, including:
  - Project name, team, owners, tags, time to complete, and current status (e.g., To Do , In Progress , Completed ).
- Options to update the status or modify task details.

10. Filtering:

- Implement URL-based filters such as:

  > /tasks?owner=Tanay
  > /tasks?team=development
  > /tasks?project=LaunchProject

  collabcore.project.spec 4
  Combine filters (e.g., /tasks?team=development&tags=Urgent ).
  The UI should update based on the URL, and filters should be accessible via query parameters.

  Backend (Express + MongoDB):
  API Endpoints:

1.  User Signup:
    Endpoint: POST /auth/signup

            Request Body:

        ` {

    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "securePassword123"
    }`

**Functionality:** - Registers a new user and hashes their password using bcrypt before storing it in the database. - Returns a success message or appropriate error if the email is already registered.

2.  User Login:
    Endpoint: POST /auth/login
    Request Body:
    `    {
"email": "john.doe@example.com",
"password": "securePassword123"
collabcore.project.spec 5
}`

**Functionality:** - Verifies user credentials and issues a JWT if valid. - Returns a token or an error message if the credentials are incorrect.

3.  Protected Routes:

- Middleware to validate the JWT token for protected routes.
- Ensures only authenticated users can perform actions like adding tasks or managing teams.

4.  User Details:
    Endpoint: GET /auth/me
    ** Functionality:**
    - Retrieves the details of the authenticated user based on the token.
    - Used to personalize the app (e.g., showing the user’s name or email).

5.  Tasks:
    POST /tasks : Create a new task.
    Request Body:
    `    {
"name": "Design Wireframes",
"project": "Website Redesign",
"team": "64c34512f7a60e36df44", // Team ID
"owners": ["UserID1", "UserID2"],
"tags": ["UI", "Urgent"],
"timeToComplete": 5,
"status": "To Do"
}`
    Response: 201 Created.
    collabcore.project.spec 6

                - GET /tasks : Fetch tasks with filtering.
                  - Supports query parameters: team , owner , tags , project , status .
                  - Example: /tasks?owner=Tanay&team=development&status=InProgress
                  - Response: List of filtered tasks.
                - POST /tasks/:id : Update a task (e.g., mark it as complete or update any
                other field).
                DELETE /tasks/:id : Delete a task.

6.  Teams:
    POST /teams : Add a new team.
    Request Body:
    `    {
"name": "Customer Support",
"description": "Handles customer queries and issue
s"
}`
    GET /teams : Fetch a list of teams.
    Response: List of team objects.

7.  Projects:
    POST /projects : Add a new project.
    Request Body:
    `    {
"name": "Mobile App Launch",
"description": "Launch the new mobile app in Q3"
}`
    GET /projects : Fetch all projects.
    Response: List of projects.
    collabcore.project.spec 7

8.  Tags:
    Tags will function as labels to categorize tasks. Each task can have multiple
    tags, which helps in grouping tasks by topic, priority, or status. Users can
    create, assign, and filter tasks using these tags. Tags are customizable and
    allow for easier task management and quick retrieval of related tasks based on
    specific criteria, enhancing task visibility and workflow efficiency.

    POST /tags : Add new tags.
    GET /tags : Fetch all tags.

9.  Reporting:
    - Reports can be generated by querying the data and using JavaScript
      functions (e.g., reduce ) to calculate and aggregate relevant statistics.
      Some key reports include:
      - GET /report/last-week : Fetch tasks completed in the last week. This can
        be calculated by querying tasks where the status is Completed and comparing the updatedAt field to the current date minus 7 days.
      - GET /report/pending : Fetch total days of work pending for all tasks. This
        can be calculated by summing the timeToComplete field of tasks that are
        not marked Completed .
      - GET /report/closed-tasks : Fetch the number of tasks closed by team,
        owner, or project. This can be calculated by grouping tasks by the
        team , owner , or project and counting the tasks that have status:Completed .
    - Response: Aggregated data for visualizations.

**Key Features to Include:**

1. JWT Authentication:

- JWT tokens are issued upon login and used for all subsequent requests to
  authenticate users.
- Appropriate error responses are provided for cases like invalid login
- credentials or missing tokens.
  collabcore.project.spec 8
  Only authenticated users can access protected API endpoints.

2. URL-based filtering:
   Filters for tags, team, owner, and project will be reflected in the URL for
   easy navigation and sharing of task views.
   Filters can be combined, for example: /tasks?team=development&owner=Tanay .
3. Reports and Visualisations:
   - Use Chart.js for visualizing task progress and report data.
   - Example visualizations include:
   - Total work completed last week (bar chart).
   - Tasks closed by each team (pie chart).
   - Pending work across projects (bar chart).

**Tech Stack Summary:**

- Frontend: React, React Router for URL-based filtering, axios for API calls,
- Chart.js for visualisations.
  Backend: Express.js with RESTful APIs, Mongoose for database interactions
  with MongoDB.
- **Database:** MongoDB with models for tasks, teams, projects, and users.

If in case you would not able to understand this checklist here below is link of this specs open and read it.
https://files.cdn.thinkific.com/file_uploads/887743/attachments/fac/a29/853/collabcore.project.spec.pdf

2nd Checklist
collabcore.mongoose.models

1. Task Model
   The Task model stores information about each task, including references to the
   Team, Project, and Owners (Users) models. Tasks also include metadata like tags
   and time to complete.

`const mongoose = require('mongoose');
// Task Schema
const taskSchema = new mongoose.Schema({
 name: { type: String, required: true },
 project: { type: mongoose.Schema.Types.ObjectId, ref: 'Proj
ect', required: true }, // Refers to Project model
 team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team',
required: true }, // Refers to Team model
 owners: [
 { type: mongoose.Schema.Types.ObjectId, ref: 'User', requ
ired: true } // Refers to User model (owners)
 ],
 tags: [{ type: String }], // Array of tags
 timeToComplete: { type: Number, required: true }, // Numbe
r of days to complete the task
 status: {
 type: String,
 enum: ['To Do', 'In Progress', 'Completed', 'Blocked'],
// Enum for task status
 default: 'To Do'
 }, // Task status
 createdAt: { type: Date, default: Date.now },
 updatedAt: { type: Date, default: Date.now }
collabcore.mongoose.models 2
});
// Automatically update the `updatedAt` field whenever the do
cument is updated
taskSchema.pre('save', function (next) {
 this.updatedAt = Date.now();
 next();
});
module.exports = mongoose.model('Task', taskSchema);`

2. Team Model
   The Team model is now stored separately to allow for dynamic team management.
   This schema supports creating, updating, and referencing teams.

`const mongoose = require('mongoose');
// Team Schema
const teamSchema = new mongoose.Schema({
 name: { type: String, required: true, unique: true }, // T
eam names must be unique
 description: { type: String } // Optional description for
the team
});
module.exports = mongoose.model('Team', teamSchema);`

3. Project Model
   The Project model helps categorize tasks under various projects. Projects can
   have a name and description, with the option to extend later if needed.

`const mongoose = require('mongoose');
collabcore.mongoose.models 3
// Project Schema
const projectSchema = new mongoose.Schema({
 name: { type: String, required: true, unique: true }, // P
roject names must be unique
 description: { type: String }, // Optional field for proje
ct details
 createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Project', projectSchema);`

4. User Model (Owner)
   The User model represents the team members or owners who are responsible for
   tasks. Each task will reference the user(s) responsible for completing it.

`const mongoose = require('mongoose');
// User Schema
const userSchema = new mongoose.Schema({
 name: { type: String, required: true }, // User's name
 email: { type: String, required: true, unique: true } // E
mail must be unique
});
module.exports = mongoose.model('User', userSchema);`

5. Tag Model
   The Tag model stores predefined or dynamically created tags, which are assigned
   to tasks for easy categorisation and filtering.

`const mongoose = require('mongoose');
// Tag Schema
collabcore.mongoose.models 4
const tagSchema = new mongoose.Schema({
 name: { type: String, required: true, unique: true } // Ta
g names must be unique
});
module.exports = mongoose.model('Tag', tagSchema);`

Some Example Database Relationships:

1. Task-to-Project: Each task references a Project using project: { type:
   mongoose.Schema.Types.ObjectId, ref: 'Project' } .
2. Task-to-Team: Each task references a Team using team: { type:
   mongoose.Schema.Types.ObjectId, ref: 'Team' } .
3. Task-to-Owners (Users): Each task references one or more Users (owners)
   using owners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] .
4. Task-to-Tags: Tasks can have multiple tags, stored as an array of strings,
   allowing for easy filtering.

Model Usage Example:
Create a New Team:
const Team = require('./models/Team');
const newTeam = new Team({
name: 'Support',
description: 'Handles customer support issues'
});
newTeam.save().then(team => console.log(team)).catch(err =

> console.log(err));

Create a New Task:
collabcore.mongoose.models 5

`const Task = require('./models/Task');
const newTask = new Task({
name: 'Resolve support tickets',
project: '64c34512f7a60e36df44', // Reference to a Pro
ject ID
team: '64c99a47b74e58d3b213', // Reference to a Tea
m ID
owners: ['64f5826ac278d930b214'], // Array of User IDs
(owners)
tags: ['Support', 'Urgent'],
timeToComplete: 2
});
newTask.save().then(task => console.log(task)).catch(err =

> console.log(err));`

Benefits of This Design:
Flexibility: You can dynamically add and manage teams, users, projects, and
tasks without modifying the schema.
Referential Integrity: Using ObjectId references ensures data consistency
between tasks and their associated teams, projects, and owners.
Scalability: The models are designed to scale, so you can easily extend them
with additional fields and functionality (e.g., adding roles to users, adding
priority levels to tasks).

for cleare more: https://files.cdn.thinkific.com/file_uploads/887743/attachments/3f5/978/4d7/collabcore.mongoose.models.pdf

3rd checklist

- read properly for testing & varify ensure all should work and all checklist featured covered.
- every missing checklist point should be cover.

---

# Guidelines

This project will be evaluated based on the following criteria. Ensure the implementation satisfies each of them.

- Clean code and proper project structure.
- Good engineering decisions.
- Complete implementation of all required features.
- Clear and professional project walkthrough.
- Well-organized code and project presentation.
- Timely completion.
- All required features implemented successfully.

---

## Evaluation Checklist

The reviewer will evaluate the project based on the following questions:

- Does the application work correctly?
- Is the code clean, readable, and maintainable?
- Is the project structure well organized?
- Can the implementation be explained clearly during an interview?
- Does the project satisfy all required features?
- Is the submission complete and production-ready?

Build the project keeping all of these evaluation points in mind.
---

# Development Rules

Before implementing any feature:

- Read and understand the complete problem statement closely.
- Read this specs carefully what I want exactly thourily
- Prioritize core features first, then implement additional requirements incrementally.
- Follow a human-friendly coding style that reflects my learning and understanding.
- Avoid code that looks auto-generated or unnecessarily complex.
- Implement every feature according to the problem statement.
- Write clean, understandable code that is easy to explain during interviews.

---




## 1. Type and Intent
- **Type:** Audit, Bug Fix, UI Refinement to market standard, and Performance Fix. This is **not** a rebuild: the project works, and everything that works today must keep working exactly the same.
- **Goal:** Raise the project to a standard where a recruiter sees a real, well-built product and not a "kaam chalau" (just-working) student project.
- **Why (mentor feedback):**
  1. The projects do not stand out in the market, and recruiters compare them with existing products.
  2. Basic mistakes must be reviewed before the final submission: errors, edge cases, UI/UX, spelling, grammar, and missing checklist and PRD functionality.
  3. After multiple rounds of review and feedback, the projects were still not as per the checklist.
  4. The core concepts must be revised again, especially **full-stack flows, APIs, validation, authentication, and frontend responsiveness**.
  5. This is the last review before placement interviews, so quality matters in every detail.

## 2. Scope Lock
1. Work only on the task in Section 0.3 and on verifying Section 0.4. The task says "whole project", so the whole project is in scope.
2. **The UI layer may be substantially refined and restyled**, because the task requires a market-standard UI. Layouts, colors, and components may change. Functionality, routes, and data flow must not.
3. Backend, API, and authentication code may be changed **only** to fix a confirmed bug or the login-speed issue, with the smallest possible change.
4. Do not touch anything outside the scope. If something outside looks wrong, list it under "Observations (not changed)".
5. If a fix might affect a protected item (Section 3), stop and ask first. If anything is unclear, ask. Do not guess.

## 3. Protected Items (must stay exactly the same)
- **Authentication and authorization:** I implemented it and it works. Do **not** remove, replace, or rewrite it. Test and verify it (register, login, logout, token or session expiry, protected routes, role access, wrong password, duplicate account, refresh while logged in). If a real bug is found, report it and fix it with the smallest possible change.
- All API endpoints: paths, methods, request and response shapes used by the frontend, and status codes (already tested in Postman).
- All frontend routes and URLs.
- All `.env` variable names and values.
- All business logic, validation rules, database schemas, and existing data.
- Every feature that works today.
- Existing dependencies, unless strictly needed (flag first).

## 4. Special Focus Areas for This Run

### 4.1 Reference alignment (UI quality)
1. Open both reference PDFs and list every screen and feature they show.
2. Compare that list with CollabCore and with the PRD / checklist / problem statement. Mark each feature ✅ present, ⚠️ present but weak, or ❌ missing.
3. Bring the CollabCore UI to the same level of cleanliness, organisation, and completeness: clear layout, consistent spacing and typography, well-structured cards, tables, forms, and dashboards, meaningful empty and loading states, and a professional, soft color palette.
4. Use the references for quality and structure only. Do not copy their branding, assets, or text. The result must be original and human-designed, not generic or AI-generated.
5. Build any missing feature inside the existing architecture, using the existing patterns.

### 4.2 Slow data after login (investigate and fix)
**Symptom:** right after a fresh login, the data takes too long to appear. If the user is already logged in (for example, comes back after 8 hours and the session is still valid), the data appears very fast.

1. Reproduce it and measure it: record the time from the login click to the data on screen, using the browser Network tab and server logs. Do the same for the "already logged in" case.
2. Find the root cause by comparing the two flows. Check, for example: requests that wait for each other one by one, the login response being slow (such as password hashing cost or heavy work on the server), too many or heavy API calls right after login, duplicate or repeated fetches, large responses, missing pagination, slow or unindexed database queries, a slow server start (cold start), state or token being set late so that the first data fetch runs late or runs twice, missing loading and skeleton states that make the wait feel longer, and extra CORS preflight requests.
3. Fix the real cause with the smallest safe change. Run independent requests in parallel, fetch only what the first screen needs, avoid duplicate calls, and show clear loading states.
4. Do **not** change the authentication logic, endpoints, or token behavior. Do not make login less secure to make it faster.
5. Report the cause, the fix, and the before and after timings.

### 4.3 Deployment readiness
- Test with the production build. If deployed links are provided in Section 0.6, test those too.
- No CORS errors and no console errors in production. CORS stays restricted to the configured origins (no wildcard shortcut). Do not rename or change any `.env` variable.

### 4.4 Core concepts re-verification
Re-verify these areas against the checklist, and fix real problems:
- **Full-stack flows:** UI → state → API → database → response → UI, for every feature.
- **APIs:** consistent responses, proper status codes, and clear error messages.
- **Validation:** present on both the frontend and the backend.
- **Authentication:** works as described in Section 3.
- **Job status handling:** statuses and status changes are saved correctly, shown correctly everywhere, and handle invalid changes properly.
- **Frontend responsiveness:** see Section 5.3.

## 5. Phase 1: Test and Find Bugs (no code changes in this phase)
Run the frontend and backend and test everything thoroughly. Produce a **Bug Log** with: ID, page or file, description, severity (high / medium / low), and steps to reproduce.

### 5.1 Checklist verification
- Test every point in Section 0.4 and mark it ✅ working, ⚠️ partial or buggy, ❌ missing.
- Test each feature end to end: UI → API → database → response → UI.

### 5.2 Dark and light theme audit
Check **every page, component, and state** in **both** themes. Some text may be hidden in one theme and visible in the other, so find all of it.
- Text and background contrast: every piece of text must be readable (aim for WCAG AA, 4.5:1 for normal text).
- Hardcoded colors (`#000`, `#fff`, fixed grays) that ignore the theme.
- Placeholders, labels, helper text, error text, disabled text, links, and badges.
- Inputs, selects and dropdown options, checkboxes, radios, date pickers, and autofill color.
- Modals, drawers, popovers, tooltips, toasts, alerts, tables, cards, tabs, pagination, empty states, and skeleton loaders.
- Icons and SVGs with a fixed fill, logos and images that disappear on one background, and charts with their labels.
- Borders, dividers, shadows, and hover, focus, and active states.
- Theme persistence after refresh, no flash of the wrong theme on load, and behavior with the system theme setting if supported.

### 5.3 Responsiveness audit
Test at widths 320, 360, 375, 390, 414, 600, 768, 820, 1024, 1280, 1440, and 1920 px, plus mobile landscape and browser zoom up to 200%.
- Check margin, padding, gap, and height problems, text cut off or overlapping, horizontal scroll, overflow, wrong font size or weight, misalignment, broken images, tables on small screens, sticky header or footer overlap, small tap targets, modal sizing, and mobile keyboard overlap on forms.
- Navbar, sidebar, menus, forms, cards, lists, and every page must behave correctly on desktop, tablet, and all mobile sizes.

### 5.4 Text, spelling, and grammar
Check all visible text: headings, labels, buttons, placeholders, toasts, error messages, empty states, page titles, alt text, and the 404 page. Also check file and variable names, comments, and the README. Error messages must be clear and human, with no raw errors, stack traces, or "undefined" shown.

### 5.5 Functionality and edge cases
Empty states, invalid input, very long input, duplicate actions, double clicks, expired session, network failure, slow network, deleted or missing data, browser back and forward buttons, refresh in the middle of a flow, and invalid URLs.

### 5.6 Console, network, and security
- Browser console: zero errors and zero meaningful warnings. Network tab: no failed requests and no CORS errors. Server console: no errors.
- API responses must not expose sensitive data (password hashes, tokens, other users' private data, internal fields). Remove such fields **without** removing anything the frontend uses and **without** changing endpoints.
- No secrets in frontend code or git. `.env` ignored by git, and `.env.example` with names only.
- Backend input validation and route authorization are in place.

### 5.7 Performance
Find real bottlenecks only: unnecessary re-renders, heavy repeated calculations, large lists, N+1 queries, large images, and large bundles. The login-speed issue is covered in Section 4.2.

### 5.8 Structure and naming
Review the folder structure and file names. Note what is messy or unclear.

## 6. Phase 2: Fix and Refine
- Fix bugs in order of severity. Make small, safe steps and re-test after each fix.
- **Styling:** use HTML5 and CSS3 with the project's existing styling approach. Add Tailwind CSS or Bootstrap only if it is really needed, flag it first, and migrate page by page. Never leave two styling systems conflicting.
- **Theme and CSS fixes:** prefer fixing the root cause (theme variables or design tokens) instead of patching one element at a time.
- **Performance:** use `useMemo`, `useCallback`, `React.memo`, closures, currying, debounce and throttle, lazy loading, pagination, and proper keys only where a real bottleneck exists. Do not add them everywhere. The behavior and output must stay the same.
- **Structure:** if the folder structure is messy, improve it safely with clear folders (components, pages, hooks, services or api, utils, routes, controllers, models, middleware, config) and meaningful file and function names (no `test1`, `final2`, `temp`). When moving or renaming, update every import, run the build, and confirm it passes. Never rename anything that changes an API path, URL, or env variable. Delete only files that are clearly unused.
- **Writing and code quality:** all text must be correct, natural English with no typos. The code must look human-written: short focused functions, meaningful names, and comments only where they explain why. No AI-style filler, no lorem ipsum, no leftover `console.log`, TODOs, or commented-out code.

## 7. Browser Testing and Evidence (required)
- Test in a real browser if the agent can run one (for example browser automation or a browser tool). Test both themes and the screen sizes in Section 5.3. Capture before and after screenshots for every UI fix.
- Test the whole auth flow and all checklist features in the browser, and check the console and network tab during the test.
- If the agent cannot run a browser, it must say so clearly, do a careful code-level review of theme and layout, and give me a short manual test list for the parts it could not verify. It must never claim something was tested when it was not.

## 8. Final Verification
1. Re-run every checklist point in the browser.
2. Test all API endpoints (Postman or equivalent) and confirm that paths and results are unchanged.
3. Re-check both themes on every page and every state.
4. Re-check all screen sizes.
5. Re-check console, network, and CORS, including the production build.
6. Re-measure the login-to-data time and compare it with the earlier measurement.
7. Run a spelling and grammar pass.
8. Run the production build with no errors or new warnings.
9. Review the diff: only task-related changes, and no protected item changed (especially auth, endpoints, URLs, env).

## 9. Acceptance Criteria
- [ ] Every checklist point is verified and working, and every gap is fixed or clearly reported.
- [ ] The UI matches the cleanliness, organisation, and completeness of the reference screens, and it is original, not copied.
- [ ] Data after a fresh login appears quickly, and the root cause is explained.
- [ ] Authentication still works exactly as before.
- [ ] All text is visible and readable in both dark and light themes on every page and state.
- [ ] No layout, spacing, font, or overflow issues on desktop, tablet, and mobile.
- [ ] No spelling, grammar, or typo mistakes anywhere.
- [ ] No console errors, no CORS errors (including production), and no failed requests.
- [ ] No sensitive data exposure.
- [ ] No regression: everything that worked before works the same now.
- [ ] No endpoint, URL, or `.env` variable changed.
- [ ] The folder structure is clean, names are meaningful, and the build passes.
- [ ] Evidence (screenshots or test notes) is provided for the fixes.

## 10. Final Report Format
1. **Bug Log:** ID, page, problem, severity, fix, files changed, status.
2. **Checklist result:** each point with its final status.
3. **Reference comparison:** what was missing or weak compared to the reference screens, and what was improved.
4. **Login-speed analysis:** root cause, fix, and before and after timings.
5. **Theme and responsiveness results:** what was found and fixed, with before and after evidence.
6. **Verification done:** what was tested in the browser and what was not.
7. **Observations (not changed):** issues noticed outside the scope.
8. **Talking points:** 5 to 6 simple points I can use to explain the improvements in an interview.

## 11. Out of Scope
- Anything outside Section 0.3. No rebuild, no new tech stack, no endpoint changes, no authentication replacement, and no database change.

---
### Execution order for the agent
Read Section 0 fully → study both reference PDFs and the PRD → run the project → test everything and measure the login-to-data time → build the Bug Log (Phase 1) → fix in small safe steps (Phase 2) → verify after every fix → full verification (Section 8) → final report. Stop and ask whenever a change might touch a protected item.