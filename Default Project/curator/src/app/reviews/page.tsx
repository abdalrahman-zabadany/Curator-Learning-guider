"use client";

import { useState, useCallback } from "react";
import {
  Search,
  ArrowLeft,
  Plus,
  X,
  ExternalLink,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import type { Review, Course } from "@/types";
import type { ReviewFormData } from "@/components/reviews/ReviewForm";
import { cn } from "@/lib/cn";
import { PlatformLogo } from "@/components/ui/PlatformLogo";

const MOCK_COURSES: Course[] = [
  {
    id: "genai-llm",
    name: "Generative AI with Large Language Models",
    platform: "Coursera",
    instructor: "DeepLearning.AI & AWS",
    description: "The most enrolled AI course of 2026. Covers LLM architecture, training, fine-tuning, and production deployment.",
    url: "https://www.coursera.org/learn/generative-ai-with-llms",
    reviewCount: 3840,
    avgWorthIt: 93,
    avgRating: 4.7,
    tags: ["AI & LLMs", "Machine Learning"],
  },
  {
    id: "google-ai-intro",
    name: "Google Introduction to AI",
    platform: "Coursera",
    instructor: "Google",
    description: "Google's flagship AI course. Covers neural networks, NLP, computer vision, and responsible AI practices.",
    url: "https://www.coursera.org/learn/google-introduction-to-ai",
    reviewCount: 4200,
    avgWorthIt: 91,
    avgRating: 4.6,
    tags: ["AI & LLMs", "Machine Learning"],
  },
  {
    id: "ml-spec",
    name: "Machine Learning Specialization",
    platform: "Coursera",
    instructor: "Andrew Ng",
    description: "The gold standard for ML education. Supervised/unsupervised learning, neural networks, and best practices.",
    url: "https://www.coursera.org/specializations/machine-learning-introduction",
    reviewCount: 2847,
    avgWorthIt: 94,
    avgRating: 4.8,
    tags: ["Machine Learning", "Python"],
  },
  {
    id: "cs50",
    name: "CS50: Introduction to Computer Science",
    platform: "edX",
    instructor: "David J. Malan",
    description: "Harvard's legendary intro CS course. C, Python, SQL, HTML/CSS/JS, and real-world problem sets.",
    url: "https://cs50.harvard.edu/x/",
    reviewCount: 5123,
    avgWorthIt: 97,
    avgRating: 4.9,
    tags: ["Computer Science", "Python"],
  },
  {
    id: "google-data-analytics",
    name: "Google Data Analytics Professional Certificate",
    platform: "Coursera",
    instructor: "Google Career Certificates",
    description: "Industry-recognized data analytics cert. Spreadsheets, SQL, R, Tableau, and data-driven decision making.",
    url: "https://www.coursera.org/professional-certificates/google-data-analytics",
    reviewCount: 3100,
    avgWorthIt: 88,
    avgRating: 4.7,
    tags: ["Data Science", "SQL"],
  },
  {
    id: "web-dev-bootcamp",
    name: "The Web Developer Bootcamp 2026",
    platform: "Udemy",
    instructor: "Colt Steele",
    description: "Comprehensive web dev. HTML, CSS, JS, Node, React, MongoDB — 60+ hours of hands-on content.",
    url: "https://www.udemy.com/course/the-web-developer-bootcamp/",
    reviewCount: 1893,
    avgWorthIt: 88,
    avgRating: 4.6,
    tags: ["Web Development", "React"],
  },
  {
    id: "fastai",
    name: "Practical Deep Learning for Coders",
    platform: "Other",
    instructor: "Jeremy Howard",
    description: "Free, top-down deep learning. Build real models from day one with the fast.ai library.",
    url: "https://course.fast.ai",
    reviewCount: 1567,
    avgWorthIt: 96,
    avgRating: 4.9,
    tags: ["Deep Learning", "Python"],
  },
  {
    id: "chatgpt-prompt-eng",
    name: "ChatGPT Prompt Engineering for Developers",
    platform: "DeepLearning.AI",
    instructor: "Andrew Ng & Isa Fulford",
    description: "Learn to build with LLMs. Prompt best practices, chaining, and real-world applications.",
    url: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/",
    reviewCount: 3201,
    avgWorthIt: 91,
    avgRating: 4.7,
    tags: ["AI & LLMs", "Prompt Engineering"],
  },
  {
    id: "python-100",
    name: "100 Days of Code: Python Bootcamp",
    platform: "Udemy",
    instructor: "Angela Yu",
    description: "Project-based Python. 100 days, 100 projects — from basics to automation, web, and data.",
    url: "https://www.udemy.com/course/100-days-of-code/",
    reviewCount: 2156,
    avgWorthIt: 89,
    avgRating: 4.7,
    tags: ["Python", "Programming"],
  },
  {
    id: "google-ux-design",
    name: "Google UX Design Certificate",
    platform: "Coursera",
    instructor: "Google Career Certificates",
    description: "Industry-recognized UX design cert. Research, wireframing, prototyping, and Figma.",
    url: "https://www.coursera.org/professional-certificates/google-ux-design",
    reviewCount: 1834,
    avgWorthIt: 85,
    avgRating: 4.5,
    tags: ["Design", "UX"],
  },
  {
    id: "react-patterns",
    name: "Advanced React Patterns",
    platform: "Frontend Masters",
    instructor: "Kent C. Dodds",
    description: "Deep dive into compound components, render props, hooks patterns, and performance.",
    url: "https://frontendmasters.com/courses/advanced-react-patterns/",
    reviewCount: 987,
    avgWorthIt: 92,
    avgRating: 4.8,
    tags: ["React", "JavaScript"],
  },
  {
    id: "aws-saa",
    name: "AWS Certified Solutions Architect",
    platform: "Udemy",
    instructor: "Stephane Maarek",
    description: "Gold standard for AWS cert prep. Covers all SAA-C03 exam topics with hands-on labs.",
    url: "https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/",
    reviewCount: 2789,
    avgWorthIt: 90,
    avgRating: 4.7,
    tags: ["Cloud Computing", "AWS"],
  },
  {
    id: "google-cybersecurity",
    name: "Google Cybersecurity Certificate",
    platform: "Coursera",
    instructor: "Google Career Certificates",
    description: "Foundational cybersecurity skills. Linux, SQL, Python, SIEM tools, and incident response.",
    url: "https://www.coursera.org/professional-certificates/google-cybersecurity",
    reviewCount: 2456,
    avgWorthIt: 87,
    avgRating: 4.6,
    tags: ["Cybersecurity", "Python"],
  },
  {
    id: "ml-zoomcamp",
    name: "ML Engineering Zoomcamp",
    platform: "DataTalks.Club",
    instructor: "DataTalks.Club",
    description: "Free, hands-on MLOps. Deployment, monitoring, Docker, MLflow, and production ML.",
    url: "https://github.com/DataTalksClub/machine-learning-engineering-zoomcamp",
    reviewCount: 1234,
    avgWorthIt: 93,
    avgRating: 4.8,
    tags: ["Machine Learning", "MLOps"],
  },
  {
    id: "intro-python",
    name: "Introduction to Python Programming",
    platform: "Udemy",
    instructor: "Ardit Sulce",
    description: "Beginner-friendly Python. Variables, control flow, functions, OOP, and practical exercises.",
    url: "https://www.udemy.com/course/python-programming-course/",
    reviewCount: 1890,
    avgWorthIt: 84,
    avgRating: 4.5,
    tags: ["Python", "Programming"],
  },
];

const MOCK_REVIEWS: Review[] = [
  { id: "1", courseId: "ml-spec", courseName: "Machine Learning Specialization", platform: "Coursera", authorName: "Sarah Chen", isAnonymous: false, worthIt: true, overallRating: 5, contentQuality: 5, practicalValue: 4, engagement: 4, title: "The gold standard for ML education", body: "Andrew Ng's updated specialization is exceptional. The math is accessible, the projects are hands-on, and the production-focused final section sets it apart.", pros: ["Excellent teaching quality", "Real-world projects", "Great community"], cons: ["Can be slow for experienced coders", "Some outdated notebooks"], verified: true, certificateUrl: "https://coursera.org/verify/abc123", createdAt: "2026-06-15", upvotes: 234, downvotes: 12, userVote: null },
  { id: "1b", courseId: "ml-spec", courseName: "Machine Learning Specialization", platform: "Coursera", authorName: "Marcus Lee", isAnonymous: false, worthIt: true, overallRating: 4, contentQuality: 5, practicalValue: 4, engagement: 3, title: "Great content but assumes math background", body: "The linear algebra refresher could be more thorough. Supplement with 3Blue1Brown's Essence of Linear Algebra first.", pros: ["Production-focused", "Well-structured"], cons: ["Needs stronger math prereqs", "Jupyter env setup tricky"], verified: true, createdAt: "2026-05-20", upvotes: 145, downvotes: 8, userVote: null },
  { id: "2", courseId: "cs50", courseName: "CS50: Introduction to Computer Science", platform: "edX", authorName: "Priya Patel", isAnonymous: false, worthIt: true, overallRating: 5, contentQuality: 5, practicalValue: 4, engagement: 5, title: "The single best intro to CS anywhere", body: "David Malan is the most engaging professor I've ever watched. The problem sets are challenging but incredibly rewarding.", pros: ["World-class production", "Challenging problem sets", "Covers C, Python, SQL, JS"], cons: ["Steep difficulty curve", "Time-intensive"], verified: true, createdAt: "2026-07-02", upvotes: 456, downvotes: 15, userVote: null },
  { id: "2b", courseId: "cs50", courseName: "CS50: Introduction to Computer Science", platform: "edX", authorName: "Anonymous", isAnonymous: true, worthIt: true, overallRating: 5, contentQuality: 5, practicalValue: 5, engagement: 5, title: "Changed my career at 35", body: "I was a marketing manager who wanted to transition into tech. CS50 gave me the foundation. Now I'm a junior dev.", pros: ["Life-changing", "Active community", "Free to audit"], cons: ["Set 4 is brutal", "Requires 20+ hours/week"], verified: false, createdAt: "2026-06-28", upvotes: 312, downvotes: 3, userVote: null },
  { id: "3", courseId: "fastai", courseName: "Practical Deep Learning for Coders", platform: "Other", authorName: "Anonymous", isAnonymous: true, worthIt: true, overallRating: 5, contentQuality: 5, practicalValue: 5, engagement: 4, title: "Top-down learning that actually works", body: "Jeremy Howard's approach is revolutionary. Build real models from day one. Changed my career trajectory.", pros: ["Unique top-down approach", "Free and accessible"], cons: ["Jupyter notebook format", "Needs more production focus"], verified: true, createdAt: "2026-04-10", upvotes: 312, downvotes: 8, userVote: null },
  { id: "4", courseId: "web-dev-bootcamp", courseName: "The Web Developer Bootcamp 2026", platform: "Udemy", authorName: "Alex Rivera", isAnonymous: false, worthIt: true, overallRating: 4, contentQuality: 4, practicalValue: 5, engagement: 3, title: "Solid fundamentals, tons of content", body: "Colt Steele covers an incredible amount of ground. Practical projects and clear explanations.", pros: ["Comprehensive curriculum", "Great for beginners", "Lifetime updates"], cons: ["Very long (60+ hours)", "Some sections rushed"], verified: false, createdAt: "2026-05-28", upvotes: 189, downvotes: 23, userVote: null },
  { id: "5", courseId: "chatgpt-prompt-eng", courseName: "ChatGPT Prompt Engineering for Developers", platform: "DeepLearning.AI", authorName: "Jordan Kim", isAnonymous: false, worthIt: true, overallRating: 5, contentQuality: 5, practicalValue: 5, engagement: 4, title: "Essential for anyone building with LLMs", body: "Short, dense, and immediately applicable. Built a working RAG pipeline in a weekend after this.", pros: ["Concise and practical", "Real-world examples", "Free"], cons: ["OpenAI-specific APIs", "Could go deeper on evaluation"], verified: true, createdAt: "2026-07-10", upvotes: 523, downvotes: 11, userVote: null },
  { id: "6", courseId: "python-100", courseName: "100 Days of Code: Python Bootcamp", platform: "Udemy", authorName: "Elena Torres", isAnonymous: false, worthIt: true, overallRating: 4, contentQuality: 4, practicalValue: 4, engagement: 5, title: "Best way to learn Python for beginners", body: "Angela Yu is incredible. Each day builds on the last. Real projects, not toy examples.", pros: ["Project-based learning", "Excellent pacing"], cons: ["Some projects feel dated", "No type hints coverage"], verified: true, createdAt: "2026-03-15", upvotes: 387, downvotes: 19, userVote: null },
  { id: "7", courseId: "google-ux-design", courseName: "Google UX Design Certificate", platform: "Coursera", authorName: "Nina Kowalski", isAnonymous: false, worthIt: true, overallRating: 4, contentQuality: 4, practicalValue: 4, engagement: 3, title: "Good foundation but not a job guarantee", body: "Solid content and Google brand recognition. You'll need a strong portfolio on top of it.", pros: ["Google brand", "Structured curriculum"], cons: ["Repetitive in places", "Not enough Figma depth"], verified: true, createdAt: "2026-04-22", upvotes: 234, downvotes: 28, userVote: null },
  { id: "8", courseId: "react-patterns", courseName: "Advanced React Patterns", platform: "Frontend Masters", authorName: "David Park", isAnonymous: false, worthIt: true, overallRating: 5, contentQuality: 5, practicalValue: 5, engagement: 4, title: "Took my React skills from good to great", body: "Kent Dodds is the definitive React expert. Compound components, render props, custom hooks — all immediately applicable.", pros: ["Deep technical content", "World-class teacher"], cons: ["Assumes solid React basics", "Pricey without subscription"], verified: true, createdAt: "2026-06-05", upvotes: 198, downvotes: 7, userVote: null },
  { id: "9", courseId: "aws-saa", courseName: "AWS Certified Solutions Architect", platform: "Udemy", authorName: "Tom Fischer", isAnonymous: false, worthIt: true, overallRating: 5, contentQuality: 5, practicalValue: 4, engagement: 4, title: "Passed on first attempt — this course is why", body: "Stephane Maarek explains AWS clearly. Practice exams are nearly identical to the real thing. Studied 6 weeks, passed with 891.", pros: ["Comprehensive coverage", "Excellent practice exams"], cons: ["Some outdated content", "Could use more labs"], verified: true, createdAt: "2026-05-12", upvotes: 445, downvotes: 14, userVote: null },
  { id: "10", courseId: "ml-zoomcamp", courseName: "ML Engineering Zoomcamp", platform: "DataTalks.Club", authorName: "Anonymous", isAnonymous: true, worthIt: true, overallRating: 5, contentQuality: 5, practicalValue: 5, engagement: 4, title: "The most underrated ML course out there", body: "Teaches what bootcamps don't — how to deploy and maintain ML models. Docker, MLflow, monitoring. All free.", pros: ["Free and comprehensive", "Production-focused"], cons: ["Self-paced can feel lonely", "Video quality inconsistency"], verified: false, createdAt: "2026-06-20", upvotes: 267, downvotes: 5, userVote: null },
  { id: "11", courseId: "genai-llm", courseName: "Generative AI with Large Language Models", platform: "Coursera", authorName: "Anonymous", isAnonymous: true, worthIt: true, overallRating: 5, contentQuality: 5, practicalValue: 5, engagement: 4, title: "The LLM course everyone should take", body: "Covers the full lifecycle — from understanding transformer architecture to deploying in production. The RAG section alone is worth it.", pros: ["Comprehensive LLM coverage", "Industry-relevant", "Hands-on labs"], cons: ["Fast-paced for beginners", "Requires GPU access for some exercises"], verified: true, createdAt: "2026-07-05", upvotes: 678, downvotes: 12, userVote: null },
  { id: "12", courseId: "google-data-analytics", courseName: "Google Data Analytics Professional Certificate", platform: "Coursera", authorName: "Rosa Martinez", isAnonymous: false, worthIt: true, overallRating: 4, contentQuality: 4, practicalValue: 5, engagement: 4, title: "Landed a data analyst role after completing this", body: "The capstone project is what made the difference in interviews. SQL and R sections are the strongest. Tableau portion could be deeper.", pros: ["Google credential", "Real capstone project", "Career support"], cons: ["Some sections too basic", "R instruction could be better"], verified: true, createdAt: "2026-04-15", upvotes: 345, downvotes: 22, userVote: null },
  { id: "13", courseId: "google-cybersecurity", courseName: "Google Cybersecurity Certificate", platform: "Coursera", authorName: "James Wright", isAnonymous: false, worthIt: true, overallRating: 4, contentQuality: 4, practicalValue: 4, engagement: 4, title: "Solid entry point into cybersecurity", body: "Great for career changers. Covers a wide range of topics. The hands-on labs with real tools (SIEM, Linux) are the highlight.", pros: ["Broad curriculum", "Hands-on labs", "Google credential"], cons: ["Needs more depth on networking", "Some labs feel guided"], verified: false, createdAt: "2026-03-28", upvotes: 198, downvotes: 15, userVote: null },
  { id: "14", courseId: "google-ai-intro", courseName: "Google Introduction to AI", platform: "Coursera", authorName: "Anika Patel", isAnonymous: false, worthIt: true, overallRating: 4, contentQuality: 4, practicalValue: 3, engagement: 4, title: "Best overview of AI for non-technical people", body: "Perfect starting point if you want to understand AI without diving into math. Great production quality and real-world examples.", pros: ["Accessible to everyone", "Google-quality production", "Free to audit"], cons: ["Too basic for developers", "No hands-on coding"], verified: true, createdAt: "2026-06-25", upvotes: 234, downvotes: 18, userVote: null },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "highest", label: "Highest Rated" },
  { value: "most-voted", label: "Most Helpful" },
  { value: "most-reviews", label: "Most Reviewed" },
] as const;

const RATING_FILTERS = [
  { value: null, label: "All Ratings" },
  { value: 5, label: "5 Stars" },
  { value: 4, label: "4+ Stars" },
  { value: 3, label: "3+ Stars" },
] as const;

const AGE_FILTERS = [
  { value: null, label: "All Time" },
  { value: 7, label: "Past Week" },
  { value: 30, label: "Past Month" },
  { value: 90, label: "Past 3 Months" },
  { value: 180, label: "Past 6 Months" },
] as const;

const ALL_PLATFORMS = [
  "Coursera", "Udemy", "edX", "YouTube", "Frontend Masters",
  "DeepLearning.AI", "DataTalks.Club", "Pluralsight", "LinkedIn Learning", "Skillshare", "Other",
];

export default function ReviewsPage() {
  const [courses] = useState<Course[]>(MOCK_COURSES);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("most-reviews");
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [ageFilter, setAgeFilter] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  const toast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2500);
  };

  const filteredCourses = courses
    .filter((c) => {
      const matchesSearch =
        !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesPlatform = !selectedPlatform || c.platform === selectedPlatform;
      const matchesRating = ratingFilter === null || c.avgRating >= ratingFilter;
      return matchesSearch && matchesPlatform && matchesRating;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return 0;
      if (sortBy === "highest") return b.avgRating - a.avgRating;
      if (sortBy === "most-voted") return b.avgWorthIt - a.avgWorthIt;
      return b.reviewCount - a.reviewCount;
    });

  const courseReviews = selectedCourse
    ? reviews
        .filter((r) => r.courseId === selectedCourse.id)
        .filter((r) => {
          if (ageFilter === null) return true;
          const d = new Date(r.createdAt);
          const now = new Date();
          return (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24) <= ageFilter;
        })
        .sort((a, b) => {
          if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          if (sortBy === "highest") return b.overallRating - a.overallRating;
          return b.upvotes - a.upvotes;
        })
    : [];

  const activeFilterCount = [selectedPlatform, ratingFilter, ageFilter].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedPlatform(null);
    setRatingFilter(null);
    setAgeFilter(null);
    setSearchQuery("");
    setSortBy("most-reviews");
  };

  const handleVote = useCallback(
    (reviewId: string, direction: "up" | "down") => {
      setReviews((prev) =>
        prev.map((r) => {
          if (r.id !== reviewId) return r;
          const currentVote = r.userVote;
          let newUpvotes = r.upvotes;
          let newDownvotes = r.downvotes;
          if (currentVote === direction) {
            if (direction === "up") newUpvotes--;
            else newDownvotes--;
            return { ...r, upvotes: newUpvotes, downvotes: newDownvotes, userVote: null };
          }
          if (currentVote === "up") newUpvotes--;
          if (currentVote === "down") newDownvotes--;
          if (direction === "up") newUpvotes++;
          else newDownvotes++;
          return { ...r, upvotes: newUpvotes, downvotes: newDownvotes, userVote: direction };
        })
      );
    },
    []
  );

  const handleSubmit = (data: ReviewFormData) => {
    if (!selectedCourse) return;
    const newReview: Review = {
      id: String(Date.now()),
      courseId: selectedCourse.id,
      courseName: selectedCourse.name,
      platform: selectedCourse.platform,
      authorName: data.isAnonymous ? "Anonymous" : "You",
      isAnonymous: data.isAnonymous,
      worthIt: Math.round(((data.contentQuality + data.practicalValue + data.engagement) / 15) * 100) >= 60,
      overallRating: Math.round(((data.contentQuality + data.practicalValue + data.engagement) / 15) * 5),
      contentQuality: data.contentQuality,
      practicalValue: data.practicalValue,
      engagement: data.engagement,
      title: data.title,
      body: data.body,
      pros: data.pros,
      cons: data.cons,
      verified: !!data.certificateUrl,
      certificateUrl: data.certificateUrl || undefined,
      createdAt: new Date().toISOString().split("T")[0],
      upvotes: 0,
      downvotes: 0,
      userVote: null,
    };
    setReviews((prev) => [newReview, ...prev]);
    setShowForm(false);
    toast("Review submitted successfully!");
  };

  if (selectedCourse) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
        <button
          onClick={() => { setSelectedCourse(null); setShowForm(false); }}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to courses
        </button>

        <Card>
          <PlatformLogo platform={selectedCourse.platform} size="xl" className="mb-4" />
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl font-bold">{selectedCourse.name}</h1>
              <p className="mt-1 text-xs text-muted">by {selectedCourse.instructor}</p>
              <p className="mt-2 text-sm text-muted">{selectedCourse.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {selectedCourse.tags.map((tag) => (<Badge key={tag}>{tag}</Badge>))}
              </div>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-surface-hover px-4 py-3 text-center shrink-0">
              <span className="text-2xl font-bold text-accent">{selectedCourse.avgWorthIt}%</span>
              <span className="text-xs font-medium text-muted">Worth It</span>
              <span className="text-xs text-muted">{selectedCourse.reviewCount.toLocaleString()} reviews</span>
            </div>
          </div>
          {selectedCourse.url && (
            <a href={selectedCourse.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover transition-colors">
              Visit course <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </Card>

        {/* Course-level filters */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Reviews</h2>
            <p className="text-sm text-muted">{courseReviews.length} honest {courseReviews.length === 1 ? "review" : "reviews"}</p>
          </div>
          <div className="flex items-center gap-2">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent">
              {SORT_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            <select value={ageFilter ?? ""} onChange={(e) => setAgeFilter(e.target.value ? Number(e.target.value) : null)} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent">
              {AGE_FILTERS.map((o) => (<option key={o.label} value={o.value ?? ""}>{o.label}</option>))}
            </select>
            <Button onClick={() => setShowForm(!showForm)} size="sm">
              {showForm ? <><X className="h-4 w-4" /> Cancel</> : <><Plus className="h-4 w-4" /> Write Review</>}
            </Button>
          </div>
        </div>

        {showForm && (
          <div className="mt-4">
            <ReviewForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
          </div>
        )}

        <div className="mt-4 space-y-4">
          {courseReviews.length === 0 ? (
            <Card className="py-12 text-center">
              <p className="text-muted">No reviews match your filters.</p>
            </Card>
          ) : (
            courseReviews.map((review) => (
              <ReviewCard key={review.id} review={review} onVote={handleVote} />
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
      {showToast && (
        <div className="fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 animate-fade-in rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-700 shadow-lg dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
          {showToast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Course Reviews</h1>
          <p className="mt-1 text-sm text-muted">Find a course, read honest reviews, decide if it&apos;s worth your time.</p>
        </div>
      </div>

      {/* Search */}
      <div className="mt-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses, instructors, or topics..."
            className="w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-3 text-sm outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>
      </div>

      {/* Filter bar */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
            showFilters || activeFilterCount > 0
              ? "border-accent bg-accent/5 text-accent"
              : "border-border text-muted hover:text-foreground hover:bg-surface-hover"
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] text-white">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Platform chips */}
        {ALL_PLATFORMS.slice(0, 6).map((p) => (
          <button
            key={p}
            onClick={() => setSelectedPlatform(selectedPlatform === p ? null : p)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200",
              selectedPlatform === p
                ? "bg-accent text-white shadow-sm"
                : "bg-surface-hover text-muted hover:text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-700"
            )}
          >
            {p}
          </button>
        ))}
        {ALL_PLATFORMS.length > 6 && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="rounded-full bg-surface-hover px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground"
          >
            +{ALL_PLATFORMS.length - 6} more
          </button>
        )}

        {activeFilterCount > 0 && (
          <button onClick={clearFilters} className="flex items-center gap-1 rounded-full bg-surface-hover px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground transition-colors">
            <RotateCcw className="h-3 w-3" /> Clear
          </button>
        )}
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <Card className="mt-3 animate-fade-in">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">Platform</label>
              <div className="flex flex-wrap gap-1.5">
                {ALL_PLATFORMS.map((p) => (
                  <button key={p} onClick={() => setSelectedPlatform(selectedPlatform === p ? null : p)}
                    className={cn("rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                      selectedPlatform === p ? "bg-accent text-white" : "bg-surface-hover text-muted hover:text-foreground"
                    )}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">Minimum Rating</label>
              <div className="flex flex-wrap gap-1.5">
                {RATING_FILTERS.map((r) => (
                  <button key={r.label} onClick={() => setRatingFilter(r.value)}
                    className={cn("rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                      ratingFilter === r.value ? "bg-accent text-white" : "bg-surface-hover text-muted hover:text-foreground"
                    )}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">Posted Within</label>
              <div className="flex flex-wrap gap-1.5">
                {AGE_FILTERS.map((a) => (
                  <button key={a.label} onClick={() => setAgeFilter(a.value)}
                    className={cn("rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                      ageFilter === a.value ? "bg-accent text-white" : "bg-surface-hover text-muted hover:text-foreground"
                    )}>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Sort bar */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-muted">{filteredCourses.length} courses</span>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent">
          {SORT_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
        </select>
      </div>

      {/* Course Grid */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {filteredCourses.length === 0 ? (
          <div className="col-span-2 py-16 text-center">
            <p className="text-muted">No courses match your filters.</p>
            <button onClick={clearFilters} className="mt-3 text-sm font-medium text-accent hover:text-accent-hover">Clear all filters</button>
          </div>
        ) : (
          filteredCourses.map((course) => (
            <button key={course.id} onClick={() => setSelectedCourse(course)} className="group text-left">
              <Card hover className="h-full transition-all duration-200 group-hover:border-accent/30">
                <PlatformLogo platform={course.platform} size="lg" className="mb-3" />
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold leading-snug group-hover:text-accent transition-colors">{course.name}</h3>
                    <p className="mt-1 text-xs text-muted">by {course.instructor}</p>
                  </div>
                  <div className="flex flex-col items-center shrink-0 rounded-lg border border-border bg-surface-hover px-3 py-2">
                    <span className="text-lg font-bold text-accent">{course.avgWorthIt}%</span>
                    <span className="text-[10px] text-muted">Worth It</span>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted line-clamp-2">{course.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {course.tags.slice(0, 2).map((tag) => (<Badge key={tag} className="text-[10px]">{tag}</Badge>))}
                  </div>
                  <span className="text-xs text-muted">{course.reviewCount.toLocaleString()} reviews</span>
                </div>
              </Card>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
