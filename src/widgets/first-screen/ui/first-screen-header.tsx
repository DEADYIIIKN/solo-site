import {
  firstScreenAssets,
  firstScreenContent,
  firstScreenNavItems
} from "@/widgets/first-screen/model/first-screen.data";

function MobileLogo() {
  return (
    <picture>
      <source media="(min-width: 1440px)" srcSet={firstScreenAssets.navbar.logo1440} />
      <source media="(min-width: 1024px)" srcSet={firstScreenAssets.navbar.logo1024} />
      <source media="(min-width: 768px)" srcSet={firstScreenAssets.navbar.logo768} />
      <source media="(min-width: 480px)" srcSet={firstScreenAssets.navbar.logo480} />
      <img
        alt="СОЛО"
        className="h-auto w-[113px] [filter:brightness(0)_invert(1)] min-[480px]:w-[124px] min-[768px]:w-[136px]"
        height={24}
        src={firstScreenAssets.navbar.logo360}
        width={136}
      />
    </picture>
  );
}

function MenuButton() {
  return (
    <button
      aria-label="Открыть меню"
      className="flex size-full shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-white transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-[var(--color-accent-strong)]"
      type="button"
    >
      <picture>
        <source media="(min-width: 768px)" srcSet={firstScreenAssets.navbar.menu768} />
        <source media="(min-width: 480px)" srcSet={firstScreenAssets.navbar.menu480} />
        <img
          alt=""
          className="h-auto w-5 min-[768px]:w-6"
          height={24}
          src={firstScreenAssets.navbar.menu360}
          width={24}
        />
      </picture>
    </button>
  );
}

export function FirstScreenHeader() {
  return (
    <header className="relative z-20">
      <div className="container-base">
        <div className="flex min-h-[56px] items-end justify-between py-4 min-[480px]:min-h-[60px] min-[480px]:py-6 min-[768px]:min-h-[64px] min-[768px]:py-0 min-[1024px]:hidden">
          <div className="flex min-w-0 flex-1 items-center justify-between min-[1024px]:hidden">
            <MobileLogo />

            <div className="flex items-center gap-4 min-[768px]:gap-6">
              <a
                className="hidden text-[17px] font-semibold leading-[1.2] min-[768px]:block"
                href="tel:+79689731168"
                style={{ color: "var(--color-text-on-dark)" }}
              >
                {firstScreenContent.phone}
              </a>
              <div className="size-14 min-[480px]:size-15 min-[768px]:size-14">
                <MenuButton />
              </div>
            </div>
          </div>
        </div>

        <div className="hidden min-[1024px]:block min-[1440px]:hidden">
          <div className="relative mx-auto h-[72px] w-[944px] py-[15px]">
            <div className="absolute left-0 top-1/2 -translate-y-1/2">
              <MobileLogo />
            </div>

            <nav
              aria-label="Основная навигация"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <ul className="flex items-center gap-4 text-[13px] font-medium leading-[1.2] text-[var(--color-text-on-dark)]">
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

            <div className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center gap-[10px]">
              <a
                className="whitespace-nowrap text-[16px] font-semibold leading-[1.2] text-[var(--color-text-on-dark)]"
                href="tel:+79689731168"
                style={{ color: "var(--color-text-on-dark)" }}
              >
                {firstScreenContent.phone}
              </a>
              <button
                className="rounded-[50px] bg-[var(--color-accent)] px-[20px] pb-[17px] pt-[15px] text-[14px] font-semibold leading-[1.2] text-white transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-[var(--color-accent-strong)]"
                type="button"
              >
                {firstScreenContent.cta}
              </button>
            </div>
          </div>
        </div>

        <div className="hidden min-[1440px]:block">
          <div className="relative mx-auto h-[82px] w-[1160px] py-5">
            <div className="absolute left-0 top-1/2 -translate-y-1/2">
              <MobileLogo />
            </div>

            <nav
              aria-label="Основная навигация"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <ul className="flex items-center gap-9 text-[17px] font-normal leading-[1.2] text-[var(--color-text-on-dark)]">
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

            <div className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center gap-5">
              <a
                className="whitespace-nowrap text-[17px] font-semibold leading-[1.2] text-[var(--color-text-on-dark)]"
                href="tel:+79689731168"
                style={{ color: "var(--color-text-on-dark)" }}
              >
                {firstScreenContent.phone}
              </a>
              <button
                className="rounded-[50px] bg-[var(--color-accent)] px-8 py-[19px] text-[17px] font-semibold leading-[1] text-white transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-[var(--color-accent-strong)]"
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
