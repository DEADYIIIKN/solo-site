/**
 * При `next dev` подтягивает кейсы из статики в Payload, если записей ещё нет.
 * Сид идёт в фоне (queueMicrotask), чтобы не блокировать готовность Next — иначе после
 * перезапуска кажется, что «localhost не грузится», пока крутится getPayload/миграции.
 * Отключить полностью: PAYLOAD_AUTO_SEED=0
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
