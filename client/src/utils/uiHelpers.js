const AVATAR_COLORS = [
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#3b82f6", // Blue
  "#ef4444", // Rose
  "#8b5cf6", // Violet
  "#0d9488", // Teal
  "#ec4899", // Pink
  "#0284c7", // Sky
];

export const getInitials = (name = "") => {
  const cleaned = String(name || "").trim();
  if (!cleaned) return "U";
  const parts = cleaned.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return cleaned.slice(0, 2).toUpperCase();
};

export const getAvatarColor = (seed = "") => {
  const str = String(seed || "user");
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

export const formatDueDate = (dueDate, createdAt, timeToComplete = 1) => {
  let targetDate = null;
  if (dueDate) {
    const parsed = new Date(dueDate);
    if (!Number.isNaN(parsed.getTime())) {
      targetDate = parsed;
    }
  }
  if (!targetDate) {
    const base = createdAt ? new Date(createdAt) : new Date();
    const validBase = Number.isNaN(base.getTime()) ? new Date() : base;
    targetDate = new Date(
      validBase.getTime() + (Number(timeToComplete) || 1) * 24 * 60 * 60 * 1000,
    );
  }

  return targetDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
