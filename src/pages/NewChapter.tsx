import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, BookOpen, User, MapPin, Users, StickyNote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Series } from "@/types";
import { fetchSeries, startChapterProduction } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export default function NewChapter() {
  const { toast } = useToast();
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState("");
  const [selectedBookId, setSelectedBookId] = useState("");
  const [chapterNumber, setChapterNumber] = useState("");
  const [povCharacter, setPovCharacter] = useState("");
  const [plotSummary, setPlotSummary] = useState("");
  const [characters, setCharacters] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSeries().then(setSeriesList);
  }, []);

  const selectedSeries = seriesList.find((s) => s.id === selectedSeriesId);
  const books = selectedSeries?.books ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeriesId || !selectedBookId || !chapterNumber || !povCharacter || !plotSummary) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await startChapterProduction({
        seriesId: selectedSeriesId,
        bookId: selectedBookId,
        chapterNumber: parseInt(chapterNumber),
        povCharacter,
        plotSummary,
        characters: characters.split(",").map((c) => c.trim()).filter(Boolean),
        location,
        notes,
      });
      toast({ title: "Production started!", description: `Chapter ${chapterNumber} is now in the pipeline.` });
    } catch {
      toast({ title: "Error", description: "Failed to start production.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">New Chapter</h1>
        <p className="text-muted-foreground mt-1">Kick off a new chapter production run.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Chapter Details</CardTitle>
            <CardDescription>Configure the chapter input for your agents.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" /> Series *
                  </Label>
                  <Select value={selectedSeriesId} onValueChange={(v) => { setSelectedSeriesId(v); setSelectedBookId(""); }}>
                    <SelectTrigger><SelectValue placeholder="Select series" /></SelectTrigger>
                    <SelectContent>
                      {seriesList.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" /> Book *
                  </Label>
                  <Select value={selectedBookId} onValueChange={setSelectedBookId} disabled={!selectedSeriesId}>
                    <SelectTrigger><SelectValue placeholder="Select book" /></SelectTrigger>
                    <SelectContent>
                      {books.map((b) => (
                        <SelectItem key={b.id} value={b.id}>Book {b.bookNumber}: {b.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Chapter Number *</Label>
                  <Input
                    type="number"
                    min={1}
                    value={chapterNumber}
                    onChange={(e) => setChapterNumber(e.target.value)}
                    placeholder="e.g. 9"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" /> POV Character *
                  </Label>
                  <Input
                    value={povCharacter}
                    onChange={(e) => setPovCharacter(e.target.value)}
                    placeholder="e.g. Seraphina"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Plot Summary *</Label>
                <Textarea
                  value={plotSummary}
                  onChange={(e) => setPlotSummary(e.target.value)}
                  placeholder="Describe the key events, emotional beats, and turning points for this chapter…"
                  rows={4}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" /> Characters
                  </Label>
                  <Input
                    value={characters}
                    onChange={(e) => setCharacters(e.target.value)}
                    placeholder="Comma-separated: Seraphina, Kael, Morrigan"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> Location
                  </Label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. The Sanctuary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <StickyNote className="h-3.5 w-3.5" /> Notes
                </Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions for the agents…"
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? "Starting…" : "Start Production"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
