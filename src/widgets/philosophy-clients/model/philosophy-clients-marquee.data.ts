/** Figma 783:9392 (тёмная полоса) и 783:9474 (оранжевая) — пути к выгрузкам MCP 1:1 */
const B = "/assets/figma/7830-philosophy-clients-1440";

export const philosophyMarquee1440Assets = {
  dark: {
    group261: `${B}/marquee-dark-a-group261.svg`,
    /** В выгрузке нет b/d с исходными именами; слоты заполнены белыми логотипами 1:1 из той же секции Figma */
    image41: `${B}/marquee-orange-a-baikal.svg`,
    wgp: `${B}/marquee-dark-c-wgp.svg`,
    image39: `${B}/marquee-orange-b-smyssly.svg`,
    layer1: `${B}/marquee-dark-e-layer1.svg`,
    ingos: `${B}/marquee-dark-f-ingos.svg`,
  },
  orange: {
    baikal: `${B}/marquee-orange-a-baikal.svg`,
    smyssly: `${B}/marquee-orange-b-smyssly.svg`,
    group: `${B}/marquee-orange-c-group.svg`,
    miIcon: `${B}/marquee-orange-d-mi-icon.svg`,
    xiaomiWord: `${B}/marquee-orange-d-xiaomi-word.svg`,
    klapp1: `${B}/marquee-orange-e-klapp-part1.svg`,
    klapp2: `${B}/marquee-orange-e-klapp-part2.svg`,
    klapp3: `${B}/marquee-orange-e-klapp-part3.svg`,
    topstretch: `${B}/marquee-orange-f-topstretch.svg`,
  },
} as const;
