import type { CollectionConfig, ImageSize } from "payload";

const MEDIA_STATIC_DIR = process.env.PAYLOAD_UPLOAD_DIR || "media";

const HIDDEN_IMAGE_SIZE_ADMIN = {
  disableGroupBy: true,
  disableListColumn: true,
  disableListFilter: true,
} as const;

const IMAGE_FORMAT_OPTIONS = {
  avif: {
    format: "avif",
    options: { quality: 72 },
  },
  webp: {
    format: "webp",
    options: { quality: 78 },
  },
} as const satisfies Record<string, NonNullable<ImageSize["formatOptions"]>>;

const responsiveImageSize = ({
  format,
  name,
  width,
}: {
  format: keyof typeof IMAGE_FORMAT_OPTIONS;
  name: string;
  width: number;
}): ImageSize => ({
  name: `${name}-${format}`,
  width,
  withoutEnlargement: true,
  formatOptions: IMAGE_FORMAT_OPTIONS[format],
  admin: HIDDEN_IMAGE_SIZE_ADMIN,
});

export const payloadMediaImageSizes: ImageSize[] = [
  responsiveImageSize({ name: "card-360", width: 360, format: "avif" }),
  responsiveImageSize({ name: "card-360", width: 360, format: "webp" }),
  responsiveImageSize({ name: "card-768", width: 768, format: "avif" }),
  responsiveImageSize({ name: "card-768", width: 768, format: "webp" }),
  responsiveImageSize({ name: "card-1440", width: 1440, format: "avif" }),
  responsiveImageSize({ name: "card-1440", width: 1440, format: "webp" }),
  responsiveImageSize({ name: "hero-1440", width: 1440, format: "avif" }),
  responsiveImageSize({ name: "hero-1440", width: 1440, format: "webp" }),
];

export function getMediaAdminThumbnail({ doc }: { doc: Record<string, unknown> }): false | string {
  const sizes = doc.sizes;
  if (sizes && typeof sizes === "object") {
    const thumbnail = (sizes as Record<string, { url?: unknown }>)["card-360-webp"];
    if (thumbnail && typeof thumbnail.url === "string" && thumbnail.url.length > 0) {
      return thumbnail.url;
    }
  }

  return typeof doc.url === "string" && doc.mimeType?.toString().startsWith("image/")
    ? doc.url
    : false;
}

/** Человекочитаемый alt из имени файла (без расширения). */
function altFromFilename(filename: string): string {
  const base = filename
    .replace(/\.[^.]+$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!base) return "Медиафайл";
  return base.charAt(0).toUpperCase() + base.slice(1);
}

function ensureAlt(data: Record<string, unknown> | null | undefined): void {
  if (!data) return;
  const existing = typeof data.alt === "string" ? data.alt.trim() : "";
  if (existing) return;
  const fn = typeof data.filename === "string" ? data.filename.trim() : "";
  data.alt = fn ? altFromFilename(fn) : "Медиафайл";
}

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  admin: {
    group: "Настройки",
    defaultColumns: ["filename", "alt", "updatedAt"],
    description:
      "Перетащи файлы прямо на таблицу ниже — загрузятся без лишних шагов. Alt подставится из имени файла; при желании поправь в карточке.",
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        ensureAlt(data as Record<string, unknown> | null | undefined);
        return data;
      },
    ],
    beforeChange: [
      ({ data }) => {
        ensureAlt(data as Record<string, unknown> | null | undefined);
        return data;
      },
    ],
  },
  upload: {
    staticDir: MEDIA_STATIC_DIR,
    mimeTypes: ["image/*", "video/*"],
    imageSizes: payloadMediaImageSizes,
    adminThumbnail: getMediaAdminThumbnail,
    displayPreview: true,
    /** Массовая загрузка с экрана списка (drag-and-drop на таблицу). */
    bulkUpload: true,
    /** Файл на экране создания — сразу видно поле загрузки. */
    hideFileInputOnCreate: false,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: false,
      label: "Alt-текст",
      admin: {
        description:
          "Необязательно: если пусто — возьмём из имени файла. Для важных кадров лучше написать осмысленно (например «Кейс Callebaut — портрет шефа»).",
      },
    },
  ],
};
