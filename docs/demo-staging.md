`demo.soloproduction.pro` is the staging environment for `solo-site`.

Flow:

1. Develop locally with `pnpm dev`.
2. Validate locally with `pnpm lint` and `pnpm typecheck`.
3. Build and push the Docker image outside the VPS.
4. Deploy staging to `demo.soloproduction.pro` with:

```bash
/opt/beget/n8n/solo-site/scripts/deploy-demo.sh
```

Runtime files on the VPS:

- `/opt/beget/n8n/docker-compose.solo-site.yml`
- `/opt/beget/n8n/solo-site.env.production`

This staging environment must run the production container only.
Do not keep `next dev` running on the VPS alongside the main stack.
The VPS should only pull a ready image from GHCR and restart the container.

Recommended GitHub secrets for automatic deploy:

- `DEMO_SSH_HOST`
- `DEMO_SSH_PORT`
- `DEMO_SSH_USER`
- `DEMO_SSH_KEY`
