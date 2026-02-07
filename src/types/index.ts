// ─── Production Pipeline ────────────────────────────────────────────

export type PhaseStatus = "pending" | "in-progress" | "approved" | "needs-revision" | "completed";

export type PhaseName =
  | "initialization"
  | "scene-brief"
  | "brief-review"
  | "prose-generation"
  | "prose-review"
  | "finalization";

export interface Phase {
  name: PhaseName;
  label: string;
  status: PhaseStatus;
  startedAt?: string;
  completedAt?: string;
  output?: string;
  revisionNotes?: string;
  revisionCount: number;
}

export interface Production {
  id: string;
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  seriesId: string;
  seriesName: string;
  bookId: string;
  bookTitle: string;
  povCharacter: string;
  phases: Phase[];
  currentPhase: PhaseName;
  status: "active" | "completed" | "paused";
  startedAt: string;
  completedAt?: string;
  wordCount?: number;
}

// ─── Content Library ────────────────────────────────────────────────

export interface Series {
  id: string;
  name: string;
  description: string;
  genre: string;
  books: Book[];
  totalChapters: number;
  completedChapters: number;
}

export interface Book {
  id: string;
  seriesId: string;
  title: string;
  bookNumber: number;
  chapters: Chapter[];
  totalChapters: number;
  completedChapters: number;
}

export interface Chapter {
  id: string;
  bookId: string;
  seriesId: string;
  chapterNumber: number;
  title: string;
  povCharacter: string;
  status: "draft" | "in-production" | "completed" | "not-started";
  wordCount?: number;
  sceneBrief?: string;
  prose?: string;
  plotSummary?: string;
  characters: string[];
  location?: string;
  completedAt?: string;
}

// ─── Chapter Production Input ───────────────────────────────────────

export interface ChapterInput {
  seriesId: string;
  bookId: string;
  chapterNumber: number;
  povCharacter: string;
  plotSummary: string;
  characters: string[];
  location: string;
  notes: string;
}

// ─── Review ─────────────────────────────────────────────────────────

export interface ReviewChecklist {
  label: string;
  checked: boolean;
}

export interface ReviewItem {
  productionId: string;
  type: "scene-brief" | "prose";
  content: string;
  checklist: ReviewChecklist[];
  wordCount?: number;
}

// ─── Production Log ─────────────────────────────────────────────────

export interface LogEntry {
  id: string;
  productionId: string;
  timestamp: string;
  phase: PhaseName;
  action: string;
  details: string;
}

// ─── Dashboard Stats ────────────────────────────────────────────────

export interface DashboardStats {
  totalChaptersProduced: number;
  totalWordsWritten: number;
  approvalRate: number;
  activeProductions: number;
}
