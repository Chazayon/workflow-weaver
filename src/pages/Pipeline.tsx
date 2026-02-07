import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PhaseStatusBadge } from "@/components/PhaseStatusBadge";
import type { Production } from "@/types";
import { fetchActiveProductions } from "@/services/api";
import { cn } from "@/lib/utils";
import {
  Zap,
  FileText,
  Eye,
  PenLine,
  Search,
  CheckCircle2,
} from "lucide-react";

const phaseIcons: Record<string, React.ElementType> = {
  initialization: Zap,
  "scene-brief": FileText,
  "brief-review": Eye,
  "prose-generation": PenLine,
  "prose-review": Search,
  finalization: CheckCircle2,
};

export default function Pipeline() {
  const [productions, setProductions] = useState<Production[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetchActiveProductions().then((prods) => {
      setProductions(prods);
      if (prods.length > 0) setSelected(prods[0].id);
    });
  }, []);

  const activeProd = productions.find((p) => p.id === selected);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Pipeline</h1>
        <p className="text-muted-foreground mt-1">Track chapter production through each phase.</p>
      </div>

      {/* Production selector */}
      {productions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {productions.map((prod) => (
            <button
              key={prod.id}
              onClick={() => setSelected(prod.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm border transition-colors",
                selected === prod.id
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border hover:border-primary/30"
              )}
            >
              {prod.seriesName} · Ch. {prod.chapterNumber}
            </button>
          ))}
        </div>
      )}

      {activeProd && (
        <motion.div
          key={activeProd.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {/* Phase pipeline */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="font-display text-lg">
                  {activeProd.bookTitle} — {activeProd.chapterTitle}
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  POV: {activeProd.povCharacter}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Visual pipeline */}
              <div className="flex items-center gap-0 overflow-x-auto pb-2">
                {activeProd.phases.map((phase, i) => {
                  const Icon = phaseIcons[phase.name] ?? Zap;
                  const isActive = phase.status === "in-progress";
                  const isRevision = phase.status === "needs-revision";
                  const isDone = phase.status === "completed" || phase.status === "approved";
                  return (
                    <div key={phase.name} className="flex items-center">
                      <div
                        className={cn(
                          "flex flex-col items-center gap-1.5 px-3 py-3 rounded-lg min-w-[100px] transition-colors",
                          isActive && "bg-info/10 ring-1 ring-info/30",
                          isRevision && "bg-warning/10 ring-1 ring-warning/30",
                          isDone && "bg-success/5",
                        )}
                      >
                        <div
                          className={cn(
                            "h-9 w-9 rounded-full flex items-center justify-center",
                            isDone && "bg-success/20 text-success",
                            isActive && "bg-info/20 text-info",
                            isRevision && "bg-warning/20 text-warning",
                            !isDone && !isActive && !isRevision && "bg-muted text-muted-foreground"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-[11px] font-medium text-center leading-tight">
                          {phase.label}
                        </span>
                        <PhaseStatusBadge phase={phase} />
                        {phase.revisionCount > 0 && (
                          <span className="text-[10px] text-warning">
                            {phase.revisionCount} revision{phase.revisionCount > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                      {i < activeProd.phases.length - 1 && (
                        <div
                          className={cn(
                            "h-px w-6 shrink-0",
                            isDone ? "bg-success/40" : "bg-border"
                          )}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Revision notes */}
              {activeProd.phases.some((p) => p.revisionNotes) && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-warning">Revision Notes</h3>
                    {activeProd.phases
                      .filter((p) => p.revisionNotes)
                      .map((p) => (
                        <div
                          key={p.name}
                          className="text-sm bg-warning/5 border border-warning/20 rounded-md p-3"
                        >
                          <span className="font-medium">{p.label}:</span>{" "}
                          {p.revisionNotes}
                        </div>
                      ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {productions.length === 0 && (
        <Card className="flex items-center justify-center p-12">
          <p className="text-muted-foreground text-sm">No active productions. Start a new chapter to see the pipeline.</p>
        </Card>
      )}
    </div>
  );
}
