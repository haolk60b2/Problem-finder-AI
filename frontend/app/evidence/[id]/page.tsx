import { LineChart, Link2, Quote, ShieldCheck } from "lucide-react";
import { getDemoReport } from "@/lib/api";
import { AppFrame, Card, Pill, SectionHeading, Shell, StatBar } from "@/components/ui";

export default async function EvidencePage() {
  const report = await getDemoReport();
  const focus = report.topOpportunities[0];

  return (
    <Shell>
      <AppFrame className="space-y-10 pb-20 pt-10">
        <SectionHeading
          eyebrow="Evidence Detail"
          title={focus.title}
          description="This page keeps the promise that the product is grounded in real evidence. The AI summary is secondary. The source excerpts are the anchor."
        />

        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <Card className="space-y-4">
              <div className="flex items-center gap-3">
                <Quote className="h-5 w-5 text-ember" />
                <p className="font-display text-2xl">Supporting excerpts</p>
              </div>
              <div className="space-y-4">
                {report.evidence.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-3xl border border-moss/10 bg-white/70 p-5"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <Pill tone="neutral">{item.source}</Pill>
                      <Pill tone={item.sentiment === "Buying" ? "warm" : "neutral"}>
                        {item.sentiment}
                      </Pill>
                    </div>
                    <p className="mt-4 text-base leading-8 text-ink/78">"{item.excerpt}"</p>
                    <div className="mt-4 flex items-center justify-between text-sm text-ink/55">
                      <span>{item.author}</span>
                      <a href={item.url} className="inline-flex items-center gap-2 underline">
                        <Link2 className="h-4 w-4" />
                        Source link
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="space-y-5 bg-ink text-paper">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-gold" />
                <p className="font-display text-2xl">AI summary</p>
              </div>
              <p className="text-sm leading-7 text-paper/78">
                Shops are not simply complaining about courier quality. They are describing a
                repeated operations failure where address ambiguity forces manual cleanup before
                dispatch. That makes this pain specific, recurring, and monetizable.
              </p>
            </Card>

            <Card className="space-y-5">
              <div className="flex items-center gap-3">
                <LineChart className="h-5 w-5 text-moss" />
                <p className="font-display text-2xl">Opportunity shape</p>
              </div>
              <StatBar label="Urgency" value={focus.urgency} />
              <StatBar label="Frequency" value={focus.frequency} />
              <StatBar label="Commercial Intent" value={focus.commercialIntent} />
              <div className="rounded-3xl border border-moss/10 bg-mist/40 p-4 text-sm leading-7 text-ink/72">
                Suggested route: launch as a focused operations SaaS first, then expand with route
                assignment and carrier reconciliation once the core address-cleanup workflow sticks.
              </div>
            </Card>
          </div>
        </section>
      </AppFrame>
    </Shell>
  );
}
