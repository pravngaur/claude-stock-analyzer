# Claude Stock Analyzer

> Purpose built Claude Skill with `/` commands for analyzing stocks, your watchlist, buy/sell decisions, multibagger themes & particular stock deep dives. It analyzes both technical signals and broader news/geo-political events having potential to move markets.

Built by **[Praveen Gaur](https://www.linkedin.com/in/praveen-gaur/)** — a retail investor who got tired of missing signals and built an AI-powered system to stay on top of his portfolio without drowning in noise.

---

## What it does

This is a complete stock monitoring system built on three components:

- **Google Sheets** — your live watchlist, auto-refreshing every 15 minutes via Apps Script
- **GOOGLEFINANCE formulas** — pulls price, 52W high/low, P/E, EPS, beta, volume automatically
- **Claude Skill** — reads your sheet, searches live news, and delivers plain-English analysis on demand

You interact with it entirely through `/stocks` commands — no dashboards to check, no news to scroll through. Just ask and get a focused, actionable brief.

---

## Commands

| Command | What it does |
|---------|-------------|
| `/stocks help` | Show all commands with examples |
| `/stocks digest` | Full brief for all tracked stocks with traffic light per stock 🟢🟡🔴 |
| `/stocks portfolio` | Only your actual holdings — gain/loss, thesis check, concentration |
| `/stocks watchlist <details>` | Best value + growth pick from your watch-only stocks |
| `/stocks check <TICKER>` | Deep dive on a single stock — price, news, analyst view, upside/downside |
| `/stocks alert` | Only surfaces stocks with meaningful movement or news — skips the green ones |
| `/stocks dividend` | Dividend health check for income stocks |
| `/stocks sellcheck <TICKER or all>` | Assesses sell signals — both business deterioration AND price exhaustion |
| `/stocks multibagger <theme>` | Hidden gem / high growth finder outside your current watchlist |

All commands support `detailed` or `brief` modifiers:
```
/stocks digest detailed
/stocks check NVDA brief
```

---

## System architecture

```
Google Sheets (live data)
    ↓ GOOGLEFINANCE formulas (price, P/E, 52W high/low, EPS, beta, volume)
    ↓ Apps Script trigger (auto-refresh every 15 minutes)
    ↓
Google Drive MCP (Claude reads the sheet)
    ↓
Claude Skill (reasons over data + searches live news)
    ↓
You — plain English digest with traffic lights
```

---

## Setup guide

### Step 1 — Create your Google Sheet

1. Create a new Google Sheet named **Stock Watchlist**
2. Set up columns in Row 1:

| Col | Header |
|-----|--------|
| A | Ticker |
| B | Company |
| C | Sector |
| D | Avg Cost |
| E | Shares Owned |
| F | Price Now |
| G | MKT Cap |
| H | 52W High |
| I | 52W Low |
| J | P/E Ratio |
| K | Your Gain/Loss % |
| L | vs 52W High % |
| M | vs 52W Low % |
| N | Market Value |
| O | EPS |
| Q | Beta |
| R | Avg Volume |
| S | Today's Volume |

3. See [`sheet-setup/formulas.md`](sheet-setup/formulas.md) for all formulas

### Step 2 — Add your tickers

- US stocks: use plain ticker — `GOOG`, `NVDA`, `MSFT`
- Canadian stocks (TSX): use `TSE:` prefix — `TSE:CNQ`, `TSE:ENB`, `TSE:SU`
- Fill columns D and E (avg cost and shares) for stocks you own
- Leave D and E blank for watch-only stocks

### Step 3 — Set up the auto-refresh trigger

1. In your Google Sheet go to **Extensions → Apps Script**
2. Paste the code from [`apps-script/refresh.gs`](apps-script/refresh.gs)
3. Save, then run `createTrigger` once
4. The sheet will now refresh every 15 minutes automatically — even when closed

See [`apps-script/README.md`](apps-script/README.md) for detailed instructions.

### Step 4 — Install the Claude skill

**Option A — Cowork (recommended, gives native `/` slash commands)**
1. Copy the `SKILL.md` file to:
   - Mac: `~/Library/Application Support/Claude/cowork/skills/stocks-analyzer/SKILL.md`
   - Windows: `C:\Users\[you]\AppData\Roaming\Claude\cowork\skills\stocks-analyzer\SKILL.md`
2. Restart Cowork
3. Click `+` → **Skills** → select `stocks-analyzer`

**Option B — Claude Project**
1. Go to claude.ai → Projects → New Project
2. Open Project Instructions
3. Paste the full contents of `SKILL.md`
4. Enable Google Drive in Project connectors
5. Start a chat in the project and type `/stocks digest`

### Step 5 — Connect Google Drive

The skill reads your sheet via Google Drive MCP. Make sure:
- Google Drive is connected in your Claude settings (claude.ai → Settings → Integrations)
- For Cowork: click `+` → **Connectors** → enable Google Drive
- For Claude Projects: enable Google Drive in Project Settings → Connectors

### Step 6 — Test it

Type your first command:
```
/stocks help
```

Then:
```
/stocks digest
```

---

## Investor profile built into the skill

The skill is pre-configured for a **quality growth investor** who:

- Holds long term but sells on both business deterioration AND price exhaustion
- Wants capital growth as primary goal, capital protection as qualifier
- Tracks US large-cap tech + Canadian energy dividend stocks
- Wants plain English — no jargon without explanation
- Never wants to be the last to know when something is changing

You can edit the investor profile section in `SKILL.md` to match your own style.

---

## What makes this different

**It reads your actual sheet** — not generic market data. It knows your cost basis, your gain/loss, your concentration. The digest is personalised to *your* portfolio not a generic watchlist.

**It searches live news** — every command triggers real-time web searches. No stale training data. Every finding is dated so you can judge freshness yourself.

**Sell signals included** — most tools help you buy. This one also tells you when to consider exiting — based on both business deterioration (the Blackberry test) and price exhaustion (the lesson every long-term investor learns the hard way).

**Plain English always** — no jargon without explanation. Built for investors who know what they own but don't have time to read everything.

---

## File structure

```
claude-stock-analyzer/
├── README.md                    ← you are here
├── SKILL.md                     ← the Claude skill (install this)
├── apps-script/
│   ├── refresh.gs               ← Google Apps Script for auto-refresh
│   └── README.md                ← step by step Apps Script setup
├── sheet-setup/
│   └── formulas.md              ← all GOOGLEFINANCE formulas explained
└── screenshots/                 ← add your own to show it in action
```

---

## Contributing

Found a bug or want to add a command? PRs welcome. Some ideas for future commands:
- `/stocks earnings` — upcoming earnings calendar for your watchlist
- `/stocks compare <TICKER> <TICKER>` — side by side comparison
- `/stocks macro` — macro events this week that could move your holdings
- `/stocks rebalance` — suggest rebalancing based on concentration

---

## Disclaimer

This tool is for informational purposes only. Nothing in this skill or repository constitutes financial advice. Always validate findings with your own research or a licensed financial advisor before making investment decisions.

---

## License

MIT — use it, fork it, build on it. Just keep the attribution.

---

*Built with Claude by [Praveen Gaur](https://www.linkedin.com/in/praveen-gaur/)*
