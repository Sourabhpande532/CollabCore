# SPEC: Bug Hunt and Refinement of an Existing Full-Stack Project (Reusable Template)


### 0.1 Project name and type
```
[ PROJECT NAME: CollabCore]

```

### 0.2 Tech stack and how to run it
```
```
for UI/UX: HTML5 CSS3, if case Tailwaind CSS, or if case(Bootstrap) 
and this is MERN project hope you know what tech stack should be use
```
for client: npm start 
for server: npm run deve
Note: it is already started so you can test
```

### 0.3 Task for this run
link for build this project UI and 
1) https://files.cdn.thinkific.com/file_uploads/887743/attachments/f82/583/532/workasana.screens.pdf
2) https://files.cdn.thinkific.com/file_uploads/887743/attachments/559/b85/db3/workasana.screens_%28more_sample%29.pdf 


this project still have lot of UI bugs not marketed ready lack in production lack in marketet, lack in profetionalism fix this i provide you two links above there project align images are present see how they build clean and organised way open two above links notice how they look clean and completed all featue mention in PRD/checklist/PS and build this project UI accordingly it should be market stand it should be recruiter perspective i am sent more refer to you see 0.7 market bench how they good 
ensure use good colore remove unprofelisme where you feel fix bugs and all there one issue i shared i.e as soon as i login webiste data came to late fix this and if user login and let suppose he visit after 8 hours and open website again he login already so data came very fast might why data came so late might be soem issue fix this 

why i am tellling this becuase i got one one feedback 

- **Type:** Audit, Fix, Polish, Optimize 
- **Goal:** Take this working full-stack project and raise it to a standard where a recruiter sees a real, well-built product and not a "kaam chalau" (just-working) student project, while everything that works today keeps working exactly the same.
- **Why:** Mentor feedback said (1) the projects do not stand out in the market, and recruiters compare them with existing products, and (2) basic mistakes (errors, edge cases, UI/UX, spelling and grammar, checklist and PRD points missing functionality) must be reviewed before the final submission. This is the last review before placement interviews, so quality matters in every detail.Then revise the core concepts again, especially around full-stack flows, APIs, validation, authentication, job status handling, and frontend responsivenes and one more think After multiple back and forth and multiple reviews and feedback, your projects were not as per the checklist base on feedback work on it..


Find and fix all bugs across the whole project, including theme visibility (dark and light), responsiveness, typos, and checklist verification. ensure test all feature functionality UI looks ok and good none of issue/bugs will be left,console error,cors error on deployment, responsivenes, any css hidden issue or need adjecement fix it, I mention below read it.

## Read Guidlines
- Thoroughly review all existing specifications, PRDs, checklists, and reference links before starting.
- Audit every feature against the checklist. Identify and implement any missing or incomplete requirements.
- Identify and fix discovered bugs, errors, and usability issues.
- Refine the design to meet professional, polished, market-ready standards.

### 0.4 Checklist / PRD / Problem Statement

## Problem Statement

Your task is to build a MERN stack app called Workasana.

Workasana is a task management and team collaboration tool where users can create projects, assign tasks to teams and owners, set deadlines, and organize work using tags. It supports authentication, dynamic filtering, URL-based queries, and reporting features to track task progress and team productivity.

workasana.project.spec

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
      workasana.project.spec 2
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

    workasana.project.spec 3
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

  workasana.project.spec 4
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
workasana.project.spec 5
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
    workasana.project.spec 6

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
    workasana.project.spec 7

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
  workasana.project.spec 8
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
https://files.cdn.thinkific.com/file_uploads/887743/attachments/fac/a29/853/workasana.project.spec.pdf

2nd Checklist
workasana.mongoose.models

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
workasana.mongoose.models 2
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
workasana.mongoose.models 3
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
workasana.mongoose.models 4
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
workasana.mongoose.models 5

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

for cleare more: https://files.cdn.thinkific.com/file_uploads/887743/attachments/3f5/978/4d7/workasana.mongoose.models.pdf


---

NOTE: 
- read properly for testing & varify ensure all should work and all checklist featured covered.
- every missing checklist point should be cover.
- read properly for testing & varify ensure all should work.
- I added comments section for discussion do not remove why I am telling bcz it is not in PRD that's why


### 0.5 Test accounts (optional)
> Use dummy accounts only. Never paste real passwords.

```
[ TEST USER / TEST ADMIN CREDENTIALS HERE ]
```

### 0.6 Known problems (optional)
```
[ PAGES, THEMES, OR SCREEN SIZES WHERE I ALREADY SEE PROBLEMS ]
```

### 0.7 Market benchmark
```
    - https://worksana.com/
    - https://www.workasana.com/
    - https://asana.com/resources/category/work-management
[ e.g. for CollabCore ]
```

## 1. Type and Intent
- **Type:** Bug Hunt, Verification, and Refinement (NOT a redesign, NOT a rebuild)
- **Goal:** The project already works and the UI already looks good. Find and fix every remaining bug and small problem, verify every checklist point, and polish the details so that no recruiter can find a mistake.
- **Why:** Mentor feedback said the basics are missing: error messages, functionality, edge cases, UI/UX, spelling and grammar. Recruiters compare projects with real products and notice small mistakes immediately. The quality must feel carefully built, not "kaam chalau" (just-working).

## 2. Scope Lock
1. Work only on the task in Section 0.3 and on verifying Section 0.4. If the task says "whole project", the whole project is in scope. Otherwise only the named parts.
3. Do **not** touch anything outside the scope. If something outside looks wrong, list it under "Observations (not changed)".
4. If a fix might affect a protected item (Section 3), stop and ask first. If anything is unclear, ask. Do not guess.

## 3. Protected Items (must stay exactly the same)
- **Authentication and authorization:** it was implemented by me and it works. Do **not** remove, replace, or rewrite it. Only test and verify it (register, login, logout, token or session expiry, protected routes, role access, wrong password, duplicate account, refresh while logged in). If a real bug is found, report it and fix it with the smallest possible change.
- All API endpoints: paths, methods, request and response shapes used by the frontend, status codes (already tested in Postman).
- All frontend routes and URLs.
- All `.env` variable names and values.
- All business logic, validation rules, database schemas, and existing data.
- Every feature that works today.
- Existing dependencies, unless strictly needed (flag first).

## 4. Phase 1: Test and Find Bugs (no code changes in this phase)
Run the frontend and backend locally and test everything thoroughly. Produce a **Bug Log** with: ID, page or file, description, severity (high / medium / low), and how to reproduce.

### 4.1 Checklist verification
- Test every point in Section 0.4 and mark it ✅ working, ⚠️ partial or buggy, ❌ missing.
- Test each feature end to end: UI → API → database → response → UI.

### 4.2 Dark and light theme audit (critical)
Check **every page, component, and state** in **both** themes. Some text is currently hidden in one theme and visible in the other, so find all of it.
- Text color vs background color: every piece of text must be clearly readable (aim for WCAG AA contrast, 4.5:1 for normal text).
- Hardcoded colors (`#000`, `#fff`, fixed grays) that ignore the theme.
- Placeholders, labels, helper text, error text, disabled text, links, and badges.
- Inputs, selects and dropdown options, checkboxes, radios, date pickers, autofill color.
- Modals, drawers, popovers, tooltips, toasts, alerts, tables, cards, tabs, pagination, empty states, skeleton loaders.
- Icons and SVGs with fixed fill, logos and images that disappear on one background, charts and their labels.
- Borders, dividers, and shadows that become invisible, hover, focus, and active states.
- Theme persistence after refresh, no flash of the wrong theme on load, and behavior with the system theme setting if supported.

### 4.3 Responsiveness audit
Test at widths 320, 360, 375, 390, 414, 600, 768, 820, 1024, 1280, 1440, and 1920 px, plus mobile landscape and browser zoom up to 200%.
- Margin, padding, gap, and height problems, text cut off or overlapping, horizontal scroll, overflow, wrong font size or weight, misalignment, broken images, tables on small screens, sticky header or footer overlap, small tap targets, modal sizing, and mobile keyboard overlap on forms.
- Navbar, menus, forms, cards, lists, and every page behave correctly on desktop, tablet, and all mobile sizes.

### 4.4 Text, spelling, and grammar
Check all visible text (headings, labels, buttons, placeholders, toasts, error messages, empty states, page titles, alt text, 404 page), and also file and variable names, comments, and README. Error messages must be clear and human, with no raw errors, stack traces, or "undefined" shown.

### 4.5 Functionality and edge cases
Empty states, invalid input, very long input, duplicate actions, double clicks, expired session, network failure, slow network, deleted or missing data, back and forward browser buttons, refresh in the middle of a flow, and invalid URLs.

### 4.6 Console, network, and security
- Browser console: zero errors and zero warnings that matter. Network tab: no failed requests and no CORS errors. Server console: no errors.
- API responses must not expose sensitive data (password hashes, tokens, other users' private data, internal fields). Remove such fields **without** removing anything the frontend uses and **without** changing endpoints.
- No secrets in frontend code or git. `.env` ignored by git, `.env.example` with names only.
- Backend input validation and route authorization are in place. CORS stays restricted to configured origins (no wildcard shortcut).

### 4.7 Performance
Find real bottlenecks only (unnecessary re-renders, heavy repeated calculations, large lists, N+1 queries, large images, large bundles).

### 4.8 Structure and naming
Review the folder structure and file names. Note what is messy or unclear.

## 5. Phase 2: Fix and Refine
- Fix bugs in order of severity. Make small, safe steps, and re-test after each fix.
- **Theme and CSS fixes:** prefer fixing the root cause (theme variables or design tokens) instead of patching one element at a time. Keep the current look. Use the project's existing styling approach (Tailwind or custom CSS3). Do not mix in a new styling system.
- **Performance:** use `useMemo`, `useCallback`, `React.memo`, closures, currying, debounce and throttle, lazy loading, pagination, and proper keys only where a real bottleneck exists. Do not add them everywhere. Same behavior and same output after optimization.
- **Structure:** if the folder structure is messy, improve it safely: clear folders (components, pages, hooks, services or api, utils, routes, controllers, models, middleware, config) and meaningful file and function names (no `test1`, `final2`, `temp`). When moving or renaming, update every import, run the build, and confirm it passes. Never rename anything that changes an API path, URL, or env variable. Delete only files that are clearly unused.
- **Missing checklist features:** build them inside the existing architecture, using the existing patterns.
- **Writing and code quality:** all text must be correct, natural English with no typos. The code must look human-written: short focused functions, meaningful names, and comments only where they explain why. No AI-style filler, no lorem ipsum, no leftover `console.log`, TODOs, or commented-out code.

## 6. Browser Testing and Evidence (required)
- Test in a real browser if the agent can run one (for example browser automation or a browser tool). Test both themes and the screen sizes in Section 4.3. Capture before and after screenshots for every UI fix.
- Test the whole auth flow and all checklist features in the browser, and check the console and network tab during the test.
- If the agent cannot run a browser, it must say so clearly, perform a careful code-level review of theme and layout, and give me a short manual test list for the parts it could not verify. It must never claim something was tested when it was not.

## 7. Final Verification
1. Re-run every checklist point in the browser.
2. Test all API endpoints (Postman or equivalent), and confirm paths and results are unchanged.
3. Re-check both themes on every page and every state.
4. Re-check all screen sizes.
5. Re-check console, network, and CORS.
6. Run a spelling and grammar pass.
7. Run the production build with no errors or new warnings.
8. Review the diff: only task-related changes, no protected item changed (especially auth, endpoints, URLs, env).

## 8. Acceptance Criteria
- [ ] Every checklist point is verified and working, and every gap is fixed or clearly reported.
- [ ] Authentication still works exactly as before.
- [ ] All text is visible and readable in both dark and light themes on every page and state.
- [ ] No layout, spacing, font, or overflow issues on desktop, tablet, and mobile.
- [ ] No spelling, grammar, or typo mistakes anywhere.
- [ ] No console errors, no CORS errors, no failed requests.
- [ ] No sensitive data exposure.
- [ ] No regression: everything that worked before works the same now.
- [ ] No endpoint, URL, or `.env` variable changed.
- [ ] Folder structure is clean, names are meaningful, and the build passes.
- [ ] Evidence (screenshots or test notes) is provided for the fixes.

## 9. Final Report Format
1. **Bug Log:** ID, page, problem, severity, fix, files changed, status.
2. **Checklist result:** each point with its final status.
3. **Theme and responsiveness results:** what was found and fixed, with before and after evidence.
4. **Verification done:** what was tested in the browser and what was not.
5. **Observations (not changed):** issues noticed outside the scope.
6. **Talking points:** 5 to 6 simple points I can use to explain the improvements in an interview.

## 10. Out of Scope
- Anything outside Section 0.3. No redesign, no rewrite, no new tech stack, no endpoint changes, no authentication replacement, no database change.

---
### Execution order for the agent
Read Section 0 fully → run the project → test everything in the browser and build the Bug Log (Phase 1) → fix in small safe steps (Phase 2) → verify after every fix → full verification (Section 7) → final report. Stop and ask whenever a change might touch a protected item.