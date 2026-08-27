#!/usr/bin/env pwsh
# extract-logs.ps1 - Extracts Antigravity conversation transcripts into 8x .agent-logs/ format
# Usage: .\extract-logs.ps1 -ConversationId <id> [-OutputDir .agent-logs]

param(
    [Parameter(Mandatory=$true)]
    [string]$ConversationId,
    
    [string]$OutputDir = ".agent-logs",
    
    [string]$Author = "Jay-D21",
    
    [string]$Project = "sideshift-rebuild",
    
    [string]$AppDataDir = "$env:USERPROFILE\.gemini\antigravity"
)

$transcriptPath = Join-Path $AppDataDir "brain\$ConversationId\.system_generated\logs\transcript.jsonl"

if (-not (Test-Path $transcriptPath)) {
    Write-Error "Transcript not found at: $transcriptPath"
    exit 1
}

# Read and parse JSONL
$lines = Get-Content $transcriptPath -Encoding UTF8
$entries = @()

foreach ($line in $lines) {
    if ($line.Trim() -eq '') { continue }
    try {
        $obj = $line | ConvertFrom-Json
        $entries += $obj
    } catch {
        # Skip malformed lines
    }
}

# Default model
$modelName = "claude-opus-4.6-thinking"

# Build exchanges by pairing USER_INPUT with PLANNER_RESPONSE
$exchanges = @()
$exchangeCount = 0

foreach ($entry in $entries) {
    if ($entry.type -eq 'USER_INPUT') {
        $exchangeCount++
        $exchanges += [PSCustomObject]@{
            type = 'PROMPT'
            num = $exchangeCount
            timestamp = $entry.created_at
            content = $entry.content
            model = $modelName
        }
    }
    elseif ($entry.type -eq 'PLANNER_RESPONSE') {
        $respContent = $entry.content
        if (-not $respContent) {
            $respContent = "(No text response - tool calls only)"
        }
        $exchanges += [PSCustomObject]@{
            type = 'RESPONSE'
            num = $exchangeCount
            timestamp = $entry.created_at
            content = $respContent
            model = $modelName
        }
    }
}

if ($exchangeCount -eq 0) {
    Write-Warning "No USER_INPUT entries found in transcript."
    exit 0
}

# Get timestamps
$firstPrompt = $exchanges | Where-Object { $_.type -eq 'PROMPT' } | Select-Object -First 1
$lastPrompt = $exchanges | Where-Object { $_.type -eq 'PROMPT' } | Select-Object -Last 1
$firstTime = $firstPrompt.timestamp
$lastTime = $lastPrompt.timestamp

# Short session ID (first 8 chars)
$shortId = $ConversationId.Substring(0, [Math]::Min(8, $ConversationId.Length))

# Generate filename
$dateForFile = ([DateTimeOffset]::Parse($firstTime)).ToUniversalTime().ToString("yyyy-MM-dd_HH-mm-ss")
$fileName = "${dateForFile}_${shortId}.md"
$outputPath = Join-Path $OutputDir $fileName

# Ensure output directory exists
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

# Build output
$dateForHeader = ([DateTimeOffset]::Parse($firstTime)).ToUniversalTime().ToString("yyyy-MM-dd")

$output = @"
---
session_id: $ConversationId
date: $dateForHeader
author: $Author
model: $modelName
tool: antigravity
project: $Project
total_exchanges: $exchangeCount
first_prompt_time: $firstTime
last_prompt_time: $lastTime
---

# Session Log - $dateForHeader

Session: ``$shortId`` | Project: ``$Project`` | Author: ``$Author``

---
"@

foreach ($ex in $exchanges) {
    $content = $ex.content
    # Truncate very long content for readability
    if ($content -and $content.Length -gt 3000) {
        $content = $content.Substring(0, 3000) + "`n`n[... truncated, full content in Antigravity transcript ...]"
    }

    $output += @"


[LOG_ENTRY type=$($ex.type) num=$($ex.num) session=$shortId]
timestamp: $($ex.timestamp)
model: $($ex.model)

$content

"@
}

# Write file
$output | Out-File -FilePath $outputPath -Encoding utf8 -NoNewline

Write-Host "Done! Extracted $exchangeCount exchanges to: $outputPath" -ForegroundColor Green
Write-Host "   Session: $ConversationId"
Write-Host "   Date: $dateForHeader"
