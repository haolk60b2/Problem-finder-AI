import { DatabaseZap, Radar, Upload } from "lucide-react";
import {
  ActionLink,
  AppFrame,
  Card,
  Pill,
  SectionHeading,
  Shell
} from "@/components/ui";

const sourceOptions = [
  { label: "Reddit", note: "Fastest real-source MVP connector" },
  { label: "CSV Upload", note: "Bring your own reviews, comments, or support tickets" },
  { label: "App Reviews", note: "Good second-step source after MVP" },
  { label: "YouTube Comments", note: "Useful for creator and education niches" }
];

export default function NewAnalysisPage() {
  return (
    <Shell>
      <AppFrame className="space-y-10 pb-20 pt-10">
        <SectionHeading
          eyebrow="New Analysis"
          title="Capture the niche, sources, and search direction in one deliberate form."
          description="This page is wired as the primary intake step for the MVP. It keeps the surface area tight while leaving room for more connectors later."
        />

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm uppercase tracking-[0.2em] text-moss/60">Niche</span>
                <input
                  defaultValue="Logistics cho shop online"
                  className="w-full rounded-3xl border border-moss/15 bg-white/80 px-4 py-4 outline-none ring-0"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm uppercase tracking-[0.2em] text-moss/60">Keyword</span>
                <input
                  defaultValue="dia chi sai, phan tuyen, giao hang cham"
                  className="w-full rounded-3xl border border-moss/15 bg-white/80 px-4 py-4 outline-none ring-0"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm uppercase tracking-[0.2em] text-moss/60">Language</span>
                <select className="w-full rounded-3xl border border-moss/15 bg-white/80 px-4 py-4 outline-none">
                  <option>Vietnamese</option>
                  <option>English</option>
                  <option>Mixed</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm uppercase tracking-[0.2em] text-moss/60">
                  Date Range
                </span>
                <select className="w-full rounded-3xl border border-moss/15 bg-white/80 px-4 py-4 outline-none">
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>Last 12 months</option>
                </select>
              </label>
            </div>

            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.2em] text-moss/60">Sources</p>
              <div className="grid gap-4 md:grid-cols-2">
                {sourceOptions.map((source) => (
                  <div
                    key={source.label}
                    className="rounded-3xl border border-moss/10 bg-white/70 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-display text-2xl">{source.label}</p>
                      <input type="checkbox" defaultChecked className="h-4 w-4 accent-emerald-800" />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-ink/68">{source.note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-4xl border border-dashed border-moss/20 bg-mist/35 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white">
                  <Upload className="h-5 w-5 text-ember" />
                </div>
                <div className="space-y-2">
                  <p className="font-display text-2xl">CSV Upload</p>
                  <p className="max-w-xl text-sm leading-7 text-ink/70">
                    Drag in exported reviews, support tickets, or community comments. The MVP can
                    rely on CSV heavily and still look strong in demos.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <ActionLink href="/analysis/report-logistics-vn" variant="primary">
                Run sample analysis
              </ActionLink>
              <ActionLink href="/" variant="secondary">
                Back to overview
              </ActionLink>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="bg-ink text-paper">
              <div className="space-y-4">
                <Pill tone="warm">MVP guardrails</Pill>
                <h2 className="font-display text-4xl">Keep the first version narrow and sharp.</h2>
                <div className="space-y-4 text-sm leading-7 text-paper/78">
                  <p>Start with Reddit and CSV.</p>
                  <p>Show evidence and links for every pain cluster.</p>
                  <p>Make ranking obvious enough that users can decide what to build next.</p>
                </div>
              </div>
            </Card>

            <Card className="space-y-5">
              <div className="flex items-center gap-3">
                <DatabaseZap className="h-5 w-5 text-moss" />
                <p className="font-display text-2xl">Pipeline shape</p>
              </div>
              {[
                "Collect posts or upload CSV",
                "Normalize, dedupe, and chunk",
                "Extract pain, intent, and evidence",
                "Cluster repeated complaints",
                "Rank opportunity and suggest action"
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-4 rounded-3xl border border-moss/10 bg-white/65 px-4 py-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-moss text-paper">
                    {index + 1}
                  </div>
                  <p className="text-sm text-ink/72">{item}</p>
                </div>
              ))}
            </Card>

            <Card className="space-y-4">
              <div className="flex items-center gap-3">
                <Radar className="h-5 w-5 text-gold" />
                <p className="font-display text-2xl">Form outcome</p>
              </div>
              <p className="text-sm leading-7 text-ink/70">
                The selected inputs should become a project plus an analysis run in the backend.
                This frontend already mirrors that product thinking, so hooking the API up later is
                straightforward.
              </p>
            </Card>
          </div>
        </div>
      </AppFrame>
    </Shell>
  );
}
