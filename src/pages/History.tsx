import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LogEntry } from "@/types";
import { fetchProductionLogs } from "@/services/api";

const phaseColors: Record<string, string> = {
  initialization: "bg-info/15 text-info border-info/30",
  "scene-brief": "bg-primary/15 text-primary border-primary/30",
  "brief-review": "bg-warning/15 text-warning border-warning/30",
  "prose-generation": "bg-accent/15 text-accent border-accent/30",
  "prose-review": "bg-warning/15 text-warning border-warning/30",
  finalization: "bg-success/15 text-success border-success/30",
};

export default function History() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    fetchProductionLogs().then(setLogs);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Production History</h1>
          <p className="text-muted-foreground mt-1">Timeline of all production activity.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Download className="h-4 w-4" /> Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-0">
              {logs.map((log, i) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="relative pl-10 py-3"
                >
                  {/* Dot */}
                  <div className="absolute left-[11px] top-[18px] h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background" />

                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{log.action}</p>
                      <p className="text-xs text-muted-foreground">{log.details}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${phaseColors[log.phase] ?? ""}`}
                      >
                        {log.phase.replace("-", " ")}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(log.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
