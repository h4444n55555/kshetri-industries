<#
Simple PowerShell helper to create a ZIP of the `static-site` folder.
Usage: Open PowerShell in repo root and run `.uild-static-zip.ps1` (or `./create-static-zip.ps1`).
#>
$src = Join-Path -Path $PSScriptRoot -ChildPath 'static-site\*'
$dest = Join-Path -Path $PSScriptRoot -ChildPath 'static-site.zip'

if (Test-Path $dest) { Remove-Item $dest -Force }
Compress-Archive -Path $src -DestinationPath $dest -Force
Write-Output "Created: $dest"
