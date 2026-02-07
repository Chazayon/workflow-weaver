import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Search, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import type { Series, Book } from "@/types";
import { fetchSeries, fetchSeriesById } from "@/services/api";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } };

function SeriesGrid() {
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSeries().then(setSeriesList);
  }, []);

  const filtered = seriesList.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Library</h1>
        <p className="text-muted-foreground mt-1">Browse your series, books, and chapters.</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search series…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filtered.map((s) => {
          const pct = Math.round((s.completedChapters / s.totalChapters) * 100);
          return (
            <motion.div key={s.id} variants={item}>
              <Link to={`/library/${s.id}`}>
                <Card className="h-full hover:border-primary/30 transition-colors cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                        <BookOpen className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-display group-hover:text-primary transition-colors">
                          {s.name}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs mt-1">{s.genre}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <CardDescription className="line-clamp-2">{s.description}</CardDescription>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{s.completedChapters}/{s.totalChapters} chapters</span>
                        <span>{pct}%</span>
                      </div>
                      <Progress value={pct} className="h-1.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

function BookView({ series }: { series: Series }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/library" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">{series.name}</h1>
          <p className="text-muted-foreground mt-0.5">{series.description}</p>
        </div>
      </div>

      {series.books.map((book: Book) => (
        <div key={book.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">
              Book {book.bookNumber}: {book.title}
            </h2>
            <span className="text-sm text-muted-foreground">
              {book.completedChapters}/{book.totalChapters} chapters
            </span>
          </div>

          <div className="grid gap-2">
            {book.chapters.map((ch) => {
              const statusColors: Record<string, string> = {
                completed: "bg-success/15 text-success border-success/30",
                "in-production": "bg-info/15 text-info border-info/30",
                draft: "bg-warning/15 text-warning border-warning/30",
                "not-started": "bg-muted text-muted-foreground",
              };
              return (
                <Card key={ch.id} className="flex items-center gap-4 p-3">
                  <div className="h-8 w-8 rounded-md bg-secondary flex items-center justify-center text-sm font-medium shrink-0">
                    {ch.chapterNumber}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{ch.title}</p>
                    <p className="text-xs text-muted-foreground">
                      POV: {ch.povCharacter}
                      {ch.wordCount ? ` · ${ch.wordCount.toLocaleString()} words` : ""}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${statusColors[ch.status] ?? ""}`}
                  >
                    {ch.status.replace("-", " ")}
                  </Badge>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function LibraryPage() {
  const { seriesId } = useParams();
  const [series, setSeries] = useState<Series | null>(null);

  useEffect(() => {
    if (seriesId) {
      fetchSeriesById(seriesId).then((s) => setSeries(s ?? null));
    }
  }, [seriesId]);

  if (seriesId && series) {
    return <BookView series={series} />;
  }

  return <SeriesGrid />;
}
