import type { Metadata } from "next";
import Link from "next/link";
import { getPayload } from "payload";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import config from "@payload-config";

import { getSiteSettings } from "@/shared/lib/get-site-settings";
import { FooterSection } from "@/widgets/footer";

/** Обновление с CMS без полной пересборки. */
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: "Политика обработки персональных данных SOLO Продакшн",
  alternates: {
    canonical: "/privacy",
  },
  robots: { index: true, follow: true },
};

const PLACEHOLDER = `Политика конфиденциальности

1. Общие положения
Настоящая Политика конфиденциальности определяет порядок обработки персональных данных пользователей сайта.

2. Персональные данные
Под персональными данными понимается любая информация, относящаяся к физическому лицу — субъекту персональных данных.

3. Цели обработки
Персональные данные обрабатываются в целях: обработки заявок на услуги; обратной связи с клиентами.

4. Основания обработки
Обработка персональных данных осуществляется на основании согласия субъекта персональных данных.

5. Права субъекта
Субъект персональных данных вправе: получать сведения об обработке своих данных; требовать уточнения, блокирования или уничтожения персональных данных.

6. Контакты
По вопросам обработки персональных данных обращайтесь по контактам, указанным на сайте.`;

function hasContent(data: SerializedEditorState | null): data is SerializedEditorState {
  if (!data) return false;
  const children = data.root?.children;
  if (!Array.isArray(children) || children.length === 0) return false;
  // Lexical всегда содержит как минимум один пустой paragraph; считаем «есть контент»
  // если хотя бы у одного блока дети непустые.
  return children.some((node) => {
    const c = (node as unknown as { children?: unknown[] }).children;
    return Array.isArray(c) && c.length > 0;
  });
}

export default async function PrivacyPage() {
  // Fetch Payload CMS content; fall back to static placeholder on any error.
  let richTextContent: SerializedEditorState | null = null;
  const settings = await getSiteSettings();
  try {
    const payload = await getPayload({ config });
    const raw = await payload.findGlobal({
      slug: "privacy-page",
      overrideAccess: true,
    });
    const content = (raw as Record<string, unknown>).content;
    richTextContent = (content as SerializedEditorState | undefined) ?? null;
  } catch {
    // Payload not available or table not yet seeded — render placeholder below.
  }

  return (
    <main className="app-main">
      <div className="bg-[#0d0300] min-h-screen">
        <div className="mx-auto max-w-[800px] px-6 py-[80px] pb-[120px]">
          <Link
            className="mb-[40px] inline-block text-[14px] font-normal leading-[1.5] text-[#c8c3bf] no-underline transition-opacity hover:opacity-70"
            href="/"
          >
            ← На главную
          </Link>

          {hasContent(richTextContent) ? (
            <div className="prose prose-invert max-w-none text-white opacity-90 text-[16px] font-normal leading-[1.6]">
              <RichText data={richTextContent} />
            </div>
          ) : (
            <div className="text-white opacity-90">
              <h1 className="mb-[32px] text-[24px] font-bold leading-[1.2] text-white">
                Политика конфиденциальности
              </h1>
              <pre className="whitespace-pre-wrap text-[16px] font-normal leading-[1.6] font-[inherit]">
                {PLACEHOLDER}
              </pre>
            </div>
          )}
        </div>
      </div>
      <FooterSection
        showNews={false}
        showSecrets={false}
        tgChannelUrl={settings.tgChannelUrl}
      />
    </main>
  );
}
