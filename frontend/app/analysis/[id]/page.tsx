import Link from "next/link";
import { ArrowUpRight, Filter, Flame, Layers3, Lightbulb } from "lucide-react";
import { getDemoReport } from "@/lib/api";
import {
  ActionLink,
  AppFrame,
  Card,
  ListItem,
  Metric,
  Pill,
  SectionHeading,
  Shell,
  StatBar
} from "@/components/ui";

export default async function AnalysisResultPage() {
  const report = await getDemoReport();

  return (
    <Shell>
      <AppFrame className="space-y-10 pb-20 pt-10">
        <section className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr_0.82fr]">
          <Card className="h-fit space-y-6">
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-ember" />
              <p className="font-display text-2xl">Filters</p>
            </div>
            <div className="space-y-4 text-sm leading-7 text-ink/72">
              <div>
                <p className="uppercase tracking-[0.2em] text-moss/55">Niche</p>
                <p>{report.niche}</p>
              </div>
              <div>
                <p className="uppercase tracking-[0.2em] text-moss/55">Query</p>
                <p>{report.query}</p>
              </div>
              <div>
                <p className="uppercase tracking-[0.2em] text-moss/55">Date Range</p>
                <p>{report.dateRange}</p>
              </div>
              <div>
                <p className="uppercase tracking-[0.2em] text-moss/55">Sources</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {report.sources.map((source) => (
                    <Pill key={source}>{source}</Pill>
                  ))}
                </div>
              </div>
            </div>
            <ActionLink href="/analysis/new" variant="secondary">
              Start another run
            </ActionLink>
          </Card>

          <div className="space-y-6">
            <SectionHeading
              eyebrow="Analysis Result"
              title="Ranked pain points with enough evidence to defend a decision."
              description="The center column is designed as the decision surface. Each cluster shows why it matters, how strong it is, and what direction it points to."
            />

            <div className="grid gap-4 md:grid-cols-3">
              {report.stats.map((stat) => (
                <Metric key={stat.label} label={stat.label} value={stat.value} note={stat.note} />
              ))}
            </div>

            {report.topOpportunities.map((opportunity) => (
              <ListItem
                key={opportunity.id}
                title={opportunity.title}
                meta={`${opportunity.category} • ${opportunity.evidenceCount} evidence snippets`}
                body={opportunity.summary}
                right={
                  <div className="flex flex-col items-end gap-3">
                    <Pill tone="dark">Score {opportunity.score}</Pill>
                    <ActionLink href={`/evidence/${opportunity.id}`} variant="secondary">
                      Open evidence
                    </ActionLink>
                  </div>
                }
              />
            ))}
          </div>

          <div className="space-y-6">
            <Card className="space-y-5">
              <div className="flex items-center gap-3">
                <Flame className="h-5 w-5 text-ember" />
                <p className="font-display text-2xl">Scoring lens</p>
              </div>
              <div className="space-y-4">
                <StatBar label="Frequency" value={report.topOpportunities[0].frequency} />
                <StatBar label="Urgency" value={report.topOpportunities[0].urgency} />
                <StatBar
                  label="Commercial Intent"
                  value={report.topOpportunities[0].commercialIntent}
                />
              </div>
            </Card>

            <Card className="space-y-5">
              <div className="flex items-center gap-3">
                <Layers3 className="h-5 w-5 text-gold" />
                <p className="font-display text-2xl">Suggested actions</p>
              </div>
              <div className="space-y-4">
                {report.topOpportunities.map((opportunity) => (
                  <div
                    key={opportunity.id}
                    className="rounded-3xl border border-moss/10 bg-white/70 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-display text-xl">{opportunity.cta}</p>
                        <p className="text-sm text-ink/65">{opportunity.title}</p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-ink/35" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="space-y-5 bg-ink text-paper">
              <div className="flex items-center gap-3">
                <Lightbulb className="h-5 w-5 text-gold" />
                <p className="font-display text-2xl">Idea suggestions</p>
              </div>
              <div className="space-y-4">
                {report.suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="rounded-3xl border border-paper/10 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-paper/55">
                      {suggestion.format}
                    </p>
                    <h3 className="mt-2 font-display text-2xl">{suggestion.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-paper/76">
                      {suggestion.audience} • {suggestion.monetization}
                    </p>
                  </div>
                ))}
              </div>
              <Link href="/reports" className="text-sm underline underline-offset-4">
                Open saved reports
              </Link>
            </Card>
          </div>
        </section>
      </AppFrame>
    </Shell>
  );
}
