docker build --rm -t auth0-react-01-login .
docker run --init -p 3000:3000 -it auth0-react-01-login
