"use client";

import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";
import { Heading, Text } from "@/shared/ui/typography";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[var(--z-overlay)] bg-[var(--color-overlay)] backdrop-blur-sm" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-[var(--z-modal)] w-[calc(100vw-2rem)] max-w-[686px] -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-modal)] md:p-10"
          )}
        >
          <Dialog.Title asChild>
            <Heading level="display">{title}</Heading>
          </Dialog.Title>
          {description ? (
            <Dialog.Description asChild>
              <Text className="mt-3 max-w-[44ch]" size="md" tone="muted">
                {description}
              </Text>
            </Dialog.Description>
          ) : null}
          <div className="mt-8">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
