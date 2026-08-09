<#
.SYNOPSIS
Clones the latest microsoft/llmwiki release and builds a VSIX for this platform.

.DESCRIPTION
Creates or updates microsoft/llmwiki in the current workspace, checks out the
latest version tag, builds the core package and VS Code extension, and copies
the generated VSIX to the workspace root.

.PARAMETER WorkspacePath
The workspace directory where the microsoft/llmwiki clone and VSIX are created.
Defaults to the directory containing this script.

.EXAMPLE
./scripts/build-llmwiki-vsix.ps1

.EXAMPLE
Get-Help ./scripts/build-llmwiki-vsix.ps1 -Full
#>
[CmdletBinding()]
param(
    [Parameter()]
    [ValidateNotNullOrEmpty()]
    [string]$WorkspacePath = (Split-Path -Parent $PSScriptRoot)
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Invoke-NativeCommand {
    param(
        [Parameter(Mandatory)]
        [string]$Command,
        [Parameter()]
        [string[]]$ArgumentList = @()
    )

    & $Command @ArgumentList
    if ($LASTEXITCODE -ne 0) {
        throw "Command failed with exit code $LASTEXITCODE`: $Command $($ArgumentList -join ' ')"
    }
}

function Get-VsixTarget {
    if ($IsWindows) {
        if ([System.Runtime.InteropServices.RuntimeInformation]::OSArchitecture -eq 'Arm64') {
            return 'win32-arm64'
        }
        return 'win32-x64'
    }
    if ($IsMacOS) {
        if ([System.Runtime.InteropServices.RuntimeInformation]::OSArchitecture -eq 'Arm64') {
            return 'darwin-arm64'
        }
        return 'darwin'
    }
    if ([System.Runtime.InteropServices.RuntimeInformation]::OSArchitecture -eq 'Arm64') {
        return 'linux-arm64'
    }
    return 'linux-x64'
}

$workspace = [System.IO.Path]::GetFullPath($WorkspacePath)
$clonePath = Join-Path $workspace 'llmwiki'
$target = Get-VsixTarget

New-Item -ItemType Directory -Path (Split-Path -Parent $clonePath) -Force | Out-Null

if (Test-Path (Join-Path $clonePath '.git')) {
    Invoke-NativeCommand git @('-C', $clonePath, 'fetch', '--tags', '--force', 'origin')
} elseif (Test-Path $clonePath) {
    throw "Clone path exists but is not a Git repository: $clonePath"
} else {
    Invoke-NativeCommand git @('clone', '--branch=v1.0.0', '--depth=1', 'https://github.com/microsoft/llmwiki.git', $clonePath)
}

$latestTag = (& git -C $clonePath tag --list 'v*' --sort=-version:refname | Select-Object -First 1).Trim()
if ([string]::IsNullOrWhiteSpace($latestTag)) {
    throw "No version tag was found in $clonePath"
}

Invoke-NativeCommand git @('-C', $clonePath, 'checkout', '--detach', $latestTag)
Push-Location $clonePath
try {
    Invoke-NativeCommand npm @('ci')
    Invoke-NativeCommand npm @('run', 'build')
    Invoke-NativeCommand npm @('run', 'package', '--workspace=packages/vscode', '--', '--target', $target)
} finally {
    Pop-Location
}

$vsix = Get-ChildItem (Join-Path $clonePath 'packages\vscode\*.vsix') |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1
if ($null -eq $vsix) {
    throw "No VSIX was generated under $clonePath\packages\vscode"
}

$outputPath = Join-Path $workspace $vsix.Name
Copy-Item $vsix.FullName $outputPath -Force

[pscustomobject]@{
    ReleaseTag = $latestTag
    Target = $target
    ClonePath = $clonePath
    VsixPath = $outputPath
    Sha256 = (Get-FileHash $outputPath -Algorithm SHA256).Hash
}