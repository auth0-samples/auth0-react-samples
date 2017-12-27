#!/usr/bin/env bash
docker build -t auth0-react-04-authorization .
docker run -p 3000:3000 -p 3001:3001 -it auth0-react-04-authorization
