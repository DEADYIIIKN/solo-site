/**
 * В dev подтягивает кейсы из статики в Payload, если записей ещё нет (фоном).
 * В Docker/production то же делает `scripts/seed-cases-if-missing.ts` перед `next start`.
 * Отключить: PAYLOAD_AUTO_SEED=0
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NODE_ENV !== "development") return;
  if (process.env.PAYLOAD_AUTO_SEED === "0") return;

  queueMicrotask(() => {
    void (async () => {
      try {
        const { seedCasesFromStaticIfMissing } = await import(
          "@/widgets/cases/lib/seed-cases-from-static"
        );
        await seedCasesFromStaticIfMissing();
      } catch (e) {
        console.warn("[instrumentation] seed cases:", e);
      }
    })();
  });
}
