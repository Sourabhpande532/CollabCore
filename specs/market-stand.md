# SPEC: Market-Ready Upgrade of an Existing Full-Stack Project

### 0.1 Project name and type

```
[ PROJECT NAME: CollabCore]
```

### 0.2 Tech stack (if known)

```
for UI/UX: CSS3, Tailwaind CSS, or if case(Bootstrap)
and this is MERN project hope you know what tech stack should be use still for your clearence below listed

# Tech Stack
- React
- React Router
- Express
- MongoDB
- JWT Authentication
```

### 0.3 Task for this run

# SDD: Make the Application Market-Ready

## Objective
Make the existing application production-ready and competitive with market standards, using the provided reference links for inspiration.

## Requirements
- Thoroughly review all existing specifications, PRDs, checklists, and reference links before starting.
- Audit every feature against the checklist. Identify and implement any missing or incomplete requirements.
- fix any bugs If you find while building this 
- Evaluate the application from a real user's perspective, including UI/UX, responsiveness, functionality, and edge cases.
- Identify and fix discovered bugs, errors, and usability issues.
- Refine the design to meet professional, polished, market-ready standards.

## Strict Constraints
- Preserve all existing business logic, functionality, APIs, routes, URLs, links, integrations, and configurations.
- Do not remove or break existing features or introduce unrelated changes.
- Make only necessary improvements while maintaining backward compatibility.

## Acceptance Criteria
- All checklist requirements are implemented and verified.
- No known critical bugs or broken functionality remain.
- The application meets professional market standards across desktop, tablet, and mobile.
- Existing functionality remains intact.
- Test the changes and report completed checklist items, fixes, modified files, and any remaining issues.

## Source of Truth --- Strict

- `client` and `server` are my existing application and remain the
  source of truth.
- Keep the project name **CollabCore**.
- Preserve all current features, business rules, backend logic, data,
  APIs/endpoints, HTTP methods, request/response contracts,
  URLs/routes, query parameters, authentication/authorization,
  database behavior, integrations, and environment-variable
  names/usage.
- Do not replace my application with the reference project, copy its
  app structure wholesale, or substitute mock data for real data.
- Do not change URLs, API contracts, environment configuration, or
  backend logic for styling convenience.
- No feature may be removed or silently disabled. Avoid new CORS
  error no AI generation errors, console errors/warnings, failed requests, and regressions.

## 1. Inspect Before Changing

1.  Read all existing specs, PRD/problem statement, checklists, and
    relevant project documentation completely.
2.  Inventory existing functionality and map each major UI flow to its
    current implementation and API.
3.  Compare the implementation against the provided requirements and
    identify missing, incomplete, buggy, or inconsistent
    items---including spelling, grammar, typos, responsiveness, theme
    behavior, hidden text on theme check. and loading/performance problems.
4.  Review these design references for visual ideas only:
    - https://worksana.com/
    - https://asana.com/resources/category/work-management
5.  Produce a concise implementation plan based on the actual code and
    supplied requirements. Do not guess when evidence can be inspected.

## 2. UI/UX Redesign

- Make CollabCore look intentionally designed, professional, modern,
  cohesive, and appropriate for a real hiring/recruitment product.
- Use the reference projects/links to understand visual hierarchy,
  typography, spacing, layouts, navigation, content presentation,
  forms, card and interaction patterns. Adapt ideas to CollabCore
  rather than copying pages or content.
- Avoid generic AI-generated styling, repetitive template-like cards,
  excessive gradients/glassmorphism, decorative effects, inconsistent
  spacing, and unnecessary animation.
- Improve hierarchy, readability, alignment, contrast, component
  consistency, whitespace, and clear calls to action.
- Correct spelling, grammar, punctuation, capitalization, labels,
  helper text, and error messages while preserving meaning and
  business rules.
- Keep the **CollabCore** name and existing project content. Do not
  invent testimonials, employers, statistics, jobs, features, or
  claims.
- add profestional footer if not present along with all requiremetn with working link


## 4. Functionality & Requirements Coverage

- UI controls must remain connected to the original application logic
  and real APIs.
- Preserve all existing flows, forms, validation, navigation,
  search/filtering, pagination, CRUD actions, authentication,
  role-based behavior, and other features actually present.
- Test all applicable CollabCore flows based on the real project and
  supplied checklist/PRD---not assumptions.
- If the checklist/PRD requires a feature that is genuinely missing,
  determine whether the existing backend supports it. Implement it
  only within the documented requirement and current architecture; if
  it requires a backend/API change, assess impact first and preserve
  backward compatibility.
- Do not invent new product behavior or use hardcoded/demo data to
  make a screen appear complete.
- Ensure loading, success, empty, validation, and failure states are
  clear and functional.

## 5. Responsive & Accessible UI

Test key pages and flows on mobile, small mobile, tablet, laptop, and
desktop. - Fix overflow, overlapping content, clipped text, hidden
controls, hiddent text on UI while toggling theme broken menus, unusable forms, and inconsistent spacing. -
Ensure navigation, tables, cards, dialogs, forms, and interactive
controls adapt to screen size. - Check keyboard navigation, focus
visibility, semantic elements, form labels, accessible names, and
readable color contrast. - Preserve existing theme/toggle behavior if
present; ensure switching themes does not hide content or make
text/components unreadable.

## 6. Performance & Stability

Inspect and fix actual, verifiable problems rather than optimizing
blindly. - Review bundle size, large assets, image loading, fonts,
unnecessary dependencies, duplicate API calls, repeated rendering,
expensive calculations, blocking work, and unnecessary network
requests. - Inspect loading delays and PWA/Lighthouse issues if PWA
configuration exists; use available Lighthouse results to prioritize
fixes. - Optimize only where justified. Avoid premature memoization,
unnecessary abstractions, and caching that could make data stale or
change behavior. - Do not hide slow operations by changing loaders
alone. - Preserve API base URLs, environment configuration,
authentication, and request sequencing requirements. - Do not expose
secrets or server-only environment variables in client code.

## 7. No-Regression Rules

- Make focused, incremental changes; avoid a full rewrite.
- Do not change backend logic just to accommodate a new design.
- Do not rename or remove routes, endpoints, environment variables,
  database fields, or public interfaces without an explicit
  requirement and a verified compatibility plan.
- Do not delete code/assets until confirmed unused.
- Do not suppress lint, type, build, browser, or network errors to
  make checks appear clean.
- Do not claim a test passed unless it was actually run.
- If a requirement cannot be safely completed, explain the blocker
  rather than silently omitting it.
- ensure you read all this `market-stand.md`study,analysis properly and you start to design so what exactly i want you should know.

## 8. Verification Checklist

Before finishing:

- \[ \] Read the supplied specifications/checklist/PRD and map requirements to implementation.
- \[ \] Confirm CollabCore branding and content remain correct.
- \[ \] Confirm every existing route and important user flow works.
- \[ \] Test all applicable forms,validations, and interactive controls.
- \[ \] Confirm frontend-to-backend requests use the original endpoints and compatible contracts.
- \[ \] Confirm authentication, authorization, database operations, and integrations still work.
- \[ \] Confirm no new CORS errors, no AI generation error failed API requests, console errors, or warnings are introduced.
- \[ \] Check responsive layouts across mobile, tablet, and desktop.
- \[ \] Check theme/toggle behavior if present and clear visibility.
- \[ \] Run available linting, tests, and production build; fix issues introduced by changes.
- \[ \] Inspect performance/Lighthouse findings where tools and environment permit, and re-test important changes.
- \[ \] Recheck for spelling, grammar, typos, broken assets,dead links, and accidental hidden content.

## Acceptance Criteria

CollabCore has a cohesive, market-standard, human-designed UI inspired by
the references, with corrected text and reliable responsive behavior.
The provided PRD/checklist is covered to the extent supported by the
inspected project and requirements. Tailwind migration is complete and
stable. **All existing functionality, business logic, endpoints, URLs,
environment configuration, and backend behavior remain intact**, with no
regressions introduced by the work.

## Final Instruction

**Read thoroughly → Inspect both projects → Map requirements and
existing behavior → Plan → Redesign/migrate incrementally → Test → Fix
regressions → Report honestly.**

The reference projects are inspiration only. My existing CollabCore
application is the product. Prioritize preserving behavior over visual
convenience. Do not guess, do not copy-paste an unrelated application,
and do not mark the task complete until the changes have been verified.

---

## Implementation & Verification

- Adapt the reference UI to my existing pages, components, data, and interactions.
- Replace mock/static reference data with my existing dynamic data wherever applicable.
- Ensure buttons, forms, navigation, filters, theme controls (if present), and other interactive elements work correctly.
- Test important user flows and API integrations after implementation.
- Check browser console, network requests, responsive layouts, and existing functionality for regressions.
- Fix any bugs introduced by the UI migration & as well in functionality.


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

### 0.5 Market benchmark (optional)
> Real products this project should be compared with (for example Amazon and Flipkart for e-commerce, WhatsApp for chat).



### 0.6 Extra notes (optional)

```
[ KNOWN BUGS, WEAK PAGES, ANYTHING ELSE ]
Check all pages you need to fix

```

## 1. Type and Intent

- **Type:** Audit, Fix, Polish, Optimize (NOT a rebuild)
- **Goal:** Take this working full-stack project and raise it to a standard where a recruiter sees a real, well-built product and not a "kaam chalau" (just-working) student project, while everything that works today keeps working exactly the same.
- **Why:** Mentor feedback said (1) the projects do not stand out in the market, and recruiters compare them with existing products, and (2) basic mistakes (errors, edge cases, UI/UX, spelling and grammar, checklist and PRD points missing functionality) must be reviewed before the final submission. This is the last review before placement interviews, so quality matters in every detail.Then revise the core concepts again, especially around full-stack flows, APIs, validation, authentication, job status handling, and frontend responsivenes and one more think After multiple back and forth and multiple reviews and feedback, your projects were not as per the checklist base on feedback work on it..

## 2. Scope Lock

1. Work only on the task in Section 0.3, and on verifying the points in Section 0.4. If Section 0.3 says "full audit and polish", the whole project is in scope. If it names specific pages, features, or files, only those are in scope.
2. Inside that scope, the audit is thorough. Outside it, change nothing.
3. If something outside scope looks wrong, list it under "Observations (not changed)". Do not touch it.
4. If a change would affect something protected (Section 4), stop and ask first.
5. If anything is unclear, ask. Do not guess.

## 3. Phase 1: Study and Audit (no code changes in this phase)

Read the real code and run the real app. Then produce an **Audit Report** covering:

1. **Checklist / PRD coverage:** each point from Section 0.4 marked ✅ working, ⚠️ partial or buggy, ❌ missing.
2. **Market comparison:** features that users expect from the benchmark products (Section 0.5) but are missing or weak here. Suggest only realistic additions that fit the existing architecture.
3. **Functionality and edge cases:** empty states, invalid input, duplicate actions, expired sessions, network failure, large data, double clicks, refresh in the middle of a flow.
4. **Error handling:** every user-facing error message must be clear, human, and helpful. No raw errors, stack traces, or "undefined" shown.
5. **UI/UX:** consistency, hierarchy, spacing, loading and empty and error states, form feedback, navigation, no hidden text on both theme shoulbe be visible if user keep toggling theme accessibility basics all.
6. **Spelling, grammar, and typos:** every visible text (labels, placeholders, buttons, toasts, headings, alt text, page titles, README) and also identifiers, file names, and comments.
7. **Security and data exposure:** see Section 6.
8. **Console health:** browser console errors and warnings, server console errors, failed network requests, CORS errors. no AI generation error
9. **Performance:** see Section 7.
10. **Project structure:** folder and file naming quality, see Section 8.

Present this report before Phase 2. Fix only what is inside the task scope.

## 4. Protected Items (must stay exactly the same)

- All API endpoints: paths, HTTP methods, request and response shapes consumed by the frontend, status codes. All have been tested in Postman, so they must behave the same.
- All frontend routes and URLs.
- All `.env` variable names and values, and the behavior that depends on them.
- All business logic, authentication and authorization flow, validation rules.
- Database schemas, collection or table names, and existing data.
- Every feature that works today.
- Existing dependencies, unless a change is strictly needed (flag it first).

## 5. Phase 2: Implementation Rules

- Make changes in small steps. After each step, confirm the app still works.
- Follow the existing code style and patterns, except where Section 8 improves structure safely.
- Missing checklist or PRD features: build them only inside the existing architecture, with the same patterns, without touching protected items.
- All text written by the agent must be in correct, natural English with no typos. It should read like a human wrote it. No AI-style filler, no placeholder or lorem ipsum, no leftover `console.log`, TODOs, or commented-out code. no AI generated comment if mention feel human
- The code itself must also look human-written: short, focused functions, meaningful names, consistent formatting, and comments only where they explain _why_ something is done. No over-commenting, no copy-pasted repeated blocks, no unnecessary abstraction. A recruiter reading the code should feel a careful developer wrote it.

## 6. Security and Data Exposure Rules

- Never expose secrets: no API keys, tokens, password or credentials in frontend code, in git, or in responses. `.env` must be git-ignored, and `.env.example` must list variable names only.
- API responses must not return sensitive or unnecessary fields (password hashes, internal tokens, other users' private data). Remove such fields **without** removing any field the frontend uses and **without** changing endpoint paths.
- Verify authorization on every protected route, so a user cannot read or change another user's data.
- Validate and sanitize all input on the backend, not only in the frontend.
- No CORS errors. no AI generation error Keep CORS restric no AI generation errorted to the configured origins (from env). Do not use a wildcard to "fix" it.
- Do not log sensitive data in the console or server logs.

## 7. Performance Rules

- First find real bottlenecks (unnecessary re-renders, repeated or heavy calculations, large lists, N+1 queries, uncompressed images, large bundles). Fix only confirmed issues.
- Use JavaScript and React optimization tools where they truly help, and only where they truly help: `useMemo`, `useCallback`, `React.memo`, closures, currying, debouncing and throttling, lazy loading and code splitting, pagination, proper keys.
- Do not add memoization everywhere. Over-optimizing is a quality problem too.
- Backend: efficient queries, indexes where useful, no unnecessary data returned, proper caching if already part of the project.
- Optimization must keep the same behavior and the same output.

## 8. Project Structure and Naming

- First inspect the current folder structure. Change it only if it is truly messy, and only if nothing can break.
- Target: a clean, standard, easy-to-navigate structure with meaningful names (for example separated components, pages, hooks, services or api, utils, routes, controllers, models, middleware, config).
- File, component, function, and variable names must describe their purpose. No names like `test1`, `new`, `final2`, `abc`, `temp`.
- When moving or renaming files, update every import and reference, then run the build and confirm it passes. Never rename anything that changes an API path, a URL, or an env variable.
- Remove only files that are clearly unused (confirm they are not imported anywhere). Do not delete anything uncertain.
- The README must be clear: what the project does, features, tech stack, setup steps, env variable names, scripts.

## 9. UI/UX Rules
- Use **Tailwind CSS**. Use custom CSS3 where it gives a better result.
- If the project already uses Tailwind, continue with it. If it uses another approach (plain CSS, Bootstrap, and so on), do not rewrite everything at once: add Tailwind safely, migrate page by page, and verify the page after each migration. Never leave two styling systems conflicting. If a full migration is risky, keep the existing CSS for stable parts, use Tailwind and custom CSS3 for the parts being improved, and report this choice.
- Design standard: clean, professional, and consistent, close to what users see in real products. Not a generic template and not the typical AI-looking blue/purple gradient design. Use a deliberate color palette, consistent spacing scale, a clear type hierarchy, and proper states (hover, focus, active, disabled, loading, empty, error).
- Responsive on **desktop, tablet, and all mobile sizes** (check at least 320, 360, 375, 414, 768, 1024, 1280, 1536 px).
- Check every page for: margin and padding problems, height and overflow problems, text cut off or hidden, wrong font size or weight, misaligned items, horizontal scroll, broken images, overlapping elements, tap targets too small on mobile.
- No hidden text anywhere (contrast, overflow, z-index).
- Do not change functionality while restyling.

## 10. Verification (required before declaring done)

1. Re-run every point of Section 0.4 and confirm the status.
2. Test all API endpoints (Postman or equivalent) and compare with previous behavior: same paths, same results.
3. Walk through every main user flow end to end, including edge cases.
4. Check browser console and server console: zero errors, zero CORS errors, no AI generation error no failed requests.
5. Check responsiveness page by page at the sizes listed in Section 9.
6. Run a spelling and grammar pass over all visible text.
7. Run the production build and confirm no errors or new warnings.
8. Review the diff: only task-related changes, no protected item altered.

## 11. Acceptance Criteria

- [ ] Every checklist/PRD point is verified, and every gap is fixed or clearly reported.
- [ ] No regression: everything that worked before works the same now.
- [ ] No endpoint, URL, or `.env` variable changed.
- [ ] No console errors, no CORS errors, no AI generation error, no failed requests.
- [ ] No sensitive data exposed in responses, frontend code, or git.
- [ ] No spelling, grammar, or typo mistakes anywhere.
- [ ] No hiddent text on theme it should be visible text on both theme
- [ ] UI looks professional and market-standard on desktop, tablet, and mobile, with no spacing, font, or overflow issues.
- [ ] Performance improved where real bottlenecks existed.
- [ ] Folder structure is clean and names are meaningful, and the build passes.
- [ ] The final report is delivered.

## 12. Final Report Format

1. **Audit summary:** what was found (grouped by checklist, bugs, UI/UX, security, performance, structure).
2. **Changes made:** file by file, with one line of reasoning each.
3. **Before vs after:** key improvements (errors fixed, load time, bundle size, Lighthouse if relevant).
4. **Verification done:** tests and checks performed.
5. **Observations (not changed):** issues noticed outside the scope.
6. **Talking points:** 5 to 6 simple points I can use to explain the improvements in an interview.

## 13. Out of Scope

- Anything outside Section 0.3. No rewrite, no new tech stack, no endpoint redesign, no database change.

---

### Execution order for the agent

Read Section 0 fully → study the project → Audit Report (Phase 1) → implement in small, safe steps (Phase 2) → verify after every step → full verification (Section 10) → final report. Stop and ask whenever a change might touch a protected item.
