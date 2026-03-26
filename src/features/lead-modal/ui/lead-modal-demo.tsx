"use client";

import { useState } from "react";

import { Button } from "@/shared/ui/button";
import { Field } from "@/shared/ui/field";
import { Modal } from "@/shared/ui/modal";
import { Text } from "@/shared/ui/typography";

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
        <div className="space-y-6">
          <Text size="md" tone="muted">
            Контент модалок собирается как feature-компонент, а не размазывается по секциям
            страницы.
          </Text>
          <div className="grid gap-5 md:grid-cols-2">
            <Field placeholder="Ваше имя" />
            <Field placeholder="Номер телефона" />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button>Оставить заявку</Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Закрыть
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
