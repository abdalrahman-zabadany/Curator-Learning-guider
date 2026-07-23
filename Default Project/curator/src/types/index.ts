export interface Review {
  id: string;
  courseId: string;
  courseName: string;
  platform: string;
  authorName: string;
  authorAvatar?: string;
  isAnonymous: boolean;
  worthIt: boolean;
  overallRating: number;
  contentQuality: number;
  practicalValue: number;
  engagement: number;
  title: string;
  body: string;
  pros: string[];
  cons: string[];
  certificateUrl?: string;
  verified: boolean;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  userVote?: "up" | "down" | null;
}

export interface Course {
  id: string;
  name: string;
  platform: string;
  instructor: string;
  thumbnail?: string;
  description: string;
  url?: string;
  reviewCount: number;
  avgWorthIt: number;
  avgRating: number;
  tags: string[];
}

export interface PathwayNode {
  id: string;
  title: string;
  type: "course" | "book" | "article" | "project" | "video";
  url?: string;
  status: "not_started" | "in_progress" | "completed";
  description?: string;
  order: number;
}

export interface LearningPathway {
  id: string;
  title: string;
  description: string;
  authorName: string;
  authorAvatar?: string;
  goal: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedMonths: number;
  nodes: PathwayNode[];
  forks: number;
  stars: number;
  createdAt: string;
  tags: string[];
}

export interface Circle {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  icon: string;
  tags: string[];
  recentVoiceSnippets: VoiceSnippet[];
}

export interface VoiceSnippet {
  id: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  audioUrl?: string;
  duration: number;
  upvotes: number;
  createdAt: string;
}

export type Theme = "light" | "dark";

export type Platform =
  | "Coursera"
  | "Udemy"
  | "edX"
  | "YouTube"
  | "Udacity"
  | "Pluralsight"
  | "LinkedIn Learning"
  | "Skillshare"
  | "Other";

export const PLATFORMS: Platform[] = [
  "Coursera",
  "Udemy",
  "edX",
  "YouTube",
  "Udacity",
  "Pluralsight",
  "LinkedIn Learning",
  "Skillshare",
  "Other",
];

export const CIRCLE_TAGS = [
  "Machine Learning",
  "Web Development",
  "Data Science",
  "Design Theory",
  "Mobile Development",
  "DevOps",
  "Cybersecurity",
  "Cloud Computing",
  "AI & LLMs",
  "Programming Languages",
];
