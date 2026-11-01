# SPEC: Strictly Scoped Fix (MERN Project, Full Preservation)

## 0. Task to Fix (FILL THIS IN BEFORE RUNNING)

# Targeted Bug Fixes 

## Objective
Inspect and fix only the css responsive issues listed below. Preserve the existing project, logic, and functionality without regressions.

## Required Fixes


1) /project see on mobile here or can say on tab delete button goes outside not look good card should be wrap. and there on some mobile phone size New Project modal button not consistant fix this also as you fix earlier

## Strict Constraints
- Inspect the actual code and trace each issue to its root cause before making changes. Do not guess.
- Preserve all existing business logic, authentication, APIs, endpoints, request/response contracts, routes, URLs, database behavior, and integrations.
- Do not introduce unrelated refactoring or remove existing features.
- Do not break logic,functionality while working with it is working in condition just need to fix this some css issue only not logic. 
- Make only the minimum necessary changes to fix the specified bugs.

## Acceptance Criteria
- All listed issues are fixed and verified.
- Modals and buttons are clearly visible and responsive across all mobile size, tablet, and desktop in both themes.
- No broken functionality, new console errors, API regressions, or unintended side effects.
- Report root causes, modified files, fixes, and tests actually performed.

**Final rule: Minimal, targeted fixes only. Preserve working functionality and report honestly—do not claim untested fixes or change behavior based on assumptions.**

## 0.1 Extra Context (OPTIONAL)
> Relevant file names, screenshots, error logs, or related endpoints. Leave blank if unknown.

```
[ OPTIONAL CONTEXT HERE ]
```

## 1. Type & Intent
- **Type:** Scoped Bug Fix / Modification
- **Goal:** Resolve only the issue described in Section 0 in this existing MERN application, with zero side effects on any other part of the project.
- **Project state:** The application is already built and working. Everything outside Section 0 is considered correct, protected, and must remain untouched.

## 2. Scope Lock (highest priority rule)
1. Work **only** on the task and fix issues in Section 0. Do nothing else.
2. Do **not** refactor, rename, reformat, restyle, reorganize, upgrade, or "improve" any code that is not strictly required for this task.
3. Do **not** fix unrelated bugs, warnings, or code smells you notice. Instead, list them at the end as "Observations (not changed)".
4. If the fix cannot be completed without touching something outside this scope, **stop and ask** with the exact reason. Never proceed silently.
5. If the task description is unclear or incomplete, ask for clarification. Do not guess.

## 3. Investigation Before Changes
1. Locate the exact file(s), component(s), route(s), and function(s) responsible for the issue by reading the real code.
2. Identify the **root cause**, not just the symptom.
3. Write a short plan: what will change, in which files, and why. Choose the smallest change that fully solves the issue.
4. Check what else depends on the code you are about to change (imports, shared components, shared utilities, API consumers) so the change cannot break them.

## 4. Protected Items (must remain intact)
- All existing API endpoints: paths, HTTP methods, request and response shapes, status codes.
- All frontend routes and URLs.
- All environment variables: names, values, and the behavior that depends on them.
- All business logic, validation rules, authentication and authorization flow.
- Database schemas, models, and existing data.
- Existing UI design, layout, styling, and responsiveness (desktop, tablet, mobile) outside the task.
- All currently working features and user flows.
- Existing dependencies and versions.

## 5. Rules and Constraints (hard rules)
- Do not add a new library or dependency unless the task cannot be solved without it. If needed, flag it and explain why before adding.
- Follow the existing code style, naming, folder structure, and patterns of this project.
- Do not introduce console errors, warnings, or build errors.
- Do not leave debug code, `console.log`, commented-out code, or TODOs behind.
- Do not change CSS globally. Any style change must be scoped to the affected element only, with no layout break and no hidden text at any screen size accept this task.
- Do not change any API contract unless the task explicitly says so.
- Do not hardcode values, secrets, or URLs.
- Handle errors and edge cases for the changed code (null/undefined, empty data, failed request, loading state) in the same way the project already does.

## 6. Acceptance Criteria
- [ ] The issue in Section 0 is fully resolved and works end-to-end (UI, API, database where applicable).
- [ ] The root cause is fixed, not only the symptom.
- [ ] No new errors or warnings in browser console, server console, or build output.
- [ ] Zero regressions: every feature that worked before still works the same way.
- [ ] No endpoint, URL, env variable, schema, or logic outside the task was changed.
- [ ] Responsiveness is unchanged on desktop, tablet, and mobile.
- [ ] Only the files strictly necessary for this task were modified.
- [ ] Code matches the existing project style.

## 7. Verification (required before declaring done)
1. Reproduce the original issue first, then confirm it no longer occurs after the fix.
2. Test the happy path, and at least these edge cases: empty input, invalid input, failed API call, slow network.
3. Walk through the other main features of the app that share code with the change and confirm they still work.
4. Review the final diff and confirm it contains only task-related changes.
5. Run the build and confirm it passes with no new warnings.

## 8. Final Report Format
Provide, in this order:
1. **Root cause** (2-3 lines)
2. **Files changed** (list, with one line per file explaining why)
3. **What was verified** (tests and checks performed)
4. **Observations (not changed)** (unrelated issues noticed but deliberately left untouched)

## 9. Out of Scope
- Everything not written in Section 0. No new features, no redesign, no cleanup, no optimization, no dependency upgrades.

---
### Execution order for the agent
Read Section 0 → investigate and find root cause → write plan → check dependencies of the code → apply the smallest correct change → verify the fix → run regression checks → review the diff for scope → submit the final report. If anything is unclear or requires going outside scope, stop and ask first.