if (-not (Test-Path .env.local)) {
    Write-Error "Error: .env.local not found. Copy .env.example to .env.local and fill in your credentials."
    exit 1
}

$envVars = @{}
Get-Content .env.local | Where-Object { $_ -notmatch '^#' -and $_ -notmatch '^\s*$' } | ForEach-Object {
    $parts = $_ -split '=', 2
    $envVars[$parts[0].Trim()] = $parts[1].Trim()
}

docker build `
    --build-arg "AUTH0_DOMAIN=$($envVars['AUTH0_DOMAIN'])" `
    --build-arg "AUTH0_CLIENT_ID=$($envVars['AUTH0_CLIENT_ID'])" `
    --build-arg "AUTH0_AUDIENCE=$($envVars['AUTH0_AUDIENCE'])" `
    --build-arg "API_BASE_URL=$($envVars['API_BASE_URL'])" `
    -t auth0-react-01-login .

docker run --init -p 3000:3000 -p 3001:3001 --env-file .env.local -it auth0-react-01-login
