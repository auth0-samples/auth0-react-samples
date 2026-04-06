const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import initFontAwesome from "./utils/initFontAwesome";

// Init fonts
initFontAwesome();

// Test mocks
require("jest-fetch-mock").enableMocks();
