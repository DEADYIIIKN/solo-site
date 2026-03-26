import { Button } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";
import { LeadModalDemo } from "@/features/lead-modal/ui/lead-modal-demo";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_top,rgba(196,106,61,0.18),transparent_55%)]" />
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,720px)_minmax(280px,1fr)] lg:items-end">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
            Frontend baseline for 1:1 build
          </p>
          <h1 className="max-w-[12ch] text-5xl font-semibold leading-none tracking-[-0.05em] text-[var(--color-text)] md:text-7xl">
            Архитектура для точной сборки сайта
          </h1>
          <p className="max-w-[58ch] text-base leading-7 text-[var(--color-text-muted)] md:text-lg">
            Стартовый проект разворачивается на Next.js App Router, со строгим TypeScript,
            token-first стилизацией и раздельными слоями для секций, интерактивных фич и
            общих UI-примитивов.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button>Начать сборку</Button>
            <LeadModalDemo />
          </div>
        </div>
        <div className="rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-soft)]">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            Зафиксировано
          </p>
          <ul className="mt-6 space-y-4 text-sm leading-6 text-[var(--color-text)]">
            <li>Next.js App Router как базовая платформа проекта.</li>
            <li>Tailwind + CSS variables как система токенов и быстрой 1:1 верстки.</li>
            <li>Radix Dialog как единый фундамент модалок.</li>
            <li>Разделение `public/` и импортируемых ассетов по типу использования.</li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
