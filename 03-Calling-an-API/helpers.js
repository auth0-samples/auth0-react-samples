
exports.logRequest = function(req, res, next) {
  // both .user and auth0 are undefined prior to  running through checkJwt func
  // console.log('REQUEST', req); 
  // console.log('REQUEST', req.user); 
  console.log('REQUEST', req.auth0); 
  next();
};

const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
require('dotenv').config();

// we need to reference audience with a /
const namespace = process.env.AUTH0_AUDIENCE + '/';
const auth0RequestKey = process.env.AUTH0_REQUEST_KEY;
const roleKey = namespace + 'roles';

exports.checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  credentialsRequired: false,

  // default property is user - but since that is used by other plugins, etc
  // let's customize the key
  requestProperty: auth0RequestKey,

  // Validate the audience and the issuer.
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

// Checking the req.user object for any keys matching our 
// namespace + '/roles' and transferring those scopes to the scope string
exports.transformNamespaceRoles = function (req, res, next) {
  // console.log('HERE')
  // ensure presence of auth0RequestKey
  if (!req[auth0RequestKey]) { return next(); }

  // find role keys
  const roles = req[auth0RequestKey][roleKey];
  
  // if we find roles -> transform into scope so that check can do it's job
  if(roles && roles.length > 0) {
    // get existing or create a new scope object and transfrom into an array
    var scope = req[auth0RequestKey].scope || '';    
    scope = scope.split(' ');

    // transform roles entries into scope keys and convert back to string
    roles.map(role => {
      scope.push('role:' + role);
    });
    req[auth0RequestKey].scope = scope.join(' ');

    // cleanup key - no longer needed
    delete req[auth0RequestKey][roleKey];
  }

  next();
}


// Standardize the failure response
function error(res){
  return res.status(401).send('Insufficient scope');
};

// This is a copy of the PR submitted to express-jwt-authz
exports.checkScopes = function(expectedScopes, requestObjectKey = 'user', compareAny = true) {

  if (!Array.isArray(expectedScopes)){
    throw new Error('Parameter expectedScopes must be an array of strings representing the scopes for the endpoint(s)');
  }

  if(requestObjectKey === null || 
    !(typeof requestObjectKey === 'string' || 
      (typeof requestObjectKey === "object" && requestObjectKey.constructor === String))){
    throw new Error('Parameter requestObjectKey must be a string value');
  }
  
  if(compareAny === null || (typeof compareAny !== 'boolean')){
    throw new Error('Parameter copmareAny must be a boolean value');
  }

  console.log('SETUP');

  return function(req, res, next) {
    if (expectedScopes.length === 0){
      return next();
    }

    if (!req[requestObjectKey] || typeof req[requestObjectKey].scope !== 'string') { return error(res); }
    
    var userScopes = req[requestObjectKey].scope.split(' ');

    var allowed = (!compareAny) ? 
        expectedScopes.every(function(scope){
          return userScopes.indexOf(scope) !== -1;
        }) :
        // ANY is default compareAny option
        expectedScopes.some(function(scope){
          return userScopes.indexOf(scope) !== -1;
        });

    return allowed ?
      next() :
      error(res);
  }
};
