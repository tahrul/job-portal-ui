#!/bin/bash
# Claude Code status line script for job-portal-ui

input=$(cat)

output=$(echo "$input" | python -c "
import json, sys

data = json.load(sys.stdin)
model = data.get('model', {}).get('display_name', 'Unknown Model')
cw = data.get('context_window', {})
used = cw.get('used_percentage')
remaining = cw.get('remaining_percentage')

if used is not None and remaining is not None:
    used_int = round(used)
    remaining_int = round(remaining)
    width = 20
    filled = round(used * width / 100)
    empty = width - filled
    bar = '#' * filled + '-' * empty

    if used_int < 50:
        color = '\033[32m'
    elif used_int < 80:
        color = '\033[33m'
    else:
        color = '\033[31m'
    reset = '\033[0m'

    print(f'{color}{model}{reset}  [{bar}] {used_int}% used / {remaining_int}% left', end='')
else:
    print(f'{model}  [--------------------] no context data yet', end='')
")

printf "%s" "$output"
