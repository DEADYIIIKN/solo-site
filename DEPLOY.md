# Деплой solo-site через Git (без сборки на прод-сервере)

## 1. Образ в GitHub Actions

При push в ветки `main` или `master` workflow **Publish solo-site image** собирает Docker-образ и пушит в **GitHub Container Registry**:

- `ghcr.io/deadyiiikn/solo-site:latest`
- `ghcr.io/deadyiiikn/solo-site:sha-<commit>`

Первый запуск: в репозитории GitHub → **Actions** → вкладка **Publish solo-site image** → разрешить workflows при необходимости.

## 2. Доступ к образу на сервере

- Если пакет **public**: достаточно `docker compose pull`.
- Если **private**: на сервере один раз выполнить `docker login ghcr.io` (Personal Access Token с правом `read:packages`).

## 3. Обновление на сервере (каталог n8n, где лежит `docker-compose.solo-site.yml`)

```bash
cd /opt/beget/n8n
docker compose -f docker-compose.solo-site.yml pull
docker compose -f docker-compose.solo-site.yml up -d
```

Сборка на сервере (`--build`) не нужна.

## 4. Локальная сборка из исходников

```bash
cd /opt/beget/n8n
docker compose -f docker-compose.solo-site.yml -f docker-compose.solo-site.build.yml up -d --build
```
