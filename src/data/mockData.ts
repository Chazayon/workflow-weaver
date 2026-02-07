import type {
  Series,
  Production,
  DashboardStats,
  LogEntry,
  Phase,
} from "@/types";

// ─── Helper ─────────────────────────────────────────────────────────

const makePhases = (
  currentIndex: number,
  overrides?: Partial<Record<number, Partial<Phase>>>
): Phase[] => {
  const labels: { name: Phase["name"]; label: string }[] = [
    { name: "initialization", label: "Initialization" },
    { name: "scene-brief", label: "Scene Brief" },
    { name: "brief-review", label: "Brief Review" },
    { name: "prose-generation", label: "Prose Generation" },
    { name: "prose-review", label: "Prose Review" },
    { name: "finalization", label: "Finalization" },
  ];

  return labels.map((p, i) => ({
    ...p,
    status:
      i < currentIndex
        ? "completed"
        : i === currentIndex
        ? "in-progress"
        : "pending",
    revisionCount: 0,
    ...overrides?.[i],
  }));
};

// ─── Series & Books ─────────────────────────────────────────────────

export const mockSeries: Series[] = [
  {
    id: "s1",
    name: "Sanctuary of the Damned",
    description:
      "A dark romance fantasy where fallen angels and cursed humans forge forbidden alliances in a crumbling sanctuary between worlds.",
    genre: "Dark Romance Fantasy",
    totalChapters: 24,
    completedChapters: 8,
    books: [
      {
        id: "b1",
        seriesId: "s1",
        title: "Ashes & Altars",
        bookNumber: 1,
        totalChapters: 24,
        completedChapters: 8,
        chapters: Array.from({ length: 24 }, (_, i) => ({
          id: `b1-ch${i + 1}`,
          bookId: "b1",
          seriesId: "s1",
          chapterNumber: i + 1,
          title: `Chapter ${i + 1}`,
          povCharacter: i % 2 === 0 ? "Seraphina" : "Kael",
          status:
            i < 8
              ? "completed"
              : i === 8
              ? "in-production"
              : "not-started",
          wordCount: i < 8 ? 3200 + Math.floor(Math.random() * 800) : undefined,
          characters: ["Seraphina", "Kael", "Morrigan"],
          location: i % 3 === 0 ? "The Sanctuary" : i % 3 === 1 ? "The Ashfields" : "The Veilgate",
          plotSummary:
            i < 8
              ? "Seraphina uncovers a hidden passage beneath the altar that reveals the sanctuary's true purpose."
              : undefined,
        })),
      },
    ],
  },
  {
    id: "s2",
    name: "Pactbound",
    description:
      "When a mortal woman accidentally binds herself to a fae warlord, their reluctant alliance ignites a war — and an impossible desire.",
    genre: "Fae Romance Fantasy",
    totalChapters: 20,
    completedChapters: 3,
    books: [
      {
        id: "b2",
        seriesId: "s2",
        title: "The Binding Thorn",
        bookNumber: 1,
        totalChapters: 20,
        completedChapters: 3,
        chapters: Array.from({ length: 20 }, (_, i) => ({
          id: `b2-ch${i + 1}`,
          bookId: "b2",
          seriesId: "s2",
          chapterNumber: i + 1,
          title: `Chapter ${i + 1}`,
          povCharacter: i % 2 === 0 ? "Elara" : "Thorne",
          status: i < 3 ? "completed" : "not-started",
          wordCount: i < 3 ? 2900 + Math.floor(Math.random() * 600) : undefined,
          characters: ["Elara", "Thorne", "Vesper"],
          location: "The Thornwood",
        })),
      },
    ],
  },
  {
    id: "s3",
    name: "Gilded Shadows",
    description:
      "In a glittering court where magic is currency, a disgraced noblewoman and a shadow assassin must fake a romance to survive — until it stops being fake.",
    genre: "Court Romance Fantasy",
    totalChapters: 22,
    completedChapters: 0,
    books: [
      {
        id: "b3",
        seriesId: "s3",
        title: "Masque of Thorns",
        bookNumber: 1,
        totalChapters: 22,
        completedChapters: 0,
        chapters: Array.from({ length: 22 }, (_, i) => ({
          id: `b3-ch${i + 1}`,
          bookId: "b3",
          seriesId: "s3",
          chapterNumber: i + 1,
          title: `Chapter ${i + 1}`,
          povCharacter: i % 2 === 0 ? "Isolde" : "Dain",
          status: "not-started" as const,
          characters: ["Isolde", "Dain", "Queen Aveline"],
          location: "The Gilded Court",
        })),
      },
    ],
  },
];

// ─── Active Productions ─────────────────────────────────────────────

export const mockProductions: Production[] = [
  {
    id: "prod-1",
    chapterId: "b1-ch9",
    chapterNumber: 9,
    chapterTitle: "Chapter 9",
    seriesId: "s1",
    seriesName: "Sanctuary of the Damned",
    bookId: "b1",
    bookTitle: "Ashes & Altars",
    povCharacter: "Seraphina",
    currentPhase: "prose-generation",
    status: "active",
    startedAt: "2026-02-07T08:30:00Z",
    phases: makePhases(3),
    wordCount: 1800,
  },
  {
    id: "prod-2",
    chapterId: "b2-ch4",
    chapterNumber: 4,
    chapterTitle: "Chapter 4",
    seriesId: "s2",
    seriesName: "Pactbound",
    bookId: "b2",
    bookTitle: "The Binding Thorn",
    povCharacter: "Elara",
    currentPhase: "brief-review",
    status: "active",
    startedAt: "2026-02-07T10:15:00Z",
    phases: makePhases(2, {
      2: { status: "needs-revision", revisionCount: 1, revisionNotes: "Scene brief missing sensory details in the Thornwood entrance. Add scent and sound cues." },
    }),
  },
];

export const mockCompletedProductions: Production[] = [
  {
    id: "prod-0",
    chapterId: "b1-ch8",
    chapterNumber: 8,
    chapterTitle: "Chapter 8",
    seriesId: "s1",
    seriesName: "Sanctuary of the Damned",
    bookId: "b1",
    bookTitle: "Ashes & Altars",
    povCharacter: "Kael",
    currentPhase: "finalization",
    status: "completed",
    startedAt: "2026-02-06T14:00:00Z",
    completedAt: "2026-02-06T18:45:00Z",
    phases: makePhases(6),
    wordCount: 3450,
  },
];

// ─── Dashboard Stats ────────────────────────────────────────────────

export const mockStats: DashboardStats = {
  totalChaptersProduced: 11,
  totalWordsWritten: 37_420,
  approvalRate: 92,
  activeProductions: 2,
};

// ─── Log Entries ────────────────────────────────────────────────────

export const mockLogs: LogEntry[] = [
  {
    id: "log-1",
    productionId: "prod-1",
    timestamp: "2026-02-07T08:30:00Z",
    phase: "initialization",
    action: "Production started",
    details: "Chapter 9 of Ashes & Altars — POV: Seraphina",
  },
  {
    id: "log-2",
    productionId: "prod-1",
    timestamp: "2026-02-07T08:32:00Z",
    phase: "scene-brief",
    action: "Scene brief generated",
    details: "2,400 words. All sections present.",
  },
  {
    id: "log-3",
    productionId: "prod-1",
    timestamp: "2026-02-07T08:35:00Z",
    phase: "brief-review",
    action: "Scene brief approved",
    details: "Checklist passed. Moving to prose generation.",
  },
  {
    id: "log-4",
    productionId: "prod-1",
    timestamp: "2026-02-07T08:40:00Z",
    phase: "prose-generation",
    action: "Prose generation in progress",
    details: "Currently at 1,800 words. Target: 3,500.",
  },
  {
    id: "log-5",
    productionId: "prod-2",
    timestamp: "2026-02-07T10:15:00Z",
    phase: "initialization",
    action: "Production started",
    details: "Chapter 4 of The Binding Thorn — POV: Elara",
  },
  {
    id: "log-6",
    productionId: "prod-2",
    timestamp: "2026-02-07T10:20:00Z",
    phase: "scene-brief",
    action: "Scene brief generated",
    details: "1,900 words. Missing sensory details flagged.",
  },
  {
    id: "log-7",
    productionId: "prod-2",
    timestamp: "2026-02-07T10:25:00Z",
    phase: "brief-review",
    action: "Revision requested",
    details: "Scene brief sent back for revision — missing sensory cues in Thornwood entrance.",
  },
];
