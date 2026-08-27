# CAPTURE-TEST.md

## Setup
- **Tool:** Antigravity (Google DeepMind Advanced Agentic Coding IDE)
- **Model:** Claude Opus 4.6 (Thinking) for planning; other models for execution tasks
- **Mechanism:** PowerShell extraction script (`extract-logs.ps1`)
- **Config changed:** None — Antigravity has no hook system.

## How It Works
Antigravity auto-saves immutable JSONL transcripts per conversation at:
```
%USERPROFILE%\.gemini\antigravity\brain\<conversation-id>\.system_generated\logs\transcript.jsonl
```

Each line is a JSON object with `type` (USER_INPUT, PLANNER_RESPONSE), `content`, `created_at`, etc.

`extract-logs.ps1` reads these, filters for prompts and responses, and writes to `.agent-logs/` in 8x format.

Run after each session: `.\extract-logs.ps1 -ConversationId <id>`

## What We Checked
1. Antigravity has no Claude Code-style hooks (no `.claude/settings.json` equivalent)
2. Antigravity has no Cursor-style project rules with export mechanisms
3. Antigravity has no CLI transcript flags (not a CLI tool)
4. Antigravity DOES auto-save complete, immutable JSONL transcripts per conversation
5. We built `extract-logs.ps1` to parse these into `.agent-logs/` format

## Canary Test 1 — Planning Session

- **Session ID:** `ebacedd5-0530-44d9-98d8-d978862eead0`
- **Log file:** `.agent-logs/2026-08-27_09-00-54_ebacedd5.md`
- **Exchanges captured:** 6
- **Date range:** 2026-08-27T09:00:54Z to 2026-08-27T13:20:10Z

### Raw Canary Entry (Prompt #1):
```
[LOG_ENTRY type=PROMPT num=1 session=ebacedd5]
timestamp: 2026-08-27T09:00:54Z
model: claude-opus-4.6-thinking

hey this is the mail to me from the 8x ceo and now i need to work on it and complete the task...
```

### Raw Canary Entry (Response #1):
```
[LOG_ENTRY type=RESPONSE num=1 session=ebacedd5]
timestamp: 2026-08-27T09:00:54Z
model: claude-opus-4.6-thinking

Let me understand what the user needs...
```

## Canary Test 2
Will be generated from the build session (new conversation). Each new Antigravity conversation produces a new transcript and a new `.agent-logs/` file.

## What Didn't Work
N/A — first approach (transcript extraction) worked. Antigravity's transcript system is reliable and complete. The only issue encountered was PowerShell encoding of special characters (em dash, arrow) in the initial script, which was fixed immediately.
