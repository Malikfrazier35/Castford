# Castford Tweet Bot — Setup Guide

## 1. Get Twitter API credentials (~10 minutes, free)

### Sign up for Twitter Developer Account

1. Go to https://developer.twitter.com/en/portal/petition/essential/basic-info
2. Sign in with your @castford_app (or whatever your X account is)
3. Apply for Free tier — you only need **basic write access**
4. Twitter approves in ~5 minutes for basic use

### Create an App

1. Once approved, go to https://developer.twitter.com/en/portal/dashboard
2. Click **+ Create Project** → name it "Castford"
3. Click **+ Add App** → name it "castford-tweet-bot"

### Get the 4 keys you need

In your app settings:

1. **API Key + API Secret** — visible in "Keys and Tokens" tab → "API Key and Secret" section. Copy both. (These are sometimes called "Consumer Keys".)
2. **Access Token + Access Secret** — same page, "Access Token and Secret" section. Click "Generate" if needed. Copy both.

**IMPORTANT:** Before generating the Access Token, make sure your app's **User Authentication** is set to:
- Type of App: **Web App / Automated App / Bot**
- App Permissions: **Read and Write** (NOT just Read)

If you generate the Access Token with only Read permissions, you can't post — you'll need to regenerate after fixing permissions.

## 2. Configure the bot

Create a file called `.env` in the same folder as `castford-tweet-bot.py`:

```bash
TWITTER_API_KEY=your_api_key_here
TWITTER_API_SECRET=your_api_secret_here
TWITTER_ACCESS_TOKEN=your_access_token_here
TWITTER_ACCESS_SECRET=your_access_secret_here
TWITTER_BEARER_TOKEN=your_bearer_token_here
```

The Bearer Token is optional but useful — also from the Keys and Tokens tab.

**SECURITY:** Add `.env` to your `.gitignore` so it never gets committed. The keys above grant full posting access to your X account.

## 3. Install + test

```bash
pip install tweepy
```

Test with a dry run first (won't actually post):

```bash
# Drop CASTFORD_X_POSTS.md in this folder, then:
python3 castford-tweet-bot.py seed
python3 castford-tweet-bot.py list
python3 castford-tweet-bot.py post --dry-run
```

If the dry run shows the next tweet correctly, you're ready to actually post:

```bash
python3 castford-tweet-bot.py post
```

It'll print the tweet URL on success. Visit it to confirm.

## 4. Schedule via cron (optional but recommended)

To auto-post 5 times per week (Mon-Fri at 9am ET = 14:00 UTC):

```bash
crontab -e
```

Add this line:
```
0 14 * * 1-5 cd /Users/malik/Desktop/Castford/x-bot && /usr/bin/python3 castford-tweet-bot.py post >> tweet-bot.log 2>&1
```

Or use macOS launchd if cron isn't reliable for you (your Mac needs to be awake to fire cron).

**Better:** Run via GitHub Actions on a schedule. That way it posts even when your laptop is closed. See section 5.

## 5. GitHub Actions (recommended — runs in the cloud)

Create `.github/workflows/tweet.yml` in your Castford repo:

```yaml
name: Post Tweet

on:
  schedule:
    # Mon-Fri at 14:00 UTC = 9am ET / 10am EDT
    - cron: '0 14 * * 1-5'
  workflow_dispatch:  # allow manual trigger

jobs:
  post:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GH_PAT }}  # needs write access to commit history file back

      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - run: pip install tweepy

      - name: Post next tweet
        env:
          TWITTER_API_KEY: ${{ secrets.TWITTER_API_KEY }}
          TWITTER_API_SECRET: ${{ secrets.TWITTER_API_SECRET }}
          TWITTER_ACCESS_TOKEN: ${{ secrets.TWITTER_ACCESS_TOKEN }}
          TWITTER_ACCESS_SECRET: ${{ secrets.TWITTER_ACCESS_SECRET }}
        run: |
          cd x-bot
          python3 castford-tweet-bot.py post

      - name: Commit updated queue/history
        run: |
          git config user.name 'castford-bot'
          git config user.email 'bot@castford.com'
          git add x-bot/tweet-queue.json x-bot/tweet-history.json
          git diff --staged --quiet || git commit -m "bot: post tweet [skip ci]"
          git push
```

In your GitHub repo settings:
- Settings → Secrets → Add `TWITTER_API_KEY`, `TWITTER_API_SECRET`, `TWITTER_ACCESS_TOKEN`, `TWITTER_ACCESS_SECRET`
- Settings → Secrets → Add `GH_PAT` (Personal Access Token with repo write — for committing back the history file)

The bot now posts on its own schedule, even with your laptop closed.

## 6. Free tier limits

- **Posting:** 1,500 tweets/month (way more than you need)
- **Reading:** 100 reads/month (we don't read)
- **No media uploads on free tier** — to attach images, need Basic tier ($100/mo) or workaround (manual posting)

For pure text posting, free tier is plenty.

## 7. Maintenance

```bash
# Check status anytime:
python3 castford-tweet-bot.py stats

# Add a tweet on the fly:
python3 castford-tweet-bot.py add "Hot take: most B2B SaaS pricing is broken." --category differentiation

# Re-seed from updated CASTFORD_X_POSTS.md (skips duplicates):
python3 castford-tweet-bot.py seed
```

## 8. If something goes wrong

| Error | Fix |
|---|---|
| `403 Forbidden` | App permissions are Read-only. Regenerate Access Token after switching to Read+Write. |
| `429 Rate Limited` | You're posting too frequently. Bot enforces 4hr min spacing — use `--force` only sparingly. |
| `Invalid credentials` | Double-check `.env` for typos or extra whitespace. Keys can't have quotes/newlines. |
| `Tweet text too long` | Bot warns at >280. Edit before posting. |

## 9. Files in this folder

- `castford-tweet-bot.py` — the bot
- `.env` — your credentials (you create this, never commit)
- `.env.example` — template for credentials
- `tweet-queue.json` — auto-generated, tracks unposted tweets
- `tweet-history.json` — auto-generated, tracks posted tweets
- `CASTFORD_X_POSTS.md` — the content bank (drop here for `seed` command)

## Done

Once configured, the only command you'll run regularly is:
```bash
python3 castford-tweet-bot.py stats
```
to check what's happening. Everything else runs on schedule.
