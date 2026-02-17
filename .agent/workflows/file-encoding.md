---
description: Rules for preserving UTF-8 encoding when editing files with PowerShell
---

# File Encoding Rules

This project contains HTML files with Spanish text (á, é, í, ó, ú, ñ, ¿, ¡, etc.). **Encoding must be preserved at all times.**

## NEVER do this

```powershell
# BAD - This corrupts special characters (double-encodes UTF-8):
$content = Get-Content "file.html" -Raw
[System.IO.File]::WriteAllText("file.html", $content)
```

## ALWAYS do this

When reading and rewriting files with PowerShell, explicitly use UTF-8 encoding on BOTH read and write:

```powershell
# GOOD - Preserves encoding correctly:
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$content = [System.IO.File]::ReadAllText("file.html", $utf8NoBom)

# ... make modifications to $content ...

[System.IO.File]::WriteAllText("file.html", $content, $utf8NoBom)
```

## Prefer code edit tools over PowerShell

When removing or modifying blocks of text in HTML files:

1. **First choice**: Use the `replace_file_content` or `multi_replace_file_content` tools — they handle encoding automatically.
2. **Last resort only**: Use PowerShell with the explicit UTF-8 pattern above.

## Quick verification after any PowerShell file write

```powershell
# Check for broken encoding markers (should return 0):
$c = [System.IO.File]::ReadAllText("file.html", [System.Text.Encoding]::UTF8)
$broken = ([regex]::Matches($c, [char]0x00C3)).Count + ([regex]::Matches($c, [char]0x00C2)).Count
Write-Host "Broken encoding chars: $broken"
```
