import Script from "next/script";

import type { SiteSettingsData } from "@/shared/lib/get-site-settings";

type YandexMetrikaProps = {
  settings: SiteSettingsData;
};

function shouldRenderMetrika(settings: SiteSettingsData): boolean {
  if (!settings.yandexMetrikaEnabled) return false;
  if (!/^\d+$/.test(settings.yandexMetrikaId)) return false;
  if (process.env.NODE_ENV === "production") return true;
  return process.env.NEXT_PUBLIC_ENABLE_ANALYTICS_IN_DEV === "1";
}

export function YandexMetrika({ settings }: YandexMetrikaProps) {
  if (!shouldRenderMetrika(settings)) return null;

  const counterId = Number(settings.yandexMetrikaId);
  const options = JSON.stringify({
    clickmap: settings.yandexMetrikaClickmap,
    trackLinks: settings.yandexMetrikaTrackLinks,
    accurateTrackBounce: settings.yandexMetrikaAccurateTrackBounce,
    webvisor: settings.yandexMetrikaWebvisor,
  });

  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j=0; j<document.scripts.length; j++) {
              if (document.scripts[j].src === r) return;
            }
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
          })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
          ym(${counterId}, 'init', ${options});
        `}
      </Script>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            src={`https://mc.yandex.ru/watch/${settings.yandexMetrikaId}`}
            style={{ left: "-9999px", position: "absolute" }}
          />
        </div>
      </noscript>
    </>
  );
}
