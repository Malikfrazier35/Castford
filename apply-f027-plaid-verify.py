#!/usr/bin/env python3
"""Baseline F-027 — plaid-webhook signature verification."""
import pathlib, sys

PATH = pathlib.Path('supabase/functions/plaid-webhook/index.ts')
if not PATH.exists():
    print(f'ERROR: {PATH} not found. Run from Castford repo root.')
    sys.exit(1)

content = PATH.read_text()
original_length = len(content)

# Add import at top (after existing imports)
old_import = "import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'"
new_import = (
    "import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'\n"
    "import { verifyPlaidWebhook } from '../_shared/plaid-verify.ts'"
)

# Replace body read with verification + text-then-json
old_read = """  try {
    const body = await req.json();"""
new_read = """  try {
    const bodyText = await req.text();
    const verified = await verifyPlaidWebhook(req, bodyText);
    if (!verified) {
      console.warn('plaid-webhook: signature verification failed');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const body = JSON.parse(bodyText);"""

replacements = [
    (old_import, new_import),
    (old_read, new_read),
]

applied, missing = 0, []
for old, new in replacements:
    if old in content:
        content = content.replace(old, new, 1)
        applied += 1
    else:
        missing.append(old[:80] + ('...' if len(old) > 80 else ''))

PATH.write_text(content)
delta = len(content) - original_length
print(f'Applied {applied}/{len(replacements)} replacements ({delta:+} chars)')
if missing:
    print(f'WARNING: {len(missing)} pattern(s) not found:')
    for m in missing:
        print(f'  - {m}')
