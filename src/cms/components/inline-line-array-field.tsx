"use client";

import {
  Banner,
  Button,
  Collapsible,
  ErrorPill,
  FieldDescription,
  FieldError,
  FieldLabel,
  NullifyLocaleField,
  RenderCustomComponent,
  useField,
  useForm,
  useFormSubmitted,
  useTranslation,
} from "@payloadcms/ui";
import { DraggableSortable } from "@payloadcms/ui/elements/DraggableSortable";
import { DraggableSortableItem } from "@payloadcms/ui/elements/DraggableSortable/DraggableSortableItem";
import { fieldBaseClass } from "@payloadcms/ui/fields/shared";
import type { ArrayFieldClientComponent } from "payload";
import type { CSSProperties } from "react";
import React, { useCallback, useId, useMemo } from "react";

const baseClass = "array-field";

function mergeFieldStyles(field: {
  admin?: { style?: CSSProperties; width?: string | number };
}) {
  return {
    ...(field?.admin?.style || {}),
    ...(field?.admin?.width != null
      ? { "--field-width": String(field.admin.width) }
      : {
          flex: "1 1 auto",
        }),
    ...(field?.admin?.style?.flex ? { flex: field.admin.style.flex } : {}),
  } as CSSProperties;
}

function labelToFallback(label: unknown, fallback: string): string {
  if (typeof label === "string") return label;
  return fallback;
}

function LineInlineInput({
  linePath,
  readOnly,
}: {
  linePath: string;
  readOnly?: boolean;
}) {
  const { value, setValue, showError } = useField<string>({ path: linePath });

  return (
    <input
      className={`field-type__input${showError ? " error" : ""}`}
      disabled={readOnly}
      onChange={e => {
        setValue(e.target.value);
      }}
      style={{ flex: 1, minWidth: 0, width: "100%" }}
      type="text"
      value={value ?? ""}
    />
  );
}

export const InlineLineArrayField: ArrayFieldClientComponent = props => {
  const {
    field,
    field: {
      admin: { className, description, isSortable = true } = {},
      label,
      localized,
      maxRows,
      minRows: minRowsProp,
      name,
      required,
    },
    path: pathFromProps,
    readOnly,
    schemaPath: schemaPathFromProps,
    validate,
  } = props;

  const schemaPath = schemaPathFromProps ?? name;
  const minRows = minRowsProp ?? (required ? 1 : 0);

  const { addFieldRow, moveFieldRow, removeFieldRow } = useForm();
  const submitted = useFormSubmitted();
  const { i18n, t } = useTranslation();

  const memoizedValidate = useCallback(
    (value: unknown, options: unknown) => {
      if (typeof validate === "function") {
        return validate(value as never, options as never);
      }
    },
    [validate],
  );

  const {
    customComponents: {
      AfterInput,
      BeforeInput,
      Description: CustomDescription,
      Error: CustomError,
      Label: CustomLabel,
    } = {},
    disabled,
    errorPaths = [],
    path,
    rows = [],
    showError,
    valid,
    value: valueFromField,
  } = useField({
    hasRows: true,
    potentiallyStalePath: pathFromProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Payload Validate generics vs array field
    validate: memoizedValidate as any,
  });

  const componentId = useId();
  const scrollIdPrefix = useMemo(() => `scroll-${componentId}`, [componentId]);

  const addRow = useCallback(
    (rowIndex: number) => {
      addFieldRow({
        path,
        rowIndex,
        schemaPath,
      });
    },
    [addFieldRow, path, schemaPath],
  );

  const removeRow = useCallback(
    (rowIndex: number) => {
      removeFieldRow({
        path,
        rowIndex,
      });
    },
    [removeFieldRow, path],
  );

  const moveRow = useCallback(
    (moveFromIndex: number, moveToIndex: number) => {
      moveFieldRow({
        moveFromIndex,
        moveToIndex,
        path,
      });
    },
    [moveFieldRow, path],
  );

  const labels = (() => {
    if (field.labels) {
      return field.labels;
    }
    if ("label" in field && field.label) {
      return { plural: undefined, singular: field.label };
    }
    return { plural: t("general:rows"), singular: t("general:row") };
  })();

  const hasMaxRows = maxRows && rows.length >= maxRows;
  const fieldErrorCount = errorPaths.length;
  const fieldHasErrors = submitted && errorPaths.length > 0;
  const showRequired = (readOnly || disabled) && rows.length === 0;
  const showMinRows = (rows.length && rows.length < minRows) || (required && rows.length === 0);

  const styles = useMemo(() => mergeFieldStyles(field), [field]);

  return (
    <div
      className={[fieldBaseClass, baseClass, className, fieldHasErrors ? `${baseClass}--has-error` : `${baseClass}--has-no-error`]
        .filter(Boolean)
        .join(" ")}
      id={`field-${path.replace(/\./g, "__")}`}
      style={styles}
    >
      {showError && (
        <RenderCustomComponent
          CustomComponent={CustomError}
          Fallback={<FieldError path={path} showError={showError} />}
        />
      )}
      <header className={`${baseClass}__header`}>
        <div className={`${baseClass}__header-wrap`}>
          <div className={`${baseClass}__header-content`}>
            <h3 className={`${baseClass}__title`}>
              <RenderCustomComponent
                CustomComponent={CustomLabel}
                Fallback={<FieldLabel as="span" label={label} localized={localized} path={path} required={required} />}
              />
            </h3>
            {fieldHasErrors && fieldErrorCount > 0 && <ErrorPill count={fieldErrorCount} i18n={i18n} withMessage />}
          </div>
        </div>
      </header>
      <RenderCustomComponent
        CustomComponent={CustomDescription}
        Fallback={<FieldDescription description={description} path={path} />}
      />
      <NullifyLocaleField
        fieldValue={valueFromField as [] | null | number | undefined}
        localized={Boolean(localized)}
        path={path}
        readOnly={Boolean(readOnly)}
      />
      {BeforeInput}
      {(rows.length > 0 || (!valid && (showRequired || showMinRows))) && (
        <DraggableSortable
          className={`${baseClass}__draggable-rows`}
          ids={rows.map(row => row.id)}
          onDragEnd={({ moveFromIndex, moveToIndex }) => moveRow(moveFromIndex, moveToIndex)}
        >
          {rows.map((rowData, i) => {
            const rowPath = `${path}.${i}`;
            const linePath = `${rowPath}.line`;
            const rowErrorCount = errorPaths.filter(errorPath => errorPath.startsWith(`${rowPath}.`)).length;
            const rowFieldHasErrors = rowErrorCount > 0 && submitted;
            const rowClassNames = [
              `${baseClass}__row`,
              rowFieldHasErrors ? `${baseClass}__row--has-errors` : `${baseClass}__row--no-errors`,
            ].join(" ");

            return (
              <DraggableSortableItem disabled={readOnly || disabled || !isSortable} id={rowData.id} key={rowData.id}>
                {draggableProps => (
                  <Collapsible
                    actions={
                      !readOnly ? (
                        <Button
                          aria-label="Удалить строку"
                          buttonStyle="transparent"
                          icon="x"
                          onClick={() => removeRow(i)}
                          round
                          size="small"
                          tooltip="Удалить строку"
                          type="button"
                        />
                      ) : undefined
                    }
                    className={rowClassNames}
                    collapsibleStyle={rowFieldHasErrors ? "error" : "default"}
                    disableHeaderToggle
                    disableToggleIndicator
                    dragHandleProps={
                      isSortable
                        ? {
                            id: rowData.id,
                            attributes: draggableProps.attributes,
                            listeners: draggableProps.listeners,
                          }
                        : undefined
                    }
                    header={
                      <div
                        className={`${baseClass}__row-header`}
                        id={`${scrollIdPrefix}-row-${i}`}
                        style={{ pointerEvents: "auto", width: "100%" }}
                      >
                        <LineInlineInput linePath={linePath} readOnly={readOnly || disabled} />
                        {rowFieldHasErrors && <ErrorPill count={rowErrorCount} i18n={i18n} withMessage />}
                      </div>
                    }
                    isCollapsed
                    onToggle={() => {}}
                  >
                    {null}
                  </Collapsible>
                )}
              </DraggableSortableItem>
            );
          })}
          {!valid && (
            <>
              {showRequired && (
                <Banner>
                  {t("validation:fieldHasNo", {
                    label: labelToFallback(labels.plural, t("general:rows")),
                  })}
                </Banner>
              )}
              {showMinRows && (
                <Banner type="error">
                  {t("validation:requiresAtLeast", {
                    count: minRows,
                    label: labelToFallback(
                      minRows > 1 ? labels.plural : labels.singular,
                      t(minRows > 1 ? "general:rows" : "general:row"),
                    ),
                  })}
                </Banner>
              )}
            </>
          )}
        </DraggableSortable>
      )}
      {!hasMaxRows && !readOnly && (
        <Button
          buttonStyle="icon-label"
          className={`${baseClass}__add-row`}
          disabled={disabled}
          icon="plus"
          iconPosition="left"
          iconStyle="with-border"
          onClick={() => {
            void addRow((valueFromField as number) || 0);
          }}
        >
          {t("fields:addLabel", {
            label: labelToFallback(labels.singular, t("general:row")),
          })}
        </Button>
      )}
      {AfterInput}
    </div>
  );
};
