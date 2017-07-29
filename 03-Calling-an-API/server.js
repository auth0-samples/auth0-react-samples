const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();


if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {
  throw 'Make sure you have AUTH0_DOMAIN, and AUTH0_AUDIENCE in your .env file'
}

app.use(cors());
app.use(morgan('API Request (port ' + process.env.API_PORT + '): :method :url :status :response-time ms - :res[content-length]'));

// we need to reference audience with a /
const namespace = process.env.AUTH0_AUDIENCE + '/';

// from Auth0
const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

// This was provided by auth0 - still not sure why, there is no way to 
// provide any other option but to include this with all users. 
// I much prefer the roles approach
const checkScopes = jwtAuthz([ 'read:messages' ]);

// The default is an OR check on required roles
// Specify comparison = 'AND" if you need all roles to 
const checkRoles = function(namespace, validRoles, comparison = 'OR') {

  if (!Array.isArray(validRoles)){
    throw new Error('Parameter validRoles must be an array of strings representing the required role(s) for the endpoint(s)');
  }

  return function(req, res, next) {
    if (validRoles.length === 0){ return next(); }
    if (!req.user ) { return new Error(res); }

    // ensure a role key
    const roleKey = Object.keys(req.user).filter(key => {      
      return key === (namespace + 'roles');
    }); 
    if(!roleKey) { return new Error(res); }

    const userRoles = req.user[roleKey];
    if (Object.keys(userRoles).length === 0) { return new Error(res); }
    
    // default comparison is OR - use as a fallback to any other implementation
    const allowed = (comparison === 'AND') ?  
      validRoles.every(function(role){
        return userRoles.indexOf(role) !== -1;
      }) : 
      validRoles.some(function(role){
        return userRoles.indexOf(role) !== -1;
      });

    return allowed ?
      next() :
      new Error(res);
  }
};

// ROUTES
app.get('/api/public', function(req, res) {
  res.json({ message: "Hello from a public endpoint! You don't need to be authenticated to see this." });
});

// app.get('/api/private', checkJwt, checkScopes, function(req, res) {
// app.get('/api/private', checkJwt, checkScopes, checkRoles(namespace, ['admin', 'super', 'contract'], 'AND'), function(req, res) {// shuold fail - no contract roles defined for any users
app.get('/api/private', checkJwt, checkScopes, checkRoles(namespace, ['admin', 'super', 'contract']), function(req, res) {
  res.json({ message: "Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this." });
});

app.listen(process.env.API_PORT);
console.log('Server listening on http://localhost:' + process.env.API_PORT + '. The React app will be built and served at http://localhost:3000.');
