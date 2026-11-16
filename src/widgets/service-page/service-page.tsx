"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRef, useState } from "react";

import { useViewportLayout } from "@/shared/lib/use-viewport-layout";
import { DarkSurfaceGrid } from "@/shared/ui/dark-surface-grid";
import {
  casesAdCards1440,
  casesVerticalCards1440,
  type CasesAdCard,
  type CasesVerticalCard,
} from "@/widgets/cases/model/cases.data";
import { CasesAdDetailModal } from "@/widgets/cases/ui/cases-ad-detail-modal";
import { CasesVerticalDetailModal } from "@/widgets/cases/ui/cases-vertical-detail-modal";
import { FirstScreenCta } from "@/widgets/first-screen/ui/first-screen-cta";
import { FooterSection } from "@/widgets/footer";
import { LeadFormFields } from "@/widgets/lead-form/ui/lead-form-fields";

import "./service-page.css";

const copy = {
  vertical: {
    heroItalic: "вертикальное",
    heroBold: ["видео для", "соцсетей"],
    heroDescription: "От 10 роликов в месяц. Придумываем темы, снимаем и разбираем статистику.",
    heroImage: "/assets/figma/9656-first-screen-1440/hero-image.jpg",
    titleItalic: "Вертикальный",
    titleBold: ["видеоконтент", "для социальных сетей"],
    description: "Планируем, снимаем и монтируем серии роликов для соцсетей бренда.",
    points: [
      ["Изучим", "ролики бренда", "и его конкурентов"],
      ["Подберём", "темы и героев", "и напишем сценарии"],
      ["Подготовим", "план съёмок", "и снимем серию"],
      ["Смонтируем", "ролики с титрами", "и звуком для публикации"],
      ["Разберём", "статистику и решим,", "что повторить в следующей серии"],
    ],
    bullets: [
      <><b>выберем</b><br /><i>задачи для серии</i></>,
      <><b>подберём </b><i>форматы</i><br /><b>для ваших соцсетей</b></>,
      <><b>обсудим </b><i>съёмку</i><br /><b>и объём пакета</b></>,
      <><i>наметим темы</i><br /><b>для первых роликов</b></>,
    ],
    formDescription: "Пришлите ссылку на соцсети бренда и расскажите, что хотите снимать.",
    placeholder: "Ссылка на соцсети и задача (необязательно)",
  },
  advertising: {
    heroItalic: "рекламные",
    heroBold: ["ролики для", "брендов"],
    heroDescription: "Один ролик или серия в общей концепции. Сценарий, съёмка и версии для площадок.",
    heroImage: "/assets/services/advertising-hero.webp",
    titleItalic: "Рекламные",
    titleBold: ["ролики", "для брендов"],
    description: "От сценария и раскадровки до съёмки, монтажа и финальных версий.",
    points: [
      ["Снимем", "рекламные ролики", "для запуска продукта, кампании", "или спецпроекта"],
      ["Снимем", "имиджевый ролик", "о бренде, команде или герое"],
      ["Возьмём на себя", "сценарий,", "съёмку и монтаж"],
      ["Адаптируем", "длину и кадр", "под место показа"],
      ["Покажем", "детали продукта", "с помощью 3D и анимации"],
    ],
    bullets: [
      <><b>обсудим</b><br /><i>ваш продукт</i></>,
      <><b>разберём </b><i>задачу</i><br /><b>и формат ролика</b></>,
      <><b>уточним </b><i>сроки</i><br /><b>и бюджет</b></>,
      <><i>определим версии</i><br /><b>для площадок</b></>,
    ],
    formDescription: "Расскажите, что рекламируем и где будет выходить ролик.",
    placeholder: "Продукт, площадки и задача (необязательно)",
  },
} as const;

export function ServicePage({
  kind,
  tgChannelUrl,
}: {
  kind: keyof typeof copy;
  tgChannelUrl: string;
}) {
  const content = copy[kind];
  const vertical = kind === "vertical";
  const carousel = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [carouselBounds, setCarouselBounds] = useState({ start: true, end: false });
  const [selectedVertical, setSelectedVertical] = useState<CasesVerticalCard | null>(null);
  const [selectedAd, setSelectedAd] = useState<CasesAdCard | null>(null);
  const layout = useViewportLayout() || "1440";
  const mobile = layout === "360" || layout === "480";
  const cards = vertical ? casesVerticalCards1440 : [casesAdCards1440[0], casesAdCards1440[2]];

  const scrollCases = (direction: number) => {
    const rail = carousel.current;
    const first = rail?.firstElementChild;
    if (!rail || !first) return;

    const gap = Number.parseFloat(getComputedStyle(rail).columnGap);
    rail.scrollBy({ left: direction * (first.clientWidth + gap), behavior: "smooth" });
  };

  return (
    <main className="service-page" data-service={kind}>
      <section className="service-hero">
        <DarkSurfaceGrid />
        <header className="service-container service-nav">
          <Link aria-label="SOLO — на главную" className="service-logo" href="/">
            <img alt="SOLO" src="/assets/figma/9656-first-screen-1440/logo.svg" />
          </Link>
          <nav aria-label="Основная навигация" className={menuOpen ? "is-open" : undefined} id="service-menu">
            <Link href="/#what-we-do-section">об агентстве</Link>
            <Link href="/#cases-section">кейсы</Link>
            <Link href="/#services-section">услуги</Link>
            <a href="#footer-section" onClick={() => setMenuOpen(false)}>контакты</a>
          </nav>
          <a className="service-phone" href="tel:+79689731168">+7 (968) 973-11-68</a>
          <a className="service-nav-cta" href="#service-form">связаться</a>
          <button
            aria-controls="service-menu"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            className="service-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
          >
            {menuOpen ? "×" : <span aria-hidden>⠿</span>}
          </button>
        </header>

        <div className="service-container service-hero-inner">
          <h1><i>{content.heroItalic}</i><br /><b>{content.heroBold[0]}<br />{content.heroBold[1]}</b></h1>
          <p>{content.heroDescription}</p>
          <div className="service-hero-cta">
            <FirstScreenCta
              defaultMode="composed"
              onClick={() => document.getElementById("service-form")?.scrollIntoView()}
              sizeClass="h-full w-full"
            />
          </div>
          <span className="service-russia">Работаем по всей России</span>
          <img alt="" className="service-hero-image" src={content.heroImage} />
        </div>
      </section>

      <section className="service-offer">
        <div className="service-container service-offer-grid">
          <span className="service-eyebrow">услуги</span>
          <div className={`service-offer-card ${kind}`}>
            <div className="service-offer-header">
              <h2><i>{content.titleItalic}</i>{" "}<b>{content.titleBold[0]}<span>{content.titleBold[1]}</span></b></h2>
              <p>{content.description}</p>
              {vertical && <p className="service-package">Пакет <b>от 10 видео в месяц</b></p>}
              <a className="service-button" href="#service-form">бесплатная консультация</a>
            </div>
            <div className="service-points">
              {content.points.map(([lead, firstLine, ...lines], index) => (
                <div key={index}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p><b>{lead}</b> {firstLine}{lines.map(line => <span className="service-point-line" key={line}>{line}</span>)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="service-cases">
        <DarkSurfaceGrid />
        <div className="service-container service-cases-heading">
          <span className="service-eyebrow">кейсы</span>
          <h2><i>{vertical ? "Вертикальный" : "Рекламные"}</i> <b>{vertical ? "контент" : "кейсы"}</b></h2>
          <div className="service-arrows">
            <button aria-label="Предыдущие кейсы" disabled={carouselBounds.start} onClick={() => scrollCases(-1)} type="button">←</button>
            <button aria-label="Следующие кейсы" disabled={carouselBounds.end} onClick={() => scrollCases(1)} type="button">→</button>
          </div>
        </div>
        <div
          className={`service-carousel ${kind}`}
          onScroll={({ currentTarget: rail }) => setCarouselBounds({
            start: rail.scrollLeft < 1,
            end: rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 1,
          })}
          ref={carousel}
        >
          {cards.map(card => {
            const title = "title" in card ? card.title.replace(" & ", "\n& ") : card.titleLines.join("\n");
            return (
              <button
                aria-label={`Открыть кейс ${title.replaceAll("\n", " ")}`}
                className="service-case"
                key={card.id}
                onClick={() => "title" in card ? setSelectedAd(card) : setSelectedVertical(card)}
                type="button"
              >
                <img alt="" loading="lazy" src={card.image} />
                <span className="service-case-title">{title.toUpperCase()}</span>
                {vertical && <span aria-hidden className="service-play">▶</span>}
                <span className="service-case-credits">{card.credits.join("\n")}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="service-contact" id="service-form">
        <div className="service-container service-contact-grid">
          <div className="service-contact-copy">
            <h2><b>давайте </b><i>обсудим</i><br /><b>ваш проект</b></h2>
            <div className="service-mobile-form-intro">
              <h3>Расскажите о задаче</h3>
              <p>{content.formDescription}</p>
            </div>
            <p className="service-contact-intro">На первом созвоне</p>
            <div className="service-bullets">
              {content.bullets.map((bullet, index) => (
                <div key={index}><span>{String(index + 1).padStart(2, "0")}</span><p>{bullet}</p></div>
              ))}
            </div>
          </div>
          <div className="service-form-card">
            <h3>Расскажите о задаче</h3>
            <p>{content.formDescription}</p>
            <LeadFormFields
              contactLayout={mobile ? "pill" : "radio"}
              density={mobile ? "below1024" : "1440"}
              embedInCard
              messagePlaceholder={content.placeholder}
              source={`service-${kind}`}
            />
          </div>
        </div>
      </section>

      <FooterSection showNews={false} showSecrets={false} tgChannelUrl={tgChannelUrl} />
      <CasesVerticalDetailModal card={selectedVertical} layout={layout} onClose={() => setSelectedVertical(null)} open={!!selectedVertical} />
      <CasesAdDetailModal card={selectedAd} layout={layout} onClose={() => setSelectedAd(null)} open={!!selectedAd} />
    </main>
  );
}
