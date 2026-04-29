export const teamSectionAssets = {
  teamPhoto: "/assets/figma/optimized/team-photo.avif",
} as const;

/** Порядок колонок как в макете: 5+, 3+, 177, 30+ */
export const teamSectionContent = {
  sectionLabel: "что мы делаем",
  headline: {
    lead: "Создаем рекламу и контент для\u00a0соцсетей, которые ",
    accent: "системно приводят клиентов",
    tail: " в\u00a0ваш бизнес.",
  },
  stats: [
    { target: 5, format: "plus-suffix" as const, suffix: " лет", label: "командный опыт" },
    { target: 3, format: "plus-suffix" as const, suffix: " млн", label: "просмотров в\u00a0соцсетях" },
    { target: 177, format: "plain" as const, suffix: "", label: "реализованных проектов" },
    { target: 30, format: "plus-only" as const, suffix: "", label: "постоянных клиентов" },
  ],
  manifesto: {
    parts: [
      { text: "Мы ", bold: true },
      { text: "превращаем идеи в\u00a0контент, ", bold: false, italic: true },
      { text: "который объединяет креатив и\u00a0стратегию.", bold: true },
    ],
  },
} as const;

export const teamSection1440Assets = teamSectionAssets;
export const teamSection1440Content = teamSectionContent;
