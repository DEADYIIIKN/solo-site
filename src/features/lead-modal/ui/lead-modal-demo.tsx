"use client";

import { useState } from "react";

import { Button } from "@/shared/ui/button";
import { Modal } from "@/shared/ui/modal";

export function LeadModalDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Открыть модалку
      </Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Базовый паттерн модалки"
        description="Для проекта фиксируем единый подход: портал, overlay, lock scroll, focus trap и один контейнерный шаблон."
      >
        <div className="space-y-4 text-sm leading-6 text-[var(--color-text-muted)]">
          <p>
            Контент модалок собирается как feature-компонент, а не размазывается по секциям
            страницы.
          </p>
          <Button onClick={() => setOpen(false)}>Закрыть</Button>
        </div>
      </Modal>
    </>
  );
}
