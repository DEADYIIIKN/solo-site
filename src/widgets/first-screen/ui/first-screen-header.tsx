/* eslint-disable @next/next/no-img-element */

import {
  firstScreenAssets,
  firstScreenContent,
  firstScreenNavItems
} from "@/widgets/first-screen/model/first-screen.data";

function MobileLogo() {
  return (
    <>
      <img
        alt="СОЛО"
        className="block h-auto w-[113px] min-[480px]:hidden"
        height={20}
        src={firstScreenAssets.navbar.logo360}
        width={113}
      />
      <img
        alt="СОЛО"
        className="hidden h-auto w-[124px] min-[480px]:block min-[768px]:hidden"
        height={22}
        src={firstScreenAssets.navbar.logo480}
        width={124}
      />
      <img
        alt="СОЛО"
        className="hidden h-auto w-[136px] min-[768px]:block min-[1024px]:hidden"
        height={24}
        src={firstScreenAssets.navbar.logo768}
        width={136}
      />
      <img
        alt="СОЛО"
        className="hidden h-auto w-[136px] min-[1024px]:block min-[1440px]:hidden"
        height={24}
        src={firstScreenAssets.navbar.logo1024}
        width={136}
      />
      <img
        alt="СОЛО"
        className="hidden h-auto w-[136px] min-[1440px]:block"
        height={24}
        src={firstScreenAssets.navbar.logo1440}
        width={136}
      />
    </>
  );
}

function MenuButton() {
  return (
    <button
      aria-label="Открыть меню"
      className="flex size-full shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-white transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-[var(--color-accent-strong)]"
      type="button"
    >
      <img
        alt=""
        className="block h-auto w-5 min-[480px]:hidden"
        height={20}
        src={firstScreenAssets.navbar.menu360}
        width={20}
      />
      <img
        alt=""
        className="hidden h-auto w-5 min-[480px]:block min-[768px]:hidden"
        height={20}
        src={firstScreenAssets.navbar.menu480}
        width={20}
      />
      <img
        alt=""
        className="hidden h-auto w-6 min-[768px]:block"
        height={24}
        src={firstScreenAssets.navbar.menu768}
        width={24}
      />
    </button>
  );
}

export function FirstScreenHeader() {
  return (
    <header className="relative z-20">
      <div className="container-base">
        <div className="flex min-h-[56px] items-end justify-between py-4 min-[480px]:min-h-[60px] min-[480px]:py-6 min-[768px]:min-h-[64px] min-[768px]:py-0 min-[1024px]:min-h-[72px] min-[1024px]:py-4 min-[1440px]:min-h-[82px] min-[1440px]:py-4">
          <div className="flex min-w-0 flex-1 items-center justify-between min-[1024px]:hidden">
            <MobileLogo />

            <div className="flex items-center gap-4 min-[768px]:gap-6">
              <a
                className="hidden text-[17px] font-semibold leading-[1.2] text-white min-[768px]:block"
                href="tel:+79689731168"
              >
                {firstScreenContent.phone}
              </a>
              <div className="size-14 min-[480px]:size-15 min-[768px]:size-14">
                <MenuButton />
              </div>
            </div>
          </div>

          <div className="hidden w-full grid-cols-[136px_minmax(0,1fr)_max-content] items-center gap-8 min-[1024px]:grid">
            <MobileLogo />

            <nav aria-label="Основная навигация" className="min-w-0 flex-1">
              <ul className="flex items-center justify-center gap-5 text-[17px] font-normal leading-[1.2] text-[var(--color-text-on-dark)] min-[1440px]:gap-8">
                {firstScreenNavItems.map((item) => (
                  <li key={item}>
                    <a
                      className="transition-opacity duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:opacity-75"
                      href="#"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex min-w-max shrink-0 items-center gap-4 min-[1440px]:gap-5">
              <a
                className="whitespace-nowrap text-[17px] font-semibold leading-[1.2] text-[var(--color-text-on-dark)]"
                href="tel:+79689731168"
              >
                {firstScreenContent.phone}
              </a>
              <button
                className="rounded-[50px] bg-[var(--color-accent)] px-5 py-[15px] text-[14px] font-semibold leading-[1.2] text-white transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-[var(--color-accent-strong)] min-[1440px]:px-[20px] min-[1440px]:py-[17px]"
                type="button"
              >
                {firstScreenContent.cta}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
