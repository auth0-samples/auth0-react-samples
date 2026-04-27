const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

function parseArgs(args) {
  const params = {};
  for (let i = 2; i < args.length; i += 2) {
    const key = args[i].replace("--", "");
    const value = args[i + 1];
    params[key] = value;
  }
  return params;
}

function parseEnvLines(content) {
  return content.split("\n").map((line) => {
    const trimmed = line.trim();
    if (!trimmed) return { type: "empty", line };
    if (trimmed.startsWith("#")) return { type: "comment", line };

    const [key, ...valueParts] = trimmed.split("=");
    if (!key || !valueParts.length) return { type: "empty", line };

    const value = valueParts.join("=");
    return {
      type: "active",
      key: key.trim(),
      value,
      trimmedValue: value.trim(),
      line,
    };
  });
}

function validateEnvConfig(envConfig, yamlPath) {
  if (!envConfig)
    throw new Error(`The envSnippet property is missing in ${yamlPath}`);
  if (!Array.isArray(envConfig.entries))
    throw new Error(
      `The envSnippet property must have \`entries\` array in ${yamlPath}`,
    );
  if (!envConfig.fileName)
    throw new Error(
      `The envSnippet property must have \`fileName\` specified in ${yamlPath}`,
    );

  const varEntries = envConfig.entries.filter((e) => e.type === "var");
  for (const entry of varEntries) {
    if (!entry.name || entry.value == null)
      throw new Error(
        `Each var entry in envSnippet.entries must have \`name\` and \`value\` in ${yamlPath}`,
      );
  }

  return varEntries;
}

if (require.main === module) {
  try {
    const args = parseArgs(process.argv);

    // Validate required arguments
    if (!args.domain) {
      console.error("Error: --domain argument is required");
      console.error(
        "Usage: node auth0-config.cjs --domain <domain> --clientId <clientId> [--port <port>]",
      );
      process.exit(1);
    }

    if (!args.clientId) {
      console.error("Error: --clientId argument is required");
      console.error(
        "Usage: node auth0-config.cjs --domain <domain> --clientId <clientId> [--port <port>]",
      );
      process.exit(1);
    }

    // Validate port argument if provided
    if (args.port) {
      const portNumber = parseInt(args.port, 10);
      if (
        isNaN(portNumber) ||
        portNumber.toString() !== args.port.toString()
      ) {
        console.error("Error: --port argument must be a valid number");
        console.error(
          "Usage: node auth0-config.cjs --domain <domain> --clientId <clientId> [--port <port>]",
        );
        process.exit(1);
      }
    }

    // TODO: make this a param or config
    const yamlPath = path.join(
      __dirname,
      "../quickstart",
      "quickstart-login.yaml",
    );
    const quickstartConfig = yaml.load(fs.readFileSync(yamlPath, "utf8"));

    // Get env snippet from the referenced alias
    const envConfig = quickstartConfig.envSnippet;
    const varEntries = validateEnvConfig(envConfig, yamlPath);

    const envPath = path.join(__dirname, "..", envConfig.fileName);
    const replacements = {
      auth0Domain: args.domain,
      auth0ClientId: args.clientId,
      port: args.port || quickstartConfig.inputs.port.default,
    };

    // Read and parse existing file
    let existingLines = [];
    try {
      existingLines = parseEnvLines(fs.readFileSync(envPath, "utf8"));
    } catch (err) {
      // File doesn't exist
    }

    const managedKeys = new Set(varEntries.map((e) => e.name));

    // Calculate target values with placeholders replaced
    const targetValues = Object.fromEntries(
      varEntries.map((entry) => [
        entry.name,
        Object.entries(quickstartConfig.placeholders || {})
          .reduce((value, [placeholder, config]) => {
            const replacementValue = config?.inputKey
              ? replacements[config.inputKey] || ""
              : typeof config === "string"
                ? replacements[config] || ""
                : "";

            return value.replace(
              new RegExp(placeholder, "g"),
              replacementValue,
            );
          }, String(entry.value))
          .trim(),
      ]),
    );

    // Get last active value for each managed key
    const activeValues = Object.fromEntries(
      [...existingLines]
        .reverse()
        .filter((l) => l.type === "active" && managedKeys.has(l.key))
        .filter(
          (line, i, arr) => arr.findIndex((l) => l.key === line.key) === i,
        )
        .map((l) => [l.key, l.trimmedValue]),
    );

    // Track status of all managed variables
    const variableStatus = Object.entries(targetValues).map(([key, value]) => {
      if (!activeValues[key]) {
        return { key, status: "added", changed: true };
      }
      const changed = activeValues[key] !== value.trim();
      return {
        key,
        status: changed ? "updated" : "unchanged",
        changed,
      };
    });

    const hasChanges = variableStatus.some((item) => item.changed);

    // Only update file when changes are needed
    if (hasChanges) {
      // Comment all existing managed keys and append all values
      const outputLines = [
        ...existingLines.map((line) =>
          line.type === "active" && managedKeys.has(line.key)
            ? { ...line, type: "comment", line: `# ${line.line}` }
            : line,
        ),
        { type: "empty", line: "" },
        {
          type: "comment",
          line: `# added by auth0-config at ${new Date().toISOString()}`,
        },
        ...Object.entries(targetValues).map(([key, value]) => ({
          type: "active",
          key,
          value,
          line: `${key}=${value}`,
        })),
      ];

      const finalContent = outputLines.map((l) => l.line).join("\n") + "\n";
      fs.writeFileSync(envPath, finalContent);
      console.log(
        `Auth0 configuration has been written to: ${envConfig.fileName}`,
      );
    } else {
      console.log(`No changes needed, file ${envConfig.fileName} unchanged`);
    }

    // Always show status for all variables
    console.log("Config keys state:");
    variableStatus.forEach(({ key, status }) => {
      const message =
        status === "added"
          ? "adding new value"
          : status === "updated"
            ? "commenting previous value and adding new"
            : "already up to date";
      console.log(`  ${key}: ${message}`);
    });
  } catch (e) {
    console.error("Error:", e.message);
    process.exit(1);
  }
}

module.exports = { validateEnvConfig, parseEnvLines };
