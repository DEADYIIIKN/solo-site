import { Button } from "@/shared/ui/button";
import { LeadModalDemo } from "@/features/lead-modal/ui/lead-modal-demo";
import { Grid } from "@/shared/ui/grid";
import { Section } from "@/shared/ui/section";
import { Surface } from "@/shared/ui/surface";
import { Heading, Text } from "@/shared/ui/typography";

export function Hero() {
  return (
    <Section className="overflow-hidden pt-10 md:pt-12 xl:pt-16" containerClassName="relative">
      <div className="surface-grid" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_top_left,rgba(255,92,0,0.18),transparent_58%)]" />
      <Grid className="items-end gap-y-10 lg:[grid-template-columns:minmax(0,1.45fr)_minmax(320px,0.75fr)]">
        <div className="col-span-full space-y-6 lg:col-span-8 xl:space-y-8">
          <Text className="eyebrow" size="sm" tone="muted" weight="semibold">
            Foundation for 1:1 build
          </Text>
          <Heading accent="архитектура" as="h1" className="max-w-[11ch]" level="hero">
            для точной сборки сайта
          </Heading>
          <Text className="max-w-[58ch]" size="lg" tone="muted">
            Стартовый проект разворачивается на Next.js App Router, со строгим TypeScript,
            token-first стилизацией и раздельными слоями для секций, интерактивных фич и
            общих UI-примитивов.
          </Text>
          <div className="flex flex-wrap gap-3 md:gap-4">
            <Button size="lg">Начать сборку</Button>
            <LeadModalDemo />
          </div>
        </div>
        <Surface
          className="col-span-full md:max-w-[420px] lg:col-span-4 lg:justify-self-end"
          padding="lg"
          radius="lg"
        >
          <Text className="eyebrow" size="sm" tone="muted" weight="semibold">
            Зафиксировано
          </Text>
          <ul className="mt-6 space-y-4">
            <li>Next.js App Router как базовая платформа проекта.</li>
            <li>Tailwind + CSS variables как система токенов и быстрой 1:1 верстки.</li>
            <li>Radix Dialog как единый фундамент модалок.</li>
            <li>Разделение `public/` и импортируемых ассетов по типу использования.</li>
          </ul>
        </Surface>
      </Grid>
    </Section>
  );
}
