const mockConfig = (config) => {
  // doMock is not hoisted to the top, which means we can mock the module
  // on a per-test basis. Jest does not return mock objects
  // for these types of static file modules.
  jest.doMock(
    "../auth_config.json",
    () => ({
      domain: "test-domain.com",
      clientId: "123",
      ...config,
    }),
    { virtual: true }
  );
};

describe("The config module", () => {
  afterEach(() => {
    jest.resetModules();
  });

  it("should omit the audience if not in the config json", () => {
    mockConfig();

    const { getConfig } = require("../config");

    expect(getConfig().audience).not.toBeDefined();
  });

  it("should omit the audience if left at a default value", () => {
    mockConfig({ audience: "{yourApiIdentifier}" });

    const { getConfig } = require("../config");

    expect(getConfig().audience).not.toBeDefined();
  });

  it("should return the audience if specified", () => {
    mockConfig({ audience: "test-api" });

    const { getConfig } = require("../config");

    expect(getConfig().audience).toEqual("test-api");
  });
});
