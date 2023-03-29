const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const {
  auth,
  InvalidTokenError,
  InvalidRequestError,
  InsufficientScopeError,
  requiredScopes,
} = require("express-oauth2-jwt-bearer");
const authConfig = require("./src/auth_config.json");

const app = express();

const port = process.env.API_PORT || 3001;
const appPort = process.env.SERVER_PORT || 3000;
const appOrigin = authConfig.appOrigin || `http://localhost:${appPort}`;

if (!authConfig.domain || !authConfig.audience || authConfig.audience === "YOUR_API_IDENTIFIER") {
  console.log(
    "Exiting: Please make sure that auth_config.json is in place and populated with valid domain and audience values"
  );

  process.exit();
}

app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ origin: appOrigin }));

app.use(
  auth({
    audience: authConfig.audience,
    issuerBaseURL: `https://${authConfig.domain}/`,
    algorithms: ["RS256"],
  })
);

app.get("/api/external", requiredScopes('admin'), (req, res) => {
  res.send({
    msg: "Your access token was successfully validated!",
  });
});

// Custom error handler that will turn the errors from express-oauth2-jwt-bearer into a JSON object
// for the UI to handle
app.use((err, req, res, next) => {
  if (
    err instanceof InvalidTokenError ||
    err instanceof InvalidRequestError ||
    err instanceof InsufficientScopeError
  ) {
    return res.status(err.status).send({
      error: err.code,
      message: err.message,
    });
  }

  res.send(err);
});

app.listen(port, () => console.log(`API Server listening on port ${port}`));
