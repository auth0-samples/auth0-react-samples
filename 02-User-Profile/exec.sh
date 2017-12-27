#!/usr/bin/env bash
docker build -t auth0-react-02-user-profile .
docker run -p 3000:3000 -it auth0-react-02-user-profile
