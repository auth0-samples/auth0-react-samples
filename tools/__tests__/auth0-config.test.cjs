const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const yaml = require("js-yaml");

describe("auth0-config.cjs - Core Configuration Writing", () => {
  const projectRoot = path.join(__dirname, "..", "..");
  const testEnvFile = path.join(projectRoot, ".env.local");
  const backupEnvFile = path.join(projectRoot, ".env.local.backup");
  const configScript = path.join(__dirname, "..", "auth0-config.cjs");
  const yamlPath = path.join(
    projectRoot,
    "quickstart",
    "quickstart-login.yaml",
  );

  // Read default port from YAML config
  const getDefaultPort = () => {
    const quickstartConfig = yaml.load(fs.readFileSync(yamlPath, "utf8"));
    return quickstartConfig.inputs.port.default;
  };

  beforeEach(() => {
    // Backup existing .env.local if it exists
    if (fs.existsSync(testEnvFile)) {
      fs.copyFileSync(testEnvFile, backupEnvFile);
      fs.unlinkSync(testEnvFile);
    }
  });

  afterEach(() => {
    // Clean up test .env.local
    if (fs.existsSync(testEnvFile)) {
      fs.unlinkSync(testEnvFile);
    }

    // Restore backup if it exists
    if (fs.existsSync(backupEnvFile)) {
      fs.copyFileSync(backupEnvFile, testEnvFile);
      fs.unlinkSync(backupEnvFile);
    }
  });

  const runConfigScript = (domain, clientId, port = null) => {
    const args = [
      "node",
      configScript,
      "--domain",
      domain,
      "--clientId",
      clientId,
    ];
    if (port) {
      args.push("--port", port);
    }

    const result = execSync(args.join(" "), {
      encoding: "utf8",
      cwd: projectRoot,
    });
    return result;
  };

  test("should create .env.local file when it doesn't exist", () => {
    expect(fs.existsSync(testEnvFile)).toBe(false);

    runConfigScript("test-domain.auth0.com", "test-client-id", "3000");

    expect(fs.existsSync(testEnvFile)).toBe(true);
    const content = fs.readFileSync(testEnvFile, "utf8");
    expect(content).toContain("VITE_AUTH0_DOMAIN=test-domain.auth0.com");
    expect(content).toContain("VITE_AUTH0_CLIENT_ID=test-client-id");
    expect(content).toContain("PORT=3000");
  });

  test("should write correctly formatted Auth0 configuration", () => {
    runConfigScript("my-tenant.auth0.com", "abc123def456", "8080");

    const content = fs.readFileSync(testEnvFile, "utf8");
    const lines = content.split("\n").filter((line) => line.trim());

    expect(lines).toContain("VITE_AUTH0_DOMAIN=my-tenant.auth0.com");
    expect(lines).toContain("VITE_AUTH0_CLIENT_ID=abc123def456");
    expect(lines).toContain("PORT=8080");
  });

  test("should use default port when not provided", () => {
    runConfigScript("test-domain.auth0.com", "test-client-id");

    const content = fs.readFileSync(testEnvFile, "utf8");
    const defaultPort = getDefaultPort();
    expect(content).toContain(`PORT=${defaultPort}`);
  });

  test("should comment out existing values before adding new ones", () => {
    // Create initial .env.local with existing values
    const initialContent = `VITE_AUTH0_DOMAIN=old-domain.auth0.com
VITE_AUTH0_CLIENT_ID=old-client-id
PORT=4000
OTHER_VAR=keep-this
`;
    fs.writeFileSync(testEnvFile, initialContent);

    runConfigScript("new-domain.auth0.com", "new-client-id", "5000");

    const content = fs.readFileSync(testEnvFile, "utf8");

    // Check that old values are commented out
    expect(content).toContain("# VITE_AUTH0_DOMAIN=old-domain.auth0.com");
    expect(content).toContain("# VITE_AUTH0_CLIENT_ID=old-client-id");
    expect(content).toContain("# PORT=4000");

    // Check that new values are added
    expect(content).toContain("VITE_AUTH0_DOMAIN=new-domain.auth0.com");
    expect(content).toContain("VITE_AUTH0_CLIENT_ID=new-client-id");
    expect(content).toContain("PORT=5000");

    // Check that unmanaged variables are preserved (not commented out)
    const lines = content.split("\n");
    const otherVarLine = lines.find((line) =>
      line.includes("OTHER_VAR=keep-this"),
    );
    expect(otherVarLine).toBeTruthy();
    expect(otherVarLine.trim()).toBe("OTHER_VAR=keep-this");
    expect(otherVarLine).not.toMatch(/^\s*#/);
  });

  test("should preserve unmanaged environment variables", () => {
    const initialContent = `# Some comment
VITE_AUTH0_DOMAIN=old-domain.auth0.com
CUSTOM_API_URL=https://api.example.com
NODE_ENV=development
VITE_AUTH0_CLIENT_ID=old-client-id

# Another comment
DEBUG=true
PORT=3000
`;
    fs.writeFileSync(testEnvFile, initialContent);

    runConfigScript("updated-domain.auth0.com", "updated-client-id");

    const content = fs.readFileSync(testEnvFile, "utf8");
    const lines = content.split("\n");

    // Unmanaged variables should remain unchanged (not commented out)
    const customApiLine = lines.find((line) =>
      line.includes("CUSTOM_API_URL="),
    );
    const nodeEnvLine = lines.find((line) => line.includes("NODE_ENV="));
    const debugLine = lines.find((line) => line.includes("DEBUG="));

    expect(customApiLine.trim()).toBe("CUSTOM_API_URL=https://api.example.com");
    expect(customApiLine).not.toMatch(/^\s*#/);

    expect(nodeEnvLine.trim()).toBe("NODE_ENV=development");
    expect(nodeEnvLine).not.toMatch(/^\s*#/);

    expect(debugLine.trim()).toBe("DEBUG=true");
    expect(debugLine).not.toMatch(/^\s*#/);

    // Comments should be preserved
    expect(content).toContain("# Some comment");
    expect(content).toContain("# Another comment");

    // Managed variables should be updated
    expect(content).toContain("# VITE_AUTH0_DOMAIN=old-domain.auth0.com");
    expect(content).toContain("VITE_AUTH0_DOMAIN=updated-domain.auth0.com");
  });

  test("should handle complex .env.local with mixed content", () => {
    const initialContent = `# Development configuration
NODE_ENV=development

# Auth0 config
VITE_AUTH0_DOMAIN=existing.auth0.com
VITE_AUTH0_CLIENT_ID=existing123
PORT=4000

# API configuration  
API_BASE_URL=http://localhost:8000
API_TIMEOUT=5000

# Feature flags
ENABLE_FEATURE_X=true
`;
    fs.writeFileSync(testEnvFile, initialContent);

    runConfigScript("complex.auth0.com", "complex456", "6000");

    const content = fs.readFileSync(testEnvFile, "utf8");
    const lines = content.split("\n");

    // Should preserve all non-Auth0 variables and comments (not commented out)
    expect(content).toContain("# Development configuration");
    expect(content).toContain("# API configuration");
    expect(content).toContain("# Feature flags");

    const nodeEnvLine = lines.find((line) => line.includes("NODE_ENV="));
    const apiBaseUrlLine = lines.find((line) => line.includes("API_BASE_URL="));
    const apiTimeoutLine = lines.find((line) => line.includes("API_TIMEOUT="));
    const featureFlagLine = lines.find((line) =>
      line.includes("ENABLE_FEATURE_X="),
    );

    expect(nodeEnvLine.trim()).toBe("NODE_ENV=development");
    expect(nodeEnvLine).not.toMatch(/^\s*#/);

    expect(apiBaseUrlLine.trim()).toBe("API_BASE_URL=http://localhost:8000");
    expect(apiBaseUrlLine).not.toMatch(/^\s*#/);

    expect(apiTimeoutLine.trim()).toBe("API_TIMEOUT=5000");
    expect(apiTimeoutLine).not.toMatch(/^\s*#/);

    expect(featureFlagLine.trim()).toBe("ENABLE_FEATURE_X=true");
    expect(featureFlagLine).not.toMatch(/^\s*#/);

    // Should comment out old Auth0 values
    expect(content).toContain("# VITE_AUTH0_DOMAIN=existing.auth0.com");
    expect(content).toContain("# VITE_AUTH0_CLIENT_ID=existing123");
    expect(content).toContain("# PORT=4000");

    // Should add new Auth0 values
    expect(content).toContain("VITE_AUTH0_DOMAIN=complex.auth0.com");
    expect(content).toContain("VITE_AUTH0_CLIENT_ID=complex456");
    expect(content).toContain("PORT=6000");
  });

  describe("Argument Parsing", () => {
    // Table-driven tests for valid argument combinations
    const validArgumentTestCases = [
      {
        name: "should parse basic --domain and --clientId arguments",
        domain: "test.auth0.com",
        clientId: "client123",
        port: "8000",
        expectedPort: "8000",
      },
      {
        name: "should handle Auth0 domains with special characters",
        domain: "my-tenant-123.eu.auth0.com",
        clientId: "abc123_def-456",
        port: "3000",
        expectedPort: "3000",
      },
      {
        name: "should use default port when not provided",
        domain: "test.auth0.com",
        clientId: "client123",
        port: null,
        expectedPort: null, // Will use getDefaultPort()
      },
    ];

    validArgumentTestCases.forEach(
      ({ name, domain, clientId, port, expectedPort }) => {
        test(name, () => {
          if (port) {
            runConfigScript(domain, clientId, port);
          } else {
            runConfigScript(domain, clientId);
          }

          const content = fs.readFileSync(testEnvFile, "utf8");
          expect(content).toContain(`VITE_AUTH0_DOMAIN=${domain}`);
          expect(content).toContain(`VITE_AUTH0_CLIENT_ID=${clientId}`);

          if (expectedPort) {
            expect(content).toContain(`PORT=${expectedPort}`);
          } else {
            const defaultPort = getDefaultPort();
            expect(content).toContain(`PORT=${defaultPort}`);
          }
        });
      },
    );

    // Table-driven tests for missing required arguments
    const missingArgumentTestCases = [
      {
        name: "should handle missing --domain argument",
        args: ["node", configScript, "--clientId", "test-client-id"],
        expectedError: "--domain argument is required",
      },
      {
        name: "should handle missing --clientId argument",
        args: ["node", configScript, "--domain", "test.auth0.com"],
        expectedError: "--clientId argument is required",
      },
      {
        name: "should handle missing both required arguments",
        args: ["node", configScript],
        expectedError: "--domain argument is required",
      },
    ];

    missingArgumentTestCases.forEach(({ name, args, expectedError }) => {
      test(name, () => {
        expect(() => {
          execSync(args.join(" "), {
            encoding: "utf8",
            cwd: projectRoot,
          });
        }).toThrow();
      });

      test(`${name} (shows error message)`, () => {
        try {
          execSync(args.join(" "), {
            encoding: "utf8",
            cwd: projectRoot,
          });
          fail("Expected command to throw");
        } catch (error) {
          expect(error.stderr.toString()).toContain(expectedError);
          expect(error.stderr.toString()).toContain("Usage:");
        }
      });
    });

    // Table-driven tests for malformed arguments
    const malformedArgumentTestCases = [
      {
        name: "should handle malformed arguments (missing values for clientId)",
        args: [
          "node",
          configScript,
          "--domain",
          "test.auth0.com",
          "--clientId", // Missing value for clientId
        ],
      },
      {
        name: "should handle malformed arguments (missing values for domain)",
        args: [
          "node",
          configScript,
          "--domain", // Missing value for domain - will take --clientId as value
          "--clientId",
          "test-client-id",
        ],
      },
    ];

    malformedArgumentTestCases.forEach(({ name, args }) => {
      test(name, () => {
        expect(() => {
          execSync(args.join(" "), {
            encoding: "utf8",
            cwd: projectRoot,
          });
        }).toThrow(); // Should fail because one of the required args will be undefined
      });
    });

    test("should handle non-numeric port values", () => {
      const args = [
        "node",
        configScript,
        "--domain",
        "test.auth0.com",
        "--clientId",
        "test-client-id",
        "--port",
        "not-a-number",
      ];

      // The script should fail when port is not a number
      expect(() => {
        execSync(args.join(" "), {
          encoding: "utf8",
          cwd: projectRoot,
        });
      }).toThrow();
    });

    test("should demonstrate issue with unquoted spaces in arguments", () => {
      // This test demonstrates why spaces in arguments cause issues
      // When join(" ") is used: "node script --domain test.auth0.com --clientId client with spaces"
      // The shell parses this as: --clientId="client", then "with" and "spaces" as extra args
      const args = [
        "node",
        configScript,
        "--domain",
        "test.auth0.com",
        "--clientId",
        "client with spaces", // This gets truncated to just "client"
      ];

      const result = execSync(args.join(" "), {
        encoding: "utf8",
        cwd: projectRoot,
      });

      const content = fs.readFileSync(testEnvFile, "utf8");

      // This demonstrates the unwanted behavior - only "client" is captured
      expect(content).toContain("VITE_AUTH0_CLIENT_ID=client");
      expect(content).not.toContain("VITE_AUTH0_CLIENT_ID=client with spaces");
    });
  });
});

describe("validateEnvConfig", () => {
  const { validateEnvConfig } = require("../auth0-config.cjs");

  const validConfig = {
    fileName: ".env.local",
    entries: [
      { type: "var", name: "DOMAIN", value: "%AUTH0_DOMAIN%" },
      { type: "var", name: "PORT", value: "%PORT%" },
    ],
  };

  test("should return var entries for valid config", () => {
    const result = validateEnvConfig(validConfig, "test.yaml");
    expect(result).toEqual([
      { type: "var", name: "DOMAIN", value: "%AUTH0_DOMAIN%" },
      { type: "var", name: "PORT", value: "%PORT%" },
    ]);
  });

  test("should reject missing envSnippet", () => {
    expect(() => validateEnvConfig(null, "test.yaml")).toThrow(
      "envSnippet property is missing",
    );
  });

  test("should reject entries that is not an array", () => {
    expect(() =>
      validateEnvConfig(
        { fileName: ".env.local", entries: "not-an-array" },
        "test.yaml",
      ),
    ).toThrow("must have `entries` array");
  });

  test("should reject missing fileName", () => {
    expect(() =>
      validateEnvConfig({ entries: [{ type: "var", name: "X", value: "Y" }] }, "test.yaml"),
    ).toThrow("must have `fileName` specified");
  });

  test("should reject entry with missing name", () => {
    expect(() =>
      validateEnvConfig(
        { fileName: ".env.local", entries: [{ type: "var", value: "val" }] },
        "test.yaml",
      ),
    ).toThrow("must have `name` and `value`");
  });

  test("should reject entry with null value (js-yaml parses missing fields as null)", () => {
    expect(() =>
      validateEnvConfig(
        { fileName: ".env.local", entries: [{ type: "var", name: "X", value: null }] },
        "test.yaml",
      ),
    ).toThrow("must have `name` and `value`");
  });

  test("should reject entry with undefined value", () => {
    expect(() =>
      validateEnvConfig(
        { fileName: ".env.local", entries: [{ type: "var", name: "X" }] },
        "test.yaml",
      ),
    ).toThrow("must have `name` and `value`");
  });

  test("should filter out non-var entries", () => {
    const config = {
      fileName: ".env.local",
      entries: [
        { type: "comment", text: "ignored" },
        { type: "var", name: "KEEP", value: "yes" },
      ],
    };
    const result = validateEnvConfig(config, "test.yaml");
    expect(result).toEqual([{ type: "var", name: "KEEP", value: "yes" }]);
  });

  test("should accept numeric values without throwing", () => {
    const config = {
      fileName: ".env.local",
      entries: [{ type: "var", name: "PORT", value: 3000 }],
    };
    const result = validateEnvConfig(config, "test.yaml");
    expect(result).toEqual([{ type: "var", name: "PORT", value: 3000 }]);
  });

  test("should accept empty entries array", () => {
    const config = { fileName: ".env.local", entries: [] };
    const result = validateEnvConfig(config, "test.yaml");
    expect(result).toEqual([]);
  });
});

describe("parseEnvLines", () => {
    const { parseEnvLines } = require("../auth0-config.cjs");

    test("should parse active KEY=VALUE lines", () => {
      const result = parseEnvLines("FOO=bar");
      expect(result).toEqual([
        { type: "active", key: "FOO", value: "bar", trimmedValue: "bar", line: "FOO=bar" },
      ]);
    });

    test("should preserve values containing '=' signs", () => {
      const result = parseEnvLines("URL=https://example.com?a=1&b=2");
      expect(result).toEqual([
        {
          type: "active",
          key: "URL",
          value: "https://example.com?a=1&b=2",
          trimmedValue: "https://example.com?a=1&b=2",
          line: "URL=https://example.com?a=1&b=2",
        },
      ]);
    });

    test("should classify comment lines", () => {
      const result = parseEnvLines("# this is a comment");
      expect(result).toEqual([
        { type: "comment", line: "# this is a comment" },
      ]);
    });

    test("should classify indented comment lines", () => {
      const result = parseEnvLines("  # indented comment");
      expect(result).toEqual([
        { type: "comment", line: "  # indented comment" },
      ]);
    });

    test("should classify empty lines", () => {
      const result = parseEnvLines("");
      expect(result).toEqual([{ type: "empty", line: "" }]);
    });

    test("should classify whitespace-only lines as empty", () => {
      const result = parseEnvLines("   ");
      expect(result).toEqual([{ type: "empty", line: "   " }]);
    });

    test("should classify lines with no '=' as empty", () => {
      const result = parseEnvLines("JUST_A_KEY");
      expect(result).toEqual([{ type: "empty", line: "JUST_A_KEY" }]);
    });

    test("should handle KEY= with empty value", () => {
      const result = parseEnvLines("EMPTY=");
      expect(result).toEqual([
        { type: "active", key: "EMPTY", value: "", trimmedValue: "", line: "EMPTY=" },
      ]);
    });

    test("should trim whitespace from keys", () => {
      const result = parseEnvLines("  MY_KEY  =value");
      expect(result[0].key).toBe("MY_KEY");
    });

    test("should preserve original line including whitespace", () => {
      const result = parseEnvLines("  MY_KEY  =  value  ");
      expect(result[0].line).toBe("  MY_KEY  =  value  ");
    });

    test("should trim trailing whitespace from value via line.trim()", () => {
      const result = parseEnvLines("KEY=  spaced  ");
      expect(result[0].value).toBe("  spaced");
      expect(result[0].trimmedValue).toBe("spaced");
    });

    test("should parse multi-line content correctly", () => {
      const content = [
        "# Config",
        "A=1",
        "",
        "B=2",
      ].join("\n");
      const result = parseEnvLines(content);
      expect(result).toEqual([
        { type: "comment", line: "# Config" },
        { type: "active", key: "A", value: "1", trimmedValue: "1", line: "A=1" },
        { type: "empty", line: "" },
        { type: "active", key: "B", value: "2", trimmedValue: "2", line: "B=2" },
      ]);
    });

    test("should treat a bare '=' as empty (no key)", () => {
      const result = parseEnvLines("=value");
      expect(result[0].type).toBe("empty");
    });
  });
