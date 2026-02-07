import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, RotateCcw, FileText, PenLine } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Production, ReviewChecklist } from "@/types";
import { fetchActiveProductions, approvePhase, requestRevision } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const sceneBriefChecklist: ReviewChecklist[] = [
  { label: "All sections present (setup, conflict, resolution)", checked: false },
  { label: "Action beats are pure and specific", checked: false },
  { label: "Sensory details included", checked: false },
  { label: "Continuity callbacks present", checked: false },
  { label: "Ship vibes / romantic tension woven in", checked: false },
];

const proseChecklist: ReviewChecklist[] = [
  { label: "Voice consistency with POV character", checked: false },
  { label: "Word count within target range", checked: false },
  { label: "Emotional beats land correctly", checked: false },
  { label: "Dialogue sounds natural and distinct", checked: false },
  { label: "Pacing matches scene brief intent", checked: false },
];

export default function Review() {
  const { toast } = useToast();
  const [productions, setProductions] = useState<Production[]>([]);
  const [briefChecks, setBriefChecks] = useState(sceneBriefChecklist);
  const [proseChecks, setProseChecks] = useState(proseChecklist);
  const [revisionNotes, setRevisionNotes] = useState("");
  const [activeTab, setActiveTab] = useState("scene-brief");

  useEffect(() => {
    fetchActiveProductions().then(setProductions);
  }, []);

  const reviewable = productions.filter(
    (p) => p.currentPhase === "brief-review" || p.currentPhase === "prose-review"
  );

  const toggleCheck = (
    list: ReviewChecklist[],
    setter: (v: ReviewChecklist[]) => void,
    idx: number
  ) => {
    setter(list.map((c, i) => (i === idx ? { ...c, checked: !c.checked } : c)));
  };

  const handleApprove = async (prod: Production) => {
    await approvePhase(prod.id, prod.currentPhase);
    toast({ title: "Phase approved", description: `Moving ${prod.chapterTitle} to the next phase.` });
  };

  const handleRevision = async (prod: Production) => {
    if (!revisionNotes.trim()) {
      toast({ title: "Notes required", description: "Please add revision notes.", variant: "destructive" });
      return;
    }
    await requestRevision(prod.id, prod.currentPhase, revisionNotes);
    toast({ title: "Revision requested", description: "The agent will revise and resubmit." });
    setRevisionNotes("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Review & Approve</h1>
        <p className="text-muted-foreground mt-1">Quality control checkpoints for your productions.</p>
      </div>

      {reviewable.length === 0 ? (
        <Card className="flex items-center justify-center p-12">
          <p className="text-muted-foreground text-sm">No items awaiting review right now.</p>
        </Card>
      ) : (
        reviewable.map((prod) => (
          <motion.div
            key={prod.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="font-display text-lg">
                      {prod.seriesName} · {prod.chapterTitle}
                    </CardTitle>
                    <CardDescription>
                      {prod.bookTitle} — POV: {prod.povCharacter}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs bg-warning/15 text-warning border-warning/30"
                  >
                    Awaiting Review
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="scene-brief" className="gap-1.5">
                      <FileText className="h-3.5 w-3.5" /> Scene Brief
                    </TabsTrigger>
                    <TabsTrigger value="prose" className="gap-1.5">
                      <PenLine className="h-3.5 w-3.5" /> Prose
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="scene-brief" className="space-y-4 mt-4">
                    <div className="rounded-lg border bg-muted/30 p-4">
                      <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
                        {prod.phases.find((p) => p.name === "scene-brief")?.output ??
                          "Scene brief content will appear here once generated. The brief includes setup, conflict, resolution structure, action beats, sensory details, continuity callbacks, and romantic tension beats for this chapter."}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Review Checklist</h4>
                      {briefChecks.map((c, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Checkbox
                            checked={c.checked}
                            onCheckedChange={() => toggleCheck(briefChecks, setBriefChecks, i)}
                          />
                          <label className="text-sm">{c.label}</label>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="prose" className="space-y-4 mt-4">
                    <div className="rounded-lg border bg-muted/30 p-4">
                      <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
                        {prod.phases.find((p) => p.name === "prose-generation")?.output ??
                          "Prose content will appear here once generated. You'll be able to review the full chapter prose, check voice consistency markers, and verify word count against targets."}
                      </p>
                      {prod.wordCount && (
                        <p className="text-xs text-muted-foreground mt-3">
                          Word count: {prod.wordCount.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Review Checklist</h4>
                      {proseChecks.map((c, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Checkbox
                            checked={c.checked}
                            onCheckedChange={() => toggleCheck(proseChecks, setProseChecks, i)}
                          />
                          <label className="text-sm">{c.label}</label>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Revision notes */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Revision Notes</label>
                  <Textarea
                    value={revisionNotes}
                    onChange={(e) => setRevisionNotes(e.target.value)}
                    placeholder="Flag specific passages, reference call sheet sections, or add general notes…"
                    rows={3}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button onClick={() => handleApprove(prod)} className="gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Approve
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleRevision(prod)}
                    className="gap-1.5 text-warning hover:text-warning"
                  >
                    <RotateCcw className="h-4 w-4" /> Request Revision
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))
      )}
    </div>
  );
}
