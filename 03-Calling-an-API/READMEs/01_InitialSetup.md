fork repo
cd into 03 directory
npm install

get domain info: kurtz.auth0.com
get client id: RKGnL320bOoupWZGKhPDNexh303w0vh4
get client secret: wsKc_olBU6_eEuOjTYxqBKF27fmPyPjJ_YF_tA5bDnrHeO-diErzo2BYdsCxeL1O
- will need this for server side

configure callback urls at auth0: http://localhost:3000, http://localhost:3000/callback (include https as well for giggles)
allowed logout urls: ""
allowed origins: ""

configure api
- Auth0 Dashboard>APIs>Create new api
- for demo purposes, use identifier of http://localhost:3010 (our api endpoint)
- use RS256 algo

add a scope of read:messages - permission to read messages - to allowed scopes


rename src/Auth/auth0-variables.js.examples and enter in appropriate keys
update values in .env.example file (also rename to .env)
- note that audience should be your API url
- I also added CLIENT_ID and API_PORT
- Update server.js to use port num from .env

in src>constants.js
- update API_URL to whatever you are using (default is port 3001)

verify all buttons/actions are working correctly and check this in to solution
