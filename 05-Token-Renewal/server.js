const express = require("express");
const app = express();
const cors = require("cors");
const staticFile = require("connect-static-file");

app.use(cors());

app.listen(3001);
console.log(
  "Server listening on http://localhost:3001. The React app will be built and served at http://localhost:3000."
);
