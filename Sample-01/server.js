const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const { join } = require("path");
const RateLimit = require("express-rate-limit");

const app = express();

const port = +(process.env.SERVER_PORT ?? '3000');

// Limit to 100 requests per 15 minutes
const limiter = new RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.use(morgan("dev"));

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(express.static(join(__dirname, "build")));

app.get('*', (req, res) => res.sendFile(join(__dirname, 'build', 'index.html')));

app.listen(port, () => console.log(`Server listening on port ${port}`));
