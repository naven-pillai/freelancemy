"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, AlertCircle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import {
  analyzeContent,
  type AnalysisInput,
  type AnalysisResult,
  type Check,
  type CheckStatus,
  type CategoryResult,
} from "@/lib/content-analyzer";
import { fieldClass } from "./styles";

// ─── Types ──────────────────────────────────────────────────────────────────

type ContentScoreProps = Omit<AnalysisInput, "focusKeyword">;

// ─── Helpers ────────────────────────────────────────────────────────────────

function getScoreTheme(score: number) {
  if (score >= 80)
    return {
      text: "text-emerald-600",
      progressClass: "[&>div]:bg-emerald-500",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      ring: "stroke-emerald-500",
      label: "Good",
    };
  if (score >= 60)
    return {
      text: "text-amber-600",
      progressClass: "[&>div]:bg-amber-500",
      badge: "bg-amber-50 text-amber-700 border-amber-200",
      ring: "stroke-amber-500",
      label: "Needs work",
    };
  return {
    text: "text-red-500",
    progressClass: "[&>div]:bg-red-500",
    badge: "bg-red-50 text-red-700 border-red-200",
    ring: "stroke-red-500",
    label: "Poor",
  };
}

// ─── Score Ring ──────────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const theme = getScoreTheme(score);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2 py-2">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={radius} fill="none" stroke="currentColor" strokeWidth="7" className="text-gray-200" />
          <circle
            cx="44"
            cy="44"
            r={radius}
            fill="none"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circumference}`}
            className={cn("transition-all duration-700", theme.ring)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-2xl font-bold tabular-nums leading-none", theme.text)}>
            {score}
          </span>
          <span className="text-[10px] text-gray-500 font-medium mt-0.5">/ 100</span>
        </div>
      </div>
      <Badge className={cn("border text-xs font-semibold", theme.badge)} variant="outline">
        {theme.label}
      </Badge>
    </div>
  );
}

// ─── Mini Score Pill ─────────────────────────────────────────────────────────

function ScorePill({ score }: { score: number }) {
  const theme = getScoreTheme(score);
  return (
    <span className={cn("ml-1.5 text-xs font-bold tabular-nums", theme.text)}>{score}</span>
  );
}

// ─── Status Icon ─────────────────────────────────────────────────────────────

function StatusIcon({ status }: { status: CheckStatus }) {
  if (status === "pass")
    return <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />;
  if (status === "warning")
    return <AlertCircle size={14} className="text-amber-500 shrink-0" />;
  return <XCircle size={14} className="text-red-500 shrink-0" />;
}

// ─── Check Row ───────────────────────────────────────────────────────────────

function CheckRow({ check }: { check: Check }) {
  const [open, setOpen] = useState(false);
  const hasTip = !!check.suggestion && check.status !== "pass";

  return (
    <div>
      <button
        type="button"
        onClick={() => hasTip && setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-2 py-1.5 px-1 rounded-md w-full text-left transition-colors",
          hasTip ? "hover:bg-gray-100 cursor-pointer" : "cursor-default"
        )}
      >
        <StatusIcon status={check.status} />
        <span className="text-xs text-gray-700 flex-1 leading-snug">{check.label}</span>
        {hasTip && (
          <Info
            size={12}
            className={cn(
              "shrink-0 transition-colors",
              open ? "text-amber-500" : "text-gray-300"
            )}
          />
        )}
      </button>

      {open && check.suggestion && (
        <div className="ml-5 mb-1 text-xs text-gray-600 bg-amber-50 border border-amber-100 rounded-md px-2.5 py-2 leading-relaxed">
          {check.suggestion}
        </div>
      )}
    </div>
  );
}

// ─── Category Tab Panel ───────────────────────────────────────────────────────

function CategoryPanel({ result }: { result: CategoryResult }) {
  const theme = getScoreTheme(result.score);
  const passing = result.checks.filter((c) => c.status === "pass").length;
  const total = result.checks.length;

  return (
    <div className="space-y-3 pt-1">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {passing}/{total} checks passing
          </span>
          <span className={cn("font-bold tabular-nums", theme.text)}>{result.score}/100</span>
        </div>
        <Progress value={result.score} className={cn("h-1.5", theme.progressClass)} />
      </div>

      <Separator />

      <div className="space-y-0.5">
        {result.checks.map((check) => (
          <CheckRow key={check.id} check={check} />
        ))}
      </div>
    </div>
  );
}

// ─── Flesch Gauge ────────────────────────────────────────────────────────────

function fleschMeta(score: number) {
  if (score >= 80) return { label: "Very Easy", color: "text-emerald-600", bar: "[&>div]:bg-emerald-500" };
  if (score >= 70) return { label: "Fairly Easy", color: "text-emerald-600", bar: "[&>div]:bg-emerald-500" };
  if (score >= 60) return { label: "Standard", color: "text-amber-600", bar: "[&>div]:bg-amber-500" };
  if (score >= 50) return { label: "Fairly Difficult", color: "text-amber-600", bar: "[&>div]:bg-amber-500" };
  return { label: "Difficult", color: "text-red-500", bar: "[&>div]:bg-red-500" };
}

function FleschGauge({ score }: { score: number }) {
  const meta = fleschMeta(score);
  return (
    <div className="mt-2 mb-3 p-3 rounded-lg border border-gray-200 bg-gray-50 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-700">Flesch Reading Ease</span>
        <span className={cn("text-xs font-bold tabular-nums", meta.color)}>
          {score}/100 — {meta.label}
        </span>
      </div>
      <Progress value={score} className={cn("h-2", meta.bar)} />
      <div className="flex justify-between text-[10px] text-gray-400">
        <span>0 Difficult</span>
        <span>100 Very Easy</span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const STORAGE_KEY = (slug: string) => `content-score-kw:${slug || "__new__"}`;

const TAB_TRIGGER = "text-xs rounded-md px-1.5 py-1";

export default function ContentScore(props: ContentScoreProps) {
  const {
    content,
    title,
    slug,
    metaTitle,
    metaDescription,
    featuredImage,
    altText,
    canonicalUrl,
    schemaType,
    tags,
  } = props;

  const [input, setInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [activeKeyword, setActiveKeyword] = useState("");

  // Load persisted keywords on mount / slug change. Hydration is deferred to a
  // microtask so the state updates don't run synchronously in the effect body.
  useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (cancelled) return;
      try {
        const stored = localStorage.getItem(STORAGE_KEY(slug));
        if (!stored) return;
        const { keywords: kws, active } = JSON.parse(stored) as {
          keywords: string[];
          active: string;
        };
        if (Array.isArray(kws) && kws.length) {
          setKeywords(kws);
          setActiveKeyword(active || kws[0]);
        }
      } catch {
        /* ignore */
      }
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Persist whenever keywords or the active selection changes
  useEffect(() => {
    try {
      if (keywords.length > 0) {
        localStorage.setItem(STORAGE_KEY(slug), JSON.stringify({ keywords, active: activeKeyword }));
      } else {
        localStorage.removeItem(STORAGE_KEY(slug));
      }
    } catch {
      /* ignore */
    }
  }, [keywords, activeKeyword, slug]);

  function addKeyword() {
    const kw = input.trim();
    if (!kw || keywords.includes(kw)) {
      setInput("");
      return;
    }
    setKeywords([...keywords, kw]);
    setActiveKeyword(kw);
    setInput("");
  }

  function removeKeyword(kw: string) {
    const next = keywords.filter((k) => k !== kw);
    setKeywords(next);
    if (activeKeyword === kw) setActiveKeyword(next[next.length - 1] ?? "");
  }

  const result: AnalysisResult = useMemo(
    () =>
      analyzeContent({
        content,
        title,
        slug,
        metaTitle,
        metaDescription,
        featuredImage,
        altText,
        canonicalUrl,
        schemaType,
        tags,
        focusKeyword: activeKeyword,
      }),
    [content, title, slug, metaTitle, metaDescription, featuredImage, altText, canonicalUrl, schemaType, tags, activeKeyword]
  );

  return (
    <Card className="overflow-hidden border-gray-200 bg-white text-gray-900 shadow-sm">
      <CardHeader className="pb-3 px-4 pt-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Content Score</CardTitle>
          <Badge variant="outline" className="text-[10px] text-gray-500 font-normal">
            {result.wordCount} words · {result.readingTime} min
          </Badge>
        </div>
        <CardDescription className="text-xs text-gray-500">
          SEO · AIO · GEO · Readability analysis
        </CardDescription>
      </CardHeader>

      <CardContent className="px-4 pb-4 space-y-4">
        {/* Focus keyword input */}
        <div className="space-y-1.5">
          <Label className="text-xs text-gray-500">Focus Keywords</Label>
          <div className="flex gap-1.5">
            <Input
              placeholder="Type a keyword, press Enter…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addKeyword();
                }
                if (e.key === "Backspace" && !input && keywords.length) {
                  removeKeyword(keywords[keywords.length - 1]);
                }
              }}
              className={cn(fieldClass, "h-8 text-xs flex-1")}
            />
            <button
              type="button"
              onClick={addKeyword}
              disabled={!input.trim()}
              className="h-8 px-2.5 text-xs rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition-colors shrink-0"
            >
              Add
            </button>
          </div>

          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {keywords.map((kw) => (
                <span
                  key={kw}
                  className={cn(
                    "inline-flex items-center gap-1 text-[11px] rounded-full border transition-colors",
                    activeKeyword === kw
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setActiveKeyword(kw)}
                    className="pl-2 py-0.5"
                  >
                    {kw}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeKeyword(kw)}
                    aria-label={`Remove keyword ${kw}`}
                    className="pr-2 py-0.5 opacity-60 hover:opacity-100 leading-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {activeKeyword && (
            <p className="text-[11px] text-gray-400">
              Scoring against: <span className="font-medium text-gray-600">{activeKeyword}</span>
            </p>
          )}
        </div>

        {/* Overall score ring */}
        <div className="bg-gray-50 rounded-xl py-3">
          <ScoreRing score={result.overall} />
        </div>

        {/* Category tabs */}
        <Tabs defaultValue="seo">
          <TabsList className="w-full grid grid-cols-4 h-8 rounded-lg">
            <TabsTrigger value="seo" className={TAB_TRIGGER}>
              SEO <ScorePill score={result.seo.score} />
            </TabsTrigger>
            <TabsTrigger value="aio" className={TAB_TRIGGER}>
              AIO <ScorePill score={result.aio.score} />
            </TabsTrigger>
            <TabsTrigger value="geo" className={TAB_TRIGGER}>
              GEO <ScorePill score={result.geo.score} />
            </TabsTrigger>
            <TabsTrigger value="read" className={TAB_TRIGGER}>
              Read <ScorePill score={result.readability.score} />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="seo">
            <CategoryPanel result={result.seo} />
          </TabsContent>
          <TabsContent value="aio">
            <CategoryPanel result={result.aio} />
          </TabsContent>
          <TabsContent value="geo">
            <CategoryPanel result={result.geo} />
          </TabsContent>
          <TabsContent value="read">
            <FleschGauge score={result.fleschScore} />
            <CategoryPanel result={result.readability} />
          </TabsContent>
        </Tabs>

        {/* Legend */}
        <div className="flex justify-center gap-3 text-[10px] text-gray-500 pt-1">
          <span className="flex items-center gap-1">
            <CheckCircle2 size={10} className="text-emerald-500" /> Pass
          </span>
          <span className="flex items-center gap-1">
            <AlertCircle size={10} className="text-amber-500" /> Improve
          </span>
          <span className="flex items-center gap-1">
            <XCircle size={10} className="text-red-500" /> Fix
          </span>
          <span className="flex items-center gap-1">
            <Info size={10} /> Click for tip
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
