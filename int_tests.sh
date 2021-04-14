#!/bin/bash -eo pipefail

if [ "docker ps -qaf name=tester" ]; then
  docker rm -f tester
fi

docker create --network host --name tester codeception/codeceptjs codeceptjs run-multiple --all --steps --verbose
docker cp $(pwd)/lock_login_spa_test.js tester:/tests/lock_login_test.js
docker cp $(pwd)/codecept.conf.js tester:/tests/codecept.conf.js
docker start -i tester