import {
  ArrowRight,
  AudioWaveform,
  ChartColumnIncreasing,
  FolderSearch2
} from "lucide-react";
import {
  ActionLink,
  AppFrame,
  Card,
  Metric,
  Pill,
  SectionHeading,
  Shell
} from "@/components/ui";
import { demoReport } from "@/lib/mock-data";
import { getHealthStatus } from "@/lib/api";

export default async function LandingPage() {
  const backend = await getHealthStatus();

  return (
    <Shell>
      <AppFrame className="space-y-12 pb-20 pt-10">
        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="overflow-hidden bg-gradient-to-br from-paper via-paper to-mist/70">
            <div className="space-y-8">
              <div className="flex flex-wrap items-center gap-3">
                <Pill tone="warm">Research tool, not chat toy</Pill>
                <Pill tone="neutral">{backend.label}</Pill>
              </div>

              <div className="max-w-4xl space-y-6">
                <p className="font-mono text-xs uppercase tracking-[0.35em] text-moss/70">
                  Find real market problems before you build
                </p>
                <h1 className="font-display text-5xl leading-[0.95] md:text-7xl">
                  Turn scattered complaints into a ranked product opportunity report.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-ink/74">
                  Problem Finder AI scans community signals from Reddit, CSV uploads, app
                  reviews, and more, then shows what users are truly frustrated about, what
                  repeats, and what might convert into SaaS, service, or content.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <ActionLink href="/analysis/new" variant="primary">
                  Run a new analysis
                </ActionLink>
                <ActionLink href="/analysis/report-logistics-vn" variant="secondary">
                  Open sample report
                </ActionLink>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Metric
                  label="Pain groups"
                  value="17"
                  note="clustered from repeated complaints and workarounds"
                />
                <Metric
                  label="Buying signals"
                  value="38"
                  note="posts with clear willingness to pay or urgency"
                />
                <Metric
                  label="Top score"
                  value="89"
                  note="best opportunity in the current sample report"
                />
              </div>
            </div>
          </Card>

          <Card className="bg-ink text-paper">
            <div className="space-y-6">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-paper/60">
                Sample report pulse
              </p>
              <div className="space-y-4">
                {demoReport.topOpportunities.map((opportunity) => (
                  <div key={opportunity.id} className="rounded-3xl border border-paper/10 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-paper/55">
                          {opportunity.category}
                        </p>
                        <h2 className="mt-2 font-display text-2xl leading-tight">
                          {opportunity.title}
                        </h2>
                      </div>
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-paper/10 bg-paper/10 font-display text-2xl">
                        {opportunity.score}
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-paper/75">
                      {opportunity.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card>
            <FolderSearch2 className="h-8 w-8 text-ember" />
            <h3 className="mt-5 font-display text-3xl">Pull the raw mess in</h3>
            <p className="mt-4 text-sm leading-7 text-ink/70">
              Start with Reddit and CSV uploads for the MVP. Keep the collection layer narrow,
              useful, and real enough to demo.
            </p>
          </Card>
          <Card>
            <AudioWaveform className="h-8 w-8 text-gold" />
            <h3 className="mt-5 font-display text-3xl">Extract pain, not noise</h3>
            <p className="mt-4 text-sm leading-7 text-ink/70">
              Surface complaints, workarounds, feature requests, and buying intent from real
              evidence instead of loose keyword matching.
            </p>
          </Card>
          <Card>
            <ChartColumnIncreasing className="h-8 w-8 text-moss" />
            <h3 className="mt-5 font-display text-3xl">Prioritize what pays</h3>
            <p className="mt-4 text-sm leading-7 text-ink/70">
              Rank issues by frequency, urgency, repetition, and commercial intent so the team
              knows what deserves attention first.
            </p>
          </Card>
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow="Workflow"
            title="From raw complaints to product direction in one visible path."
            description="The frontend is set up to support the exact flow you described: input, analysis, evidence, ranked opportunities, and action-oriented suggestions."
          />

          <Card className="space-y-4">
            {[
              "Choose niche, timeframe, language, and source mix.",
              "Run collection and preprocessing in the background.",
              "Inspect ranked pain clusters with real evidence.",
              "Branch into build SaaS, sell service, or make content."
            ].map((step, index) => (
              <div
                key={step}
                className="flex items-center justify-between rounded-3xl border border-moss/10 bg-white/70 px-5 py-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-moss text-paper">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-ink/78">{step}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-ink/35" />
              </div>
            ))}
          </Card>
        </section>
      </AppFrame>
    </Shell>
  );
}
