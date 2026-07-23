"use client";

import { useState } from "react";
import { EyeOff, Eye, X, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { WorthItMeter } from "./WorthItMeter";
import { cn } from "@/lib/cn";
import { PLATFORMS } from "@/types";

const MAX_TITLE = 120;
const MAX_BODY = 5000;
const MAX_PRO_CON = 100;
const MAX_ITEMS = 10;

interface ReviewFormProps {
  onSubmit?: (data: ReviewFormData) => void;
  onCancel?: () => void;
}

export interface ReviewFormData {
  courseName: string;
  platform: string;
  title: string;
  body: string;
  contentQuality: number;
  practicalValue: number;
  engagement: number;
  pros: string[];
  cons: string[];
  isAnonymous: boolean;
  certificateUrl: string;
}

function RatingInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-all duration-150",
              n <= value
                ? "border-amber-300 bg-amber-50 text-amber-600 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                : "border-border text-muted hover:border-zinc-300 dark:hover:border-zinc-600"
            )}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ReviewForm({ onSubmit, onCancel }: ReviewFormProps) {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [platform, setPlatform] = useState("");
  const [pros, setPros] = useState<string[]>([]);
  const [cons, setCons] = useState<string[]>([]);
  const [proInput, setProInput] = useState("");
  const [conInput, setConInput] = useState("");
  const [contentQuality, setContentQuality] = useState(3);
  const [practicalValue, setPracticalValue] = useState(3);
  const [engagement, setEngagement] = useState(3);
  const [courseName, setCourseName] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [certificateUrl, setCertificateUrl] = useState("");

  const worthItPct = Math.round(((contentQuality + practicalValue + engagement) / 15) * 100);

  const addItem = (
    input: string,
    setInput: (v: string) => void,
    setList: (v: string[]) => void,
    list: string[]
  ) => {
    if (input.trim() && list.length < MAX_ITEMS && input.trim().length <= MAX_PRO_CON) {
      setList([...list, input.trim()]);
      setInput("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim() || !title.trim() || !body.trim()) return;
    onSubmit?.({
      courseName: courseName.trim().slice(0, 200),
      platform,
      title: title.trim().slice(0, MAX_TITLE),
      body: body.trim().slice(0, MAX_BODY),
      contentQuality,
      practicalValue,
      engagement,
      pros: pros.slice(0, MAX_ITEMS),
      cons: cons.slice(0, MAX_ITEMS),
      isAnonymous,
      certificateUrl,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Write a Review</h2>
          <button
            type="button"
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all duration-200",
              isAnonymous
                ? "border-indigo-300 bg-indigo-50 text-indigo-600 dark:border-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400"
                : "border-border text-muted hover:text-foreground"
            )}
          >
            {isAnonymous ? (
              <EyeOff className="h-3.5 w-3.5" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}
            {isAnonymous ? "Anonymous" : "Public"}
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Course Name</label>
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="e.g. Machine Learning Specialization"
                maxLength={200}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
              >
                <option value="">Select platform</option>
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Review Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience in a sentence"
              maxLength={MAX_TITLE}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Your Review</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              maxLength={MAX_BODY}
              placeholder="Share your detailed experience with this course..."
              className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <RatingInput
              label="Content Quality"
              value={contentQuality}
              onChange={setContentQuality}
            />
            <RatingInput
              label="Practical Value"
              value={practicalValue}
              onChange={setPracticalValue}
            />
            <RatingInput
              label="Engagement"
              value={engagement}
              onChange={setEngagement}
            />
          </div>

          <div className="flex items-center gap-4 rounded-lg border border-border bg-surface-hover p-4">
            <WorthItMeter percentage={worthItPct} size="md" />
            <div>
              <p className="text-sm font-medium">Your Worth-It Score</p>
              <p className="mt-0.5 text-xs text-muted">
                Calculated from your ratings above.{" "}
                {worthItPct >= 60
                  ? "This course looks worth it!"
                  : "This course may not be the best use of your time."}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Pros
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={proInput}
                  onChange={(e) => setProInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addItem(proInput, setProInput, setPros, pros);
                    }
                  }}
                  placeholder="Add a pro"
                  maxLength={MAX_PRO_CON}
                  className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => addItem(proInput, setProInput, setPros, pros)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {pros.map((pro, i) => (
                  <Badge key={i} variant="success">
                    + {pro}
                    <button
                      type="button"
                      onClick={() => setPros(pros.filter((_, j) => j !== i))}
                      className="ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-red-500 dark:text-red-400">
                Cons
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={conInput}
                  onChange={(e) => setConInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addItem(conInput, setConInput, setCons, cons);
                    }
                  }}
                  placeholder="Add a con"
                  maxLength={MAX_PRO_CON}
                  className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => addItem(conInput, setConInput, setCons, cons)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {cons.map((con, i) => (
                  <Badge key={i} variant="danger">
                    − {con}
                    <button
                      type="button"
                      onClick={() => setCons(cons.filter((_, j) => j !== i))}
                      className="ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Certificate URL{" "}
              <span className="text-muted font-normal">(optional — for verification)</span>
            </label>
            <input
              type="url"
              value={certificateUrl}
              onChange={(e) => setCertificateUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
            />
            {certificateUrl && (
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                <Check className="h-3 w-3" />
                Will be marked as verified
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-4">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">Submit Review</Button>
        </div>
      </Card>
    </form>
  );
}
