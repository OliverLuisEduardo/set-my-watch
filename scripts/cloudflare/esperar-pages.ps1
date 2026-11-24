# Espera o deploy do Pages de um commit (mesmo script das sessões do oliverops-apps).
# Uso: scripts/cloudflare/esperar-pages.ps1 -Commit <sha>
param([string]$Commit)
$s = Split-Path -Parent $MyInvocation.MyCommand.Path
. "$s\cf.ps1"
$ErrorActionPreference = 'Continue'
for ($i = 0; $i -lt 90; $i++) {
  $deps = (Invoke-Cf -Path "/accounts/$AccountId/pages/projects/setmywatch/deployments?per_page=5").result
  $d = $deps | Where-Object { $_.deployment_trigger.metadata.commit_hash -like "$Commit*" } | Select-Object -First 1
  if ($d) {
    $st = $d.latest_stage
    if ($st.status -in @('success', 'failure', 'canceled')) {
      "deploy $($d.short_id) commit=$($d.deployment_trigger.metadata.commit_hash.Substring(0,7)) env=$($d.environment) etapa=$($st.name) status=$($st.status) url=$($d.url)"
      exit 0
    }
  }
  Start-Sleep -Seconds 20
}
'tempo esgotado: nenhum deploy do commit apareceu (o segredo pode não estar configurado ou o job falhou antes)'
