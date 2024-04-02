#!/bin/bash

set -e

COMPOSE_FILE="docker-compose.yml"
WD="/home/team3/project"

docker compose -f "${WD}/${COMPOSE_FILE}" down
docker compose -f "${WD}/${COMPOSE_FILE}" pull
docker compose -f "${WD}/${COMPOSE_FILE}" up -d --no-build

set +e
