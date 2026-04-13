import { firstScreenAssets, firstScreenNavLinks } from "@/widgets/first-screen/model/first-screen.data";

export const footerAssets = {
  backgroundGrid: firstScreenAssets.backgroundGrid,
  logo: "/assets/figma/footer-1440/logo.svg",
  blogCard1: "/assets/figma/footer-1440/blog-card-1.jpg",
  blogCard2: "/assets/figma/footer-1440/blog-card-2.jpg",
  blogCard3: "/assets/figma/footer-1440/blog-card-3.jpg",
  tgIcon: "/assets/figma/footer-1440/tg-icon.svg",
  arrowPrev: "/assets/figma/9274-arrow-1440/icon-arrow-right.svg",
  arrowNext: "/assets/figma/9274-arrow-1440/icon-arrow-left.svg",
} as const;

export const footerNavItems = ["об агенстве", "кейсы", "услуги", "Новости"] as const;

export const footerNavLinks = firstScreenNavLinks.filter((item) => item.label !== "Контакты");

export const footerBlogPosts = [
  {
    id: 1,
    image: "/assets/figma/footer-1440/blog-card-1.jpg",
    titleParts: [
      { text: "Фраза ", italic: false },
      { text: "из детства, ", italic: true },
      { text: "которая стала аксессуаром", italic: false },
    ],
  },
  {
    id: 2,
    image: "/assets/figma/footer-1440/blog-card-2.jpg",
    titleParts: [
      { text: "почему ", italic: false },
      { text: "важен бриф", italic: true },
      { text: " для качественного результата", italic: false },
    ],
  },
  {
    id: 3,
    image: "/assets/figma/footer-1440/blog-card-3.jpg",
    titleParts: [
      { text: "обновляем", italic: true },
      { text: " фирменный стиль", italic: false },
    ],
  },
] as const;

export const footerContent = {
  blogTitle: "делимся секретами",
  phone: "+7 968 973 11-68",
  phoneSubtitle: "(WhatsApp, Telegram)",
  email: "info@soloproduction.pro",
  tgDescription: "Процессы, инсайды и жизнь агенства — в нашем канале",
  tgCta: "перейти в канал",
  legal: "ИП Лопатина Софья Андреевна  |  ИНН 422195627616",
  privacy: "Политика конфиденциальности",
} as const;
