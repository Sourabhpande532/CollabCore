const mongoose = require("mongoose");
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
require("dotenv").config({ path: __dirname + "/.env" });

const Project = require("./model/Project");
const Team = require("./model/Team");
const Task = require("./model/Task");
const Tag = require("./model/Tag");
const Comment = require("./model/Comment");
const User = require("./model/Signup");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URL, { dbName: "myWorkasanaDatabase" });
    console.log("Connected to myWorkasanaDatabase for professional seeding");

    // Fetch existing users (ensure alice exists)
    const existingUsers = await User.find();
    console.log(`Found ${existingUsers.length} existing users`);
    if (existingUsers.length === 0) {
      throw new Error("No users found in database");
    }

    const alice = existingUsers.find(u => u.email === "a@gmail.com") || existingUsers[0];
    const sourabh = existingUsers.find(u => u.email === "s@gmail.com") || existingUsers[1] || alice;
    const gaurav = existingUsers.find(u => u.email === "gkumar@gmail.com") || existingUsers[2] || alice;
    const rahul = existingUsers.find(u => u.email === "rahul@gmail.com") || existingUsers[3] || alice;
    const ankita = existingUsers.find(u => u.email === "test@gmail.com") || existingUsers[4] || alice;
    const adity = existingUsers.find(u => u.email === "adity@gmail.com") || existingUsers[5] || alice;
    const admin = existingUsers.find(u => u.email === "admin@gmail.com") || existingUsers[6] || alice;

    // 1. CLEAR OLD NON-USER COLLECTIONS
    await Project.deleteMany({});
    await Team.deleteMany({});
    await Task.deleteMany({});
    await Tag.deleteMany({});
    await Comment.deleteMany({});
    console.log("Cleared old projects, teams, tasks, tags, comments");

    // 2. SEED TAGS
    const tagNames = [
      "Frontend",
      "Backend",
      "DevOps",
      "UI-UX",
      "Security",
      "Urgent",
      "Bug",
      "Feature",
      "Documentation"
    ];
    const tagDocs = await Tag.insertMany(tagNames.map(name => ({ name })));
    console.log(`Seeded ${tagDocs.length} professional tags`);

    // 3. SEED TEAMS
    const teamData = [
      {
        name: "Platform Engineering",
        description: "Responsible for cloud infrastructure, CI/CD pipelines, and high availability systems.",
        members: [alice._id, gaurav._id, sourabh._id]
      },
      {
        name: "Frontend Architecture",
        description: "Builds design systems, accessibility compliance, and high performance web clients.",
        members: [alice._id, rahul._id, adity._id]
      },
      {
        name: "Product Design & UX",
        description: "Crafts user journeys, interaction patterns, design specifications, and prototypes.",
        members: [ankita._id, adity._id, gaurav._id]
      },
      {
        name: "Quality Assurance & Testing",
        description: "Automated end-to-end testing, load testing, security audits, and regression suites.",
        members: [rahul._id, ankita._id]
      },
      {
        name: "Customer Success & Ops",
        description: "Client onboarding, SLA tracking, user enablement, and operations support.",
        members: [admin._id, sourabh._id, alice._id]
      }
    ];
    const teams = await Team.insertMany(teamData);
    console.log(`Seeded ${teams.length} professional teams`);

    const platformTeam = teams[0];
    const frontendTeam = teams[1];
    const designTeam = teams[2];
    const qaTeam = teams[3];
    const opsTeam = teams[4];

    // 4. SEED PROJECTS
    const projectData = [
      {
        name: "Enterprise Cloud Migration",
        description: "Migrate legacy monolith infrastructure to containerized AWS microservices with automated CI/CD pipelines and zero downtime."
      },
      {
        name: "Mobile App Suite (v2.0)",
        description: "Next-generation iOS and Android workspace application with offline sync, biometrics, and push notifications."
      },
      {
        name: "Security & SOC-2 Compliance",
        description: "Implement enterprise security hardening, role-based access control (RBAC), and automated compliance audit logging."
      },
      {
        name: "Real-Time Collaboration Engine",
        description: "Develop WebSockets-driven task sync, live document commenting, and presence indicators."
      }
    ];
    const projects = await Project.insertMany(projectData);
    console.log(`Seeded ${projects.length} professional projects`);

    const cloudProject = projects[0];
    const mobileProject = projects[1];
    const securityProject = projects[2];
    const realtimeProject = projects[3];

    // Dates helpers
    const now = new Date();
    const daysAgo = (n) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000);
    const daysAhead = (n) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000);

    // 5. SEED TASKS
    const tasksData = [
      // Cloud Project Tasks
      {
        name: "Configure Multi-Region Kubernetes Clusters",
        project: cloudProject._id,
        team: platformTeam._id,
        owners: [sourabh._id, gaurav._id],
        tags: ["DevOps", "Urgent"],
        dueDate: daysAhead(5),
        timeToComplete: 7,
        status: "In Progress",
        priority: "High",
        createdAt: daysAgo(10),
        updatedAt: daysAgo(1)
      },
      {
        name: "Set Up Zero-Downtime Blue/Green Deployments",
        project: cloudProject._id,
        team: platformTeam._id,
        owners: [alice._id, sourabh._id],
        tags: ["DevOps", "Feature"],
        dueDate: daysAgo(1),
        timeToComplete: 5,
        status: "Completed",
        priority: "High",
        createdAt: daysAgo(8),
        updatedAt: daysAgo(2) // within 7 days for LastWeekChart
      },
      {
        name: "Optimize PostgreSQL Connection Pooling & Indexing",
        project: cloudProject._id,
        team: platformTeam._id,
        owners: [gaurav._id],
        tags: ["Backend", "Urgent"],
        dueDate: daysAgo(2),
        timeToComplete: 4,
        status: "Completed",
        priority: "Medium",
        createdAt: daysAgo(9),
        updatedAt: daysAgo(3) // within 7 days
      },
      {
        name: "Establish Grafana & Prometheus Alerting",
        project: cloudProject._id,
        team: platformTeam._id,
        owners: [sourabh._id],
        tags: ["DevOps", "Documentation"],
        dueDate: daysAhead(10),
        timeToComplete: 3,
        status: "To Do",
        priority: "Medium",
        createdAt: daysAgo(3),
        updatedAt: daysAgo(1)
      },

      // Mobile Project Tasks
      {
        name: "Design System Token Library in Figma",
        project: mobileProject._id,
        team: designTeam._id,
        owners: [ankita._id, adity._id],
        tags: ["UI-UX", "Feature"],
        dueDate: daysAgo(1),
        timeToComplete: 6,
        status: "Completed",
        priority: "High",
        createdAt: daysAgo(12),
        updatedAt: daysAgo(4) // within 7 days
      },
      {
        name: "Implement Offline SQLite Storage & Sync Engine",
        project: mobileProject._id,
        team: frontendTeam._id,
        owners: [alice._id, rahul._id],
        tags: ["Frontend", "Feature"],
        dueDate: daysAhead(6),
        timeToComplete: 8,
        status: "In Progress",
        priority: "High",
        createdAt: daysAgo(7),
        updatedAt: daysAgo(1)
      },
      {
        name: "Biometric FaceID & Fingerprint Authentication",
        project: mobileProject._id,
        team: frontendTeam._id,
        owners: [rahul._id],
        tags: ["Frontend", "Security"],
        dueDate: daysAhead(12),
        timeToComplete: 5,
        status: "To Do",
        priority: "Medium",
        createdAt: daysAgo(4),
        updatedAt: daysAgo(2)
      },
      {
        name: "End-to-End Cypress Integration Test Suite",
        project: mobileProject._id,
        team: qaTeam._id,
        owners: [rahul._id, ankita._id],
        tags: ["Bug", "Feature"],
        dueDate: daysAgo(1),
        timeToComplete: 5,
        status: "Completed",
        priority: "Medium",
        createdAt: daysAgo(8),
        updatedAt: daysAgo(1) // within 7 days
      },

      // Security Project Tasks
      {
        name: "Audit IAM Roles and Least-Privilege Policies",
        project: securityProject._id,
        team: platformTeam._id,
        owners: [alice._id, gaurav._id],
        tags: ["Security", "Urgent"],
        dueDate: daysAgo(2),
        timeToComplete: 4,
        status: "Completed",
        priority: "High",
        createdAt: daysAgo(10),
        updatedAt: daysAgo(2) // within 7 days
      },
      {
        name: "Enforce TLS 1.3 & Encrypted Data at Rest",
        project: securityProject._id,
        team: platformTeam._id,
        owners: [gaurav._id],
        tags: ["Security", "Backend"],
        dueDate: daysAhead(4),
        timeToComplete: 6,
        status: "In Progress",
        priority: "High",
        createdAt: daysAgo(6),
        updatedAt: daysAgo(1)
      },
      {
        name: "Dynamic Role-Based Access Control (RBAC)",
        project: securityProject._id,
        team: frontendTeam._id,
        owners: [alice._id, adity._id],
        tags: ["Security", "Frontend"],
        dueDate: daysAgo(3),
        timeToComplete: 5,
        status: "Completed",
        priority: "High",
        createdAt: daysAgo(9),
        updatedAt: daysAgo(5) // within 7 days
      },
      {
        name: "Automated SOC-2 Audit Trail Logging",
        project: securityProject._id,
        team: qaTeam._id,
        owners: [ankita._id],
        tags: ["Security", "Documentation"],
        dueDate: daysAhead(14),
        timeToComplete: 4,
        status: "To Do",
        priority: "Low",
        createdAt: daysAgo(2),
        updatedAt: daysAgo(1)
      },

      // Realtime Project Tasks
      {
        name: "Architect Redis Pub/Sub for Live Collaboration",
        project: realtimeProject._id,
        team: platformTeam._id,
        owners: [sourabh._id, gaurav._id],
        tags: ["Backend", "Feature"],
        dueDate: daysAhead(7),
        timeToComplete: 7,
        status: "In Progress",
        priority: "High",
        createdAt: daysAgo(5),
        updatedAt: daysAgo(1)
      },
      {
        name: "Build Live Collaborative Rich Text Editor",
        project: realtimeProject._id,
        team: frontendTeam._id,
        owners: [adity._id, rahul._id],
        tags: ["Frontend", "UI-UX"],
        dueDate: daysAhead(11),
        timeToComplete: 9,
        status: "To Do",
        priority: "High",
        createdAt: daysAgo(4),
        updatedAt: daysAgo(2)
      },
      {
        name: "WebSocket Connection Heartbeat & Reconnect Logic",
        project: realtimeProject._id,
        team: frontendTeam._id,
        owners: [alice._id, rahul._id],
        tags: ["Frontend", "Backend"],
        dueDate: daysAgo(1),
        timeToComplete: 3,
        status: "Completed",
        priority: "Medium",
        createdAt: daysAgo(7),
        updatedAt: daysAgo(3) // within 7 days
      },
      {
        name: "Developer Onboarding & API Documentation",
        project: realtimeProject._id,
        team: opsTeam._id,
        owners: [admin._id, alice._id],
        tags: ["Documentation", "Feature"],
        dueDate: daysAgo(2),
        timeToComplete: 3,
        status: "Completed",
        priority: "Low",
        createdAt: daysAgo(11),
        updatedAt: daysAgo(6) // within 7 days
      }
    ];

    const tasks = await Task.insertMany(tasksData);
    console.log(`Seeded ${tasks.length} professional tasks`);

    // 6. SEED COMMENTS
    const commentsData = [
      {
        text: "Architecture review meeting concluded successfully. Blue/Green CI/CD deployment pipelines are now verified on staging.",
        project: cloudProject._id,
        author: sourabh._id,
        createdAt: daysAgo(2)
      },
      {
        text: "Database read replicas are fully synchronized with primary; p99 latency dropped by 35%.",
        project: cloudProject._id,
        author: gaurav._id,
        createdAt: daysAgo(1)
      },
      {
        text: "Design tokens are officially integrated into the React component library; dark mode tokens match spec 100%.",
        project: mobileProject._id,
        author: ankita._id,
        createdAt: daysAgo(3)
      },
      {
        text: "Offline caching benchmark shows sub-45ms cold boot retrieval across Android and iOS test devices.",
        project: mobileProject._id,
        author: rahul._id,
        createdAt: daysAgo(1)
      },
      {
        text: "Automated vulnerability scan returned zero critical findings. Ready for third-party penetration testing.",
        project: securityProject._id,
        author: alice._id,
        createdAt: daysAgo(2)
      },
      {
        text: "WebSocket load benchmark sustained 15,000 concurrent client socket connections without packet drop.",
        project: realtimeProject._id,
        author: sourabh._id,
        createdAt: daysAgo(1)
      }
    ];
    const comments = await Comment.insertMany(commentsData);
    console.log(`Seeded ${comments.length} professional comments`);

    console.log("\n✅ ALL PROFESSIONAL SEED DATA SUCCESSFULLY POPULATED!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
