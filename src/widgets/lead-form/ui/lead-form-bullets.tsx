import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

/**
 * Заголовок блока лида — Figma 783:9121 / 783:8365: один поток, leading 0.9 на всех span.
 * Опционально `two-line` — форсированный перенос (редко нужен).
 */
export function LeadFormTitle({
  className,
  breakMode = "natural",
}: {
  className?: string;
  /**
   * "natural"     — свободный перенос (браузер решает сам).
   * "two-line"    — принудительный разрыв «хотите обсудить, как / мы можем помочь?» (1440/1024).
   * "comma-break" — разрыв после «обсудить,» → «хотите обсудить, / как мы можем помочь?»
   *                 (768/480/360: Figma-метрики шрифта дают этот перенос естественно,
   *                  браузерные — нет, поэтому форсируем явным <br>).
   */
  breakMode?: "natural" | "two-line" | "comma-break";
}) {
  const leading = "leading-[0.9]";

  if (breakMode === "two-line") {
    return (
      <h2
        className={cn(
          "m-0 flex max-w-[640px] flex-col gap-0 font-bold lowercase text-[#0d0300]",
          "[&>span]:m-0 [&>span]:block [&>span]:min-h-0 [&>span]:p-0 [&>span]:leading-[0.9]",
          className,
        )}
      >
        <span>
          <span>Хотите </span>
          <span className="font-normal italic">обсудить,</span>
          <span> как</span>
        </span>
        <span>мы можем помочь?</span>
      </h2>
    );
  }

  if (breakMode === "comma-break") {
    return (
      <h2
        className={cn(
          "m-0 max-w-[640px] font-bold lowercase text-[#0d0300]",
          className,
          leading,
        )}
      >
        <span>Хотите </span>
        <span className="font-normal italic">обсудить,</span>
        <br />
        <span>как мы можем помочь?</span>
      </h2>
    );
  }

  return (
    <h2
      className={cn(
        "m-0 max-w-[640px] font-bold lowercase text-[#0d0300]",
        className,
        leading,
      )}
    >
      <span>Хотите </span>
      <span className="font-normal italic">обсудить,</span>
      <span> как мы можем помочь?</span>
    </h2>
  );
}

export function LeadFormBulletRow({
  n,
  className,
  badgeClass,
  numClass,
  onDark,
  contentClassName,
  children,
}: {
  n: string;
  className?: string;
  badgeClass?: string;
  numClass?: string;
  /** Текст на тёмном фоне карточки (Figma 783:10314 / 783:10873) */
  onDark?: boolean;
  /** Ограничение ширины абзаца (Figma 783:8384/8389/8394/8399 для 1024) */
  contentClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex gap-[10px] items-start", className)}>
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-[#ff5c00]",
          badgeClass,
        )}
      >
        <span
          className={cn(
            "font-semibold tabular-nums leading-none text-white",
            numClass,
          )}
        >
          {n}
        </span>
      </div>
      <div
        className={cn(
          "min-w-0 [&_p]:leading-[1.2]",
          onDark ? "text-white" : "text-[#0d0300]",
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** Figma 783:9102–783:9117 — inline bold/italic в одном абзаце, сетка 20× между колонками */
const leadFormBulletP1440 = "m-0 text-[17px] leading-[1.2] [&>span]:leading-[inherit]";

export function LeadFormBullets1440() {
  return (
    <div className="grid w-full grid-cols-2 gap-x-5 gap-y-8">
      <LeadFormBulletRow
        badgeClass="size-[30px]"
        n="01"
        numClass="text-[17px]"
      >
        <p className={leadFormBulletP1440}>
          <span className="font-bold">какие форматы будут работать </span>
          <span className="font-normal italic">в вашей нише</span>
        </p>
      </LeadFormBulletRow>
      <LeadFormBulletRow
        badgeClass="size-[30px]"
        n="03"
        numClass="text-[17px]"
      >
        <p className={leadFormBulletP1440}>
          <span className="font-bold">примерную </span>
          <span className="font-normal italic">стратегию</span>
          <br />
          <span className="font-bold">на 1 месяц</span>
        </p>
      </LeadFormBulletRow>
      <LeadFormBulletRow
        badgeClass="size-[30px]"
        n="02"
        numClass="text-[17px]"
      >
        <p className={leadFormBulletP1440}>
          <span className="font-bold">как вы можете </span>
          <span className="font-normal italic">увеличить </span>
          <span className="font-bold">охваты и вовлеченность</span>
        </p>
      </LeadFormBulletRow>
      <LeadFormBulletRow
        badgeClass="size-[30px]"
        n="04"
        numClass="text-[17px]"
      >
        <p className={leadFormBulletP1440}>
          <span className="font-normal italic">первые идеи, </span>
          <span className="font-bold">основанные на вашем продукте</span>
        </p>
      </LeadFormBulletRow>
    </div>
  );
}

/**
 * Figma 783:8383–783:8402: буллеты абсолютно позиционированы в карточке с шагом 60px.
 * Кружок 22px left=0, текст left=30px (22+8px gap), вертикали: 0 / 60 / 120 / 180px.
 * Контейнер relative h-[202px] (= 180+22) вставляется в поток колонки через mt-3.
 */
export function LeadFormBullets1024() {
  const badge =
    "absolute flex size-[22px] items-center justify-center rounded-full bg-[#ff5c00]";
  const num = "font-semibold text-[12px] leading-[1.2] tabular-nums text-white";
  const p =
    "absolute m-0 text-[#0d0300] text-[16px] leading-[1.2] left-[30px] [&>span]:leading-[inherit]";

  return (
    <div className="relative h-[202px]">
      {/* 01 — 783:8385/8384 */}
      <div className={cn(badge, "top-0")}>
        <span className={num}>01</span>
      </div>
      <p className={cn(p, "top-0 w-[209px]")}>
        <span className="font-bold">какие форматы будут работать </span>
        <span className="font-normal italic">в вашей нише</span>
      </p>

      {/* 02 — 783:8390/8389 */}
      <div className={cn(badge, "top-[60px]")}>
        <span className={num}>02</span>
      </div>
      <p className={cn(p, "top-[60px] w-[235px]")}>
        <span className="font-bold">как вы можете </span>
        <span className="font-normal italic">увеличить </span>
        <span className="font-bold">охваты и вовлеченность</span>
      </p>

      {/* 03 — 783:8395/8394 */}
      <div className={cn(badge, "top-[120px]")}>
        <span className={num}>03</span>
      </div>
      <p className={cn(p, "top-[120px] w-[209px]")}>
        <span className="font-bold">примерную </span>
        <span className="font-normal italic">стратегию</span>
        <br />
        <span className="font-bold">на 1 месяц</span>
      </p>

      {/* 04 — 783:8400/8399 */}
      <div className={cn(badge, "top-[180px]")}>
        <span className={num}>04</span>
      </div>
      <p className={cn(p, "top-[180px] w-[231px]")}>
        <span className="font-normal italic">первые идеи, </span>
        <span className="font-bold">основанные на вашем продукте</span>
      </p>
    </div>
  );
}

/**
 * Figma 783:11501 — 768px, два столбца (буллеты слева в отдельной колонке).
 * Badge 22px, num text-12px, текст 15px, gap-24 между строками.
 */
export function LeadFormBullets768() {
  const p = "m-0 text-[15px] leading-[1.2] [&>span]:leading-[inherit]";
  return (
    <div className="flex w-full flex-col gap-6">
      <LeadFormBulletRow badgeClass="size-[22px]" n="01" numClass="text-[12px]">
        <p className={p}>
          <span className="font-bold">какие форматы будут работать </span>
          <span className="font-normal italic">в вашей нише</span>
        </p>
      </LeadFormBulletRow>
      <LeadFormBulletRow badgeClass="size-[22px]" n="02" numClass="text-[12px]">
        <p className={p}>
          <span className="font-bold">как вы можете </span>
          <span className="font-normal italic">увеличить </span>
          <span className="font-bold">охваты и вовлеченность</span>
        </p>
      </LeadFormBulletRow>
      <LeadFormBulletRow badgeClass="size-[22px]" n="03" numClass="text-[12px]">
        <p className={p}>
          <span className="font-bold">примерную </span>
          <span className="font-normal italic">стратегию</span>
          <br />
          <span className="font-bold">на 1 месяц</span>
        </p>
      </LeadFormBulletRow>
      <LeadFormBulletRow badgeClass="size-[22px]" n="04" numClass="text-[12px]">
        <p className={p}>
          <span className="font-normal italic">первые идеи, </span>
          <span className="font-bold">основанные на вашем продукте</span>
        </p>
      </LeadFormBulletRow>
    </div>
  );
}

/** Мобильный / планшетный столбец — Figma 783:10314 / 783:10873; между строками gap 24. */
export function LeadFormBulletsStacked({ onDark }: { onDark?: boolean } = {}) {
  const t = "text-[14px] min-[480px]:text-[16px]";
  const num = "text-[11px] text-white";
  const badge = "size-[22px]";
  return (
    <div className="flex w-full flex-col gap-6">
      <LeadFormBulletRow badgeClass={badge} n="01" numClass={num} onDark={onDark}>
        <p className={cn("m-0 leading-[1.2] [&>span]:leading-[inherit]", t)}>
          <span className="font-bold">какие форматы будут работать </span>
          <span className="font-normal italic">в вашей нише</span>
        </p>
      </LeadFormBulletRow>
      <LeadFormBulletRow badgeClass={badge} n="02" numClass={num} onDark={onDark}>
        <p className={cn("m-0 leading-[1.2] [&>span]:leading-[inherit]", t)}>
          <span className="font-bold">как вы можете </span>
          <span className="font-normal italic">увеличить </span>
          <span className="font-bold">охваты и вовлеченность</span>
        </p>
      </LeadFormBulletRow>
      <LeadFormBulletRow badgeClass={badge} n="03" numClass={num} onDark={onDark}>
        <p className={cn("m-0 leading-[1.2] [&>span]:leading-[inherit]", t)}>
          <span className="font-bold">примерную </span>
          <span className="font-normal italic">стратегию</span>
          <br />
          <span className="font-bold">на 1 месяц</span>
        </p>
      </LeadFormBulletRow>
      <LeadFormBulletRow badgeClass={badge} n="04" numClass={num} onDark={onDark}>
        <p className={cn("m-0 leading-[1.2] [&>span]:leading-[inherit]", t)}>
          <span className="font-normal italic">первые идеи, </span>
          <span className="font-bold">основанные на вашем продукте</span>
        </p>
      </LeadFormBulletRow>
    </div>
  );
}
