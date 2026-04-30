#!/usr/bin/env bash
if [ ! -f .env.local ]; then
  echo "Error: .env.local not found. Copy .env.example to .env.local and fill in your credentials."
  exit 1
fi

AUTH0_DOMAIN=$(grep '^AUTH0_DOMAIN=' .env.local | cut -d '=' -f2-)
AUTH0_CLIENT_ID=$(grep '^AUTH0_CLIENT_ID=' .env.local | cut -d '=' -f2-)
AUTH0_AUDIENCE=$(grep '^AUTH0_AUDIENCE=' .env.local | cut -d '=' -f2-)
API_BASE_URL=$(grep '^API_BASE_URL=' .env.local | cut -d '=' -f2-)

docker build \
  --build-arg AUTH0_DOMAIN="$AUTH0_DOMAIN" \
  --build-arg AUTH0_CLIENT_ID="$AUTH0_CLIENT_ID" \
  --build-arg AUTH0_AUDIENCE="$AUTH0_AUDIENCE" \
  --build-arg API_BASE_URL="$API_BASE_URL" \
  -t auth0-react-02-calling-an-api .

docker run --init -p 3000:3000 -p 3001:3001 --env-file .env.local -it auth0-react-02-calling-an-api
