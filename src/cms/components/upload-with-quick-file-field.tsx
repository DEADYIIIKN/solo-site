"use client";

import {
  BulkUploadProvider,
  Button,
  UploadInput,
  type UploadInputProps,
  useAuth,
  useConfig,
  useField,
  useLocale,
  useTranslation,
  withCondition,
} from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import type { UploadFieldClientProps } from "payload";
import React, { useCallback, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

const mergeFieldStyles = (field: UploadFieldClientProps["field"]) => ({
  ...(field?.admin?.style || {}),
  ...(field?.admin?.width
    ? { "--field-width": field.admin.width }
    : { flex: "1 1 auto" }),
  ...(field?.admin?.style?.flex ? { flex: field.admin.style.flex } : {}),
});

async function postUploadCreateDocument({
  file,
  collectionSlug,
  apiRoute,
  serverURL,
  localeCode,
}: {
  file: File;
  collectionSlug: string;
  apiRoute: string;
  serverURL: string;
  localeCode?: string;
}): Promise<string | number> {
  const formData = new FormData();
  formData.append("file", file);
  const url = formatAdminURL({
    apiRoute,
    path: `/${collectionSlug}`,
    serverURL,
  });
  const res = await fetch(url, {
    method: "POST",
    body: formData,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(localeCode ? { "Accept-Language": localeCode } : {}),
    },
  });
  if (!res.ok) {
    let msg = `Ошибка ${res.status}`;
    try {
      const j = (await res.json()) as { errors?: { message?: string }[]; message?: string };
      msg = j.errors?.[0]?.message || j.message || msg;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  const json = (await res.json()) as { doc?: { id?: string | number }; id?: string | number };
  const id = json.doc?.id ?? json.id;
  if (id == null) throw new Error("Ответ API без id");
  return id;
}

async function fileFromRemoteUrl(url: string): Promise<File> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const blob = await res.blob();
  const segment = url.split("/").pop()?.split("?")[0]?.trim() || "";
  const safeName = segment && /\.[a-z0-9]{2,5}$/i.test(segment) ? segment : `file-${Date.now()}`;
  return new File([blob], safeName, { type: blob.type || "application/octet-stream" });
}

type StripProps = {
  allowCreate: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  hasMany: boolean | undefined;
  onUploadFiles: (files: FileList) => Promise<void>;
  readOnly: boolean;
  relationTo: UploadFieldClientProps["field"]["relationTo"];
  uploadKey: string;
  uploading: boolean;
};

function DropzoneInlineStrip(props: StripProps) {
  const {
    allowCreate,
    containerRef,
    hasMany,
    onUploadFiles,
    readOnly,
    relationTo,
    uploadKey,
    uploading,
  } = props;
  const { permissions } = useAuth();
  const cfg = useConfig();
  const getEntityConfig = cfg?.getEntityConfig;
  const { t } = useTranslation();

  const [portalHost, setPortalHost] = useState<HTMLDivElement | null>(null);
  const [showPaste, setShowPaste] = useState(false);
  const [pasteUrl, setPasteUrl] = useState("");
  const mountedElRef = useRef<HTMLDivElement | null>(null);
  const fileInputId = useId();

  const activeRelationTo = Array.isArray(relationTo) ? relationTo[0] : relationTo;

  const accept = useMemo(() => {
    if (typeof activeRelationTo !== "string" || !getEntityConfig) return "";
    const col = getEntityConfig({ collectionSlug: activeRelationTo });
    const m = col?.upload?.mimeTypes;
    return Array.isArray(m) ? m.join(",") : "";
  }, [activeRelationTo, getEntityConfig]);

  const canCreate =
    allowCreate &&
    typeof activeRelationTo === "string" &&
    Boolean(permissions?.collections?.[activeRelationTo]?.create);

  useLayoutEffect(() => {
    if (hasMany || readOnly || !canCreate) {
      mountedElRef.current?.remove();
      mountedElRef.current = null;
      setPortalHost(null);
      return;
    }

    const attach = () => {
      const root = containerRef.current;
      if (!root) return false;
      const host = root.querySelector(".upload__dropzoneContent__buttons");
      if (!host || !(host instanceof HTMLElement)) return false;
      if (mountedElRef.current) return true;
      const el = document.createElement("div");
      el.className = "upload-field--solo-quickstrip__strip";
      host.prepend(el);
      mountedElRef.current = el;
      setPortalHost(el);
      return true;
    };

    if (attach())
      return () => {
        mountedElRef.current?.remove();
        mountedElRef.current = null;
        setPortalHost(null);
      };

    const raf = requestAnimationFrame(attach);
    const t = window.setTimeout(attach, 80);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
      mountedElRef.current?.remove();
      mountedElRef.current = null;
      setPortalHost(null);
    };
  }, [canCreate, containerRef, hasMany, readOnly, uploadKey]);

  const onPasteApply = useCallback(async () => {
    const raw = pasteUrl.trim();
    if (!raw) {
      toast.error("Вставь ссылку на файл.");
      return;
    }
    let url: URL;
    try {
      url = new URL(raw);
    } catch {
      toast.error("Некорректный URL.");
      return;
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      toast.error("Нужна ссылка http(s).");
      return;
    }
    try {
      const file = await fileFromRemoteUrl(url.href);
      const dt = new DataTransfer();
      dt.items.add(file);
      await onUploadFiles(dt.files);
      setShowPaste(false);
      setPasteUrl("");
    } catch {
      toast.error(
        "Не удалось скачать по ссылке (часто мешает CORS). Скачай файл вручную и используй «Выбрать файл»."
      );
    }
  }, [onUploadFiles, pasteUrl]);

  if (hasMany || readOnly || !canCreate || !portalHost) {
    return null;
  }

  const strip = (
    <div className="upload-field--solo-quickstrip__stripInner">
      <input
        accept={accept}
        disabled={uploading}
        id={fileInputId}
        onChange={(e) => {
          void (async () => {
            if (e.target.files && e.target.files.length > 0) {
              await onUploadFiles(e.target.files);
            }
            e.target.value = "";
          })();
        }}
        style={{ display: "none" }}
        type="file"
      />
      <Button
        buttonStyle="pill"
        disabled={uploading}
        el="label"
        extraButtonProps={{ htmlFor: fileInputId }}
        margin={false}
        size="small"
      >
        Выбрать файл
      </Button>
      <span className="upload__dropzoneContent__orText">{t("general:or")}</span>
      {showPaste ? (
        <span
          style={{
            display: "inline-flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "0.35rem",
          }}
        >
          <input
            autoFocus
            disabled={uploading}
            onChange={(e) => setPasteUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void onPasteApply();
              if (e.key === "Escape") {
                setShowPaste(false);
                setPasteUrl("");
              }
            }}
            placeholder="https://…"
            style={{
              minWidth: "12rem",
              maxWidth: "100%",
              padding: "0.35rem 0.5rem",
              borderRadius: "var(--style-radius-s)",
              border: "1px solid var(--theme-elevation-150)",
              background: "var(--theme-input-bg)",
              color: "var(--theme-text)",
            }}
            type="url"
            value={pasteUrl}
          />
          <Button
            buttonStyle="pill"
            disabled={uploading}
            margin={false}
            onClick={() => void onPasteApply()}
            size="small"
          >
            OK
          </Button>
          <Button
            buttonStyle="subtle"
            disabled={uploading}
            margin={false}
            onClick={() => {
              setShowPaste(false);
              setPasteUrl("");
            }}
            size="small"
          >
            Отмена
          </Button>
        </span>
      ) : (
        <Button
          buttonStyle="pill"
          disabled={uploading}
          margin={false}
          onClick={() => setShowPaste(true)}
          size="small"
        >
          Вставить URL
        </Button>
      )}
    </div>
  );

  return createPortal(strip, portalHost);
}

export function UploadWithQuickFileComponent(props: UploadFieldClientProps) {
  const {
    field,
    field: {
      admin: { allowCreate, className, description, isSortable } = {},
      hasMany,
      label,
      localized,
      maxRows,
      relationTo: relationToFromProps,
      required,
    },
    path: pathFromProps,
    readOnly,
    validate,
  } = props;

  const cfg = useConfig();
  const apiRoute = cfg?.config?.routes?.api ?? "/api";
  const serverURL = cfg?.config?.serverURL ?? "";
  const { code: localeCode } = useLocale();
  const displayPreview = field.displayPreview;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = useState(false);

  const memoizedValidate = React.useCallback(
    (value: unknown, options: Parameters<NonNullable<typeof validate>>[1]) => {
      if (typeof validate === "function") {
        return validate(value, { ...options, required });
      }
    },
    [validate, required]
  );

  const {
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } = {},
    disabled,
    filterOptions,
    path,
    setValue,
    showError,
    value: value0,
  } = useField({
    potentiallyStalePath: pathFromProps,
    validate: memoizedValidate as never,
  });

  const isPolymorphic = Array.isArray(relationToFromProps);
  const memoizedValue = React.useMemo(() => {
    if (hasMany === true) {
      return Array.isArray(value0)
        ? value0.map((val) => {
            return isPolymorphic
              ? val
              : {
                  relationTo: Array.isArray(relationToFromProps)
                    ? relationToFromProps[0]
                    : relationToFromProps,
                  value: val,
                };
          })
        : value0;
    }
    return value0;
  }, [hasMany, value0, isPolymorphic, relationToFromProps]);

  const styles = useMemo(() => mergeFieldStyles(field), [field]);

  const onUploadFiles = useCallback(
    async (files: FileList) => {
      if (!files?.length) return;
      const slug = typeof relationToFromProps === "string" ? relationToFromProps : null;
      if (!slug) return;

      let fileList: FileList = files;
      if (!hasMany && files.length > 1) {
        const dt = new DataTransfer();
        dt.items.add(files[0]);
        fileList = dt.files;
      }
      const file = fileList[0];
      if (!file) return;

      setUploading(true);
      try {
        const id = await postUploadCreateDocument({
          file,
          collectionSlug: slug,
          apiRoute,
          serverURL,
          localeCode,
        });
        if (hasMany) {
          const prev = Array.isArray(value0) ? value0 : [];
          setValue([...prev, id]);
        } else {
          setValue(id);
        }
        toast.success("Медиа загружено");
      } catch (err: unknown) {
        const msg =
          err && typeof err === "object" && "message" in err && typeof (err as { message: unknown }).message === "string"
            ? String((err as { message: string }).message)
            : "Ошибка загрузки";
        toast.error(msg);
      } finally {
        setUploading(false);
      }
    },
    [apiRoute, serverURL, hasMany, localeCode, relationToFromProps, setValue, value0]
  );

  return (
    <BulkUploadProvider drawerSlugPrefix={pathFromProps}>
      <div className="upload-field--solo-quickstrip" ref={wrapperRef}>
        <DropzoneInlineStrip
          allowCreate={allowCreate !== false}
          containerRef={wrapperRef}
          hasMany={hasMany}
          onUploadFiles={onUploadFiles}
          readOnly={readOnly || Boolean(disabled)}
          relationTo={relationToFromProps}
          uploadKey={String(value0 ?? "")}
          uploading={uploading}
        />
        <UploadInput
          AfterInput={AfterInput}
          allowCreate={allowCreate !== false}
          api={apiRoute}
          BeforeInput={BeforeInput}
          className={className}
          Description={Description}
          description={description}
          displayPreview={displayPreview}
          Error={Error}
          filterOptions={filterOptions}
          hasMany={hasMany}
          isSortable={isSortable}
          label={label}
          Label={Label}
          localized={localized}
          maxRows={maxRows}
          onChange={setValue}
          path={path}
          readOnly={readOnly || Boolean(disabled)}
          relationTo={relationToFromProps}
          required={required}
          serverURL={serverURL}
          showError={showError}
          style={styles}
          value={memoizedValue as UploadInputProps["value"]}
        />
      </div>
    </BulkUploadProvider>
  );
}

export const UploadWithQuickFileField = withCondition(UploadWithQuickFileComponent);
