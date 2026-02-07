import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  TrendingUp,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { DashboardStats, Production, Series } from "@/types";
import {
  fetchDashboardStats,
  fetchActiveProductions,
  fetchSeries,
  fetchCompletedProductions,
} from "@/services/api";
import { PhaseStatusBadge } from "@/components/PhaseStatusBadge";

const statCards = [
  { key: "totalChaptersProduced" as const, label: "Chapters Produced", icon: FileText },
  { key: "totalWordsWritten" as const, label: "Words Written", icon: BookOpen },
  { key: "approvalRate" as const, label: "Approval Rate", icon: TrendingUp, suffix: "%" },
  { key: "activeProductions" as const, label: "Active Productions", icon: Zap },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeProds, setActiveProds] = useState<Production[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [completed, setCompleted] = useState<Production[]>([]);

  useEffect(() => {
    Promise.all([
      fetchDashboardStats(),
      fetchActiveProductions(),
      fetchSeries(),
      fetchCompletedProductions(),
    ]).then(([s, a, sr, c]) => {
      setStats(s);
      setActiveProds(a);
      setSeries(sr);
      setCompleted(c);
    });
  }, []);

  if (!stats) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Your book production at a glance.</p>
      </div>

      {/* Quick Stats */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {statCards.map((s) => (
          <motion.div key={s.key} variants={item}>
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {s.label}
                </CardTitle>
                <s.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-display">
                  {s.key === "totalWordsWritten"
                    ? stats[s.key].toLocaleString()
                    : stats[s.key]}
                  {s.suffix ?? ""}
                </div>
              </CardContent>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Active Productions */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold">Active Productions</h2>
          <Link
            to="/pipeline"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View pipeline <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {activeProds.map((prod) => (
            <Card key={prod.id} className="hover:glow-primary transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base font-display">
                      {prod.seriesName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {prod.bookTitle} · {prod.chapterTitle}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    POV: {prod.povCharacter}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 flex-wrap">
                  {prod.phases.map((phase) => (
                    <PhaseStatusBadge key={phase.name} phase={phase} compact />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Series Progress */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold">Series Progress</h2>
          <Link
            to="/library"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            Browse library <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {series.map((s) => {
            const pct = Math.round((s.completedChapters / s.totalChapters) * 100);
            return (
              <Link key={s.id} to={`/library/${s.id}`}>
                <Card className="hover:border-primary/30 transition-colors cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-display">{s.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{s.genre}</p>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {s.completedChapters}/{s.totalChapters} chapters
                      </span>
                      <span className="font-medium">{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Completions */}
      <section>
        <h2 className="font-display text-xl font-semibold mb-4">Recent Completions</h2>
        {completed.length === 0 ? (
          <p className="text-sm text-muted-foreground">No completed productions yet.</p>
        ) : (
          <div className="grid gap-3">
            {completed.map((prod) => (
              <Card key={prod.id} className="flex items-center gap-4 p-4">
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {prod.seriesName} · {prod.chapterTitle}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {prod.wordCount?.toLocaleString()} words · POV: {prod.povCharacter}
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs shrink-0">
                  Completed
                </Badge>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
