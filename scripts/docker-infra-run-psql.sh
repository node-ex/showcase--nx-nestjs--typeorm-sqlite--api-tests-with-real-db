#!/usr/bin/env bash

set -e

docker container run \
    --rm \
    --tty \
    --interactive \
    --network showcase--network--default \
    postgres:16.3-alpine3.20 \
    psql \
    --host showcase--postgres \
    --port 5432 \
    --username postgres \
    --dbname postgres
