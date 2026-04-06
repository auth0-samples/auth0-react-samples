describe("The config module", () => {
  beforeEach(() => {
    process.env.AUTH0_DOMAIN = "test-domain.auth0.com";
    process.env.AUTH0_CLIENT_ID = "123";
  });

  afterEach(() => {
    delete process.env.AUTH0_DOMAIN;
    delete process.env.AUTH0_CLIENT_ID;
    delete process.env.AUTH0_AUDIENCE;
    jest.resetModules();
  });

  it("should omit the audience if not set", () => {
    const { getConfig } = require("../config");

    expect(getConfig().audience).not.toBeDefined();
  });

  it("should omit the audience if left at a default value", () => {
    process.env.AUTH0_AUDIENCE = "{yourApiIdentifier}";

    const { getConfig } = require("../config");

    expect(getConfig().audience).not.toBeDefined();
  });

  it("should return the audience if specified", () => {
    process.env.AUTH0_AUDIENCE = "test-api";

    const { getConfig } = require("../config");

    expect(getConfig().audience).toEqual("test-api");
  });
});
