import Link from "next/link";
import { History, MoveRight, ScanSearch } from "lucide-react";
import { AppFrame, Card, Pill, SectionHeading, Shell } from "@/components/ui";
import { reportHistory } from "@/lib/mock-data";

export default function ReportsPage() {
  return (
    <Shell>
      <AppFrame className="space-y-10 pb-20 pt-10">
        <section className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <Card className="space-y-5 bg-ink text-paper">
            <div className="flex items-center gap-3">
              <History className="h-5 w-5 text-gold" />
              <p className="font-display text-2xl">Reports history</p>
            </div>
            <h1 className="font-display text-5xl leading-tight">
              Revisit previous analyses without losing the reasoning trail.
            </h1>
            <p className="text-sm leading-7 text-paper/78">
              This page is structured for saved runs, niche comparisons, and duplicate detection.
              It can grow into bookmarks, exports, or trend tracking later.
            </p>
          </Card>

          <SectionHeading
            eyebrow="Saved Reports"
            title="A clean archive of what the market kept telling you."
            description="Each row is designed to answer whether the niche is changing, whether complaints are repeating, and which pain point led the last run."
          />
        </section>

        <section className="space-y-5">
          {reportHistory.map((report) => (
            <Card
              key={report.id}
              className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Pill tone="neutral">{report.date}</Pill>
                  <Pill tone="warm">{report.trend}</Pill>
                </div>
                <h2 className="font-display text-3xl">{report.niche}</h2>
                <p className="text-sm leading-7 text-ink/72">
                  {report.sources} • Top pain: {report.topPain}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/analysis/${report.id}`}
                  className="inline-flex items-center rounded-full bg-ink px-5 py-3 text-sm text-paper"
                >
                  Open report
                </Link>
                <button className="inline-flex items-center rounded-full border border-moss/15 px-5 py-3 text-sm">
                  Compare later
                </button>
              </div>
            </Card>
          ))}
        </section>

        <Card className="flex flex-col gap-4 bg-mist/40 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <ScanSearch className="h-5 w-5 text-ember" />
              <p className="font-display text-2xl">Next expansion</p>
            </div>
            <p className="text-sm leading-7 text-ink/72">
              Add duplicate niche detection and trend deltas once the API starts storing multiple
              real analysis runs.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-sm text-ink/75">
            Planned after MVP <MoveRight className="h-4 w-4" />
          </div>
        </Card>
      </AppFrame>
    </Shell>
  );
}
