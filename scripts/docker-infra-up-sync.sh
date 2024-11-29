#!/usr/bin/env bash

set -e

./scripts/docker-infra-up.sh --detach $@

POSTGRES_CONTAINER_NAME="showcase--postgres"

while [ "$(docker inspect --format='{{.State.Health.Status}}' "$POSTGRES_CONTAINER_NAME")" != "healthy" ]; do
    sleep 5
done

npm run typeorm-ds -- migration:run
