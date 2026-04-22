import Link from "next/link";
import { PropsWithChildren, ReactNode } from "react";
import clsx from "clsx";

export function Shell({
  children,
  className
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx("min-h-screen bg-canvas text-ink", "bg-hero-grid", className)}
    >
      {children}
    </div>
  );
}

export function AppFrame({
  children,
  className
}: PropsWithChildren<{ className?: string }>) {
  return (
    <main className={clsx("mx-auto w-full max-w-7xl px-6 py-8 md:px-10", className)}>
      {children}
    </main>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl space-y-3">
      <p className="font-mono text-xs uppercase tracking-[0.35em] text-moss/70">
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl leading-tight md:text-5xl">{title}</h2>
      <p className="text-base leading-7 text-ink/74 md:text-lg">{description}</p>
    </div>
  );
}

export function Card({
  children,
  className
}: PropsWithChildren<{ className?: string }>) {
  return (
    <section
      className={clsx(
        "rounded-4xl border border-moss/10 bg-paper/90 p-6 shadow-card backdrop-blur",
        className
      )}
    >
      {children}
    </section>
  );
}

export function Pill({
  children,
  tone = "neutral"
}: PropsWithChildren<{ tone?: "neutral" | "warm" | "dark" }>) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em]",
        tone === "neutral" && "border-moss/10 bg-moss/5 text-moss",
        tone === "warm" && "border-ember/20 bg-ember/10 text-ember",
        tone === "dark" && "border-ink/10 bg-ink text-paper"
      )}
    >
      {children}
    </span>
  );
}

export function Metric({
  label,
  value,
  note
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-3xl border border-moss/10 bg-white/70 p-5">
      <p className="text-sm uppercase tracking-[0.2em] text-moss/60">{label}</p>
      <p className="mt-3 font-display text-4xl">{value}</p>
      <p className="mt-2 text-sm leading-6 text-ink/65">{note}</p>
    </div>
  );
}

export function ActionLink({
  href,
  variant = "primary",
  children
}: PropsWithChildren<{ href: string; variant?: "primary" | "secondary" }>) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition hover:-translate-y-0.5",
        variant === "primary" && "bg-ink text-paper",
        variant === "secondary" && "border border-moss/15 bg-white/70 text-ink"
      )}
    >
      {children}
    </Link>
  );
}

export function StatBar({
  label,
  value
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-ink/68">{label}</span>
        <span className="font-mono text-moss">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-moss/10">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-ember to-gold"
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}

export function ListItem({
  title,
  meta,
  right,
  body
}: {
  title: string;
  meta: string;
  body: string;
  right?: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-moss/10 bg-white/65 p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.24em] text-moss/60">{meta}</p>
          <h3 className="font-display text-2xl">{title}</h3>
        </div>
        {right}
      </div>
      <p className="mt-4 text-sm leading-7 text-ink/72">{body}</p>
    </div>
  );
}
