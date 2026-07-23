export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    Coursera: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    Udemy: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    edX: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    YouTube: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    Udacity: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
    Pluralsight: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    "LinkedIn Learning": "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
    Skillshare: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Other: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
  };
  return colors[platform] || colors["Other"];
}
