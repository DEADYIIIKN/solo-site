/**
 * Идемпотентно наполняет Payload кейсами из `cases.data` (как в dev через instrumentation).
 * В production instrumentation не вызывает сид — этот скрипт в CMD после ensure-payload-db.
 * Отключить: PAYLOAD_AUTO_SEED=0
 */
async function main(): Promise<void> {
  if (process.env.PAYLOAD_AUTO_SEED === "0") {
    return;
  }
  const { seedCasesFromStaticIfMissing } = await import(
    "../src/widgets/cases/lib/seed-cases-from-static.ts"
  );
  await seedCasesFromStaticIfMissing();
}

main().catch((error) => {
  console.error("[seed-cases-if-missing]", error);
  process.exit(1);
});
