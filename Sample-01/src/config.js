export function getConfig() {
  // If the audience environment variable is not defined or still a placeholder, it will resolve to `null`.
  // In that case, the API page changes to show some helpful info about what to do
  // with the audience.
  const audience = process.env.AUTH0_AUDIENCE;
  return {
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID,
    ...(audience && audience !== "{yourApiIdentifier}" ? { audience } : null),
    apiOrigin: process.env.API_BASE_URL || 'http://localhost:3001',
  };
}
