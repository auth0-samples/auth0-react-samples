const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const checkJwt = require('./helpers').checkJwt;
const transformNamespaceRoles = require('./helpers').transformNamespaceRoles;
const logRequest = require('./helpers').logRequest;
const checkScopes = require('./helpers').checkScopes;


if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {
  throw 'Make sure you have AUTH0_DOMAIN, and AUTH0_AUDIENCE in your .env file'
}

app.use(cors());
app.use(morgan('API Request (port ' + process.env.API_PORT + '): :method :url :status :response-time ms - :res[content-length]'));

// Check for JWT and transform request object
// Check for admin access - specify that we must match ALL keys
app.use(checkJwt, transformNamespaceRoles);
const checkAdminRoles = 
  checkScopes([ 'read:messages', 'role:admin' ], process.env.AUTH0_REQUEST_KEY, false);



// ROUTING
app.get('/api/public', function(req, res) {
  res.json({ message: "Hello from a public endpoint! You don't need to be authenticated to see this." });
});

app.get('/api/private', checkAdminRoles, function(req, res) {
  res.json({ message: "Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this." });
});

app.listen(process.env.API_PORT);
console.log('Server listening on http://localhost:' + process.env.API_PORT + '. The React app will be built and served at http://localhost:3000.');
