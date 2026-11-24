# Helper da API da Cloudflare. Lê o token do BWS sem nunca imprimir.
# Mesmo helper do oliverops-apps (apps/traia/scripts/cloudflare/cf.ps1).
$ErrorActionPreference = 'Stop'
$bws = "$env:LOCALAPPDATA\Microsoft\WinGet\Links\bws.exe"
$env:BWS_ACCESS_TOKEN = @([Environment]::GetEnvironmentVariable('BWS_ACCESS_TOKEN','User'), [Environment]::GetEnvironmentVariable('BWS_ACCESS_TOKEN - Claude','User')) | Where-Object { $_ } | Select-Object -First 1
$script:CfToken = ((& $bws secret get 83f3f6d7-ee64-4e57-b867-b4aa0176cd83 --output json) | Out-String | ConvertFrom-Json).value
$script:CfApi = 'https://api.cloudflare.com/client/v4'

function Invoke-Cf {
  param([string]$Method = 'GET', [string]$Path, $Body = $null)
  $h = @{ Authorization = "Bearer $script:CfToken" }
  $params = @{ Uri = "$script:CfApi$Path"; Method = $Method; Headers = $h }
  if ($null -ne $Body) { $params.Body = ($Body | ConvertTo-Json -Depth 30 -Compress); $params.ContentType = 'application/json' }
  try { return Invoke-RestMethod @params }
  catch {
    $msg = $_.ErrorDetails.Message
    throw "CF $Method $Path falhou: $msg"
  }
}

$script:AccountId = (Invoke-Cf -Path '/accounts').result[0].id
