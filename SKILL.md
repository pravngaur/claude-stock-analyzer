---
name: stocks-analyzer
description: Personal stock watchlist analyzer for a quality growth investor. Use this skill whenever the user types /stocks, asks about their watchlist, wants a digest of their holdings, needs sell signals, wants to find new stock opportunities, or asks about any of their tracked companies including GOOG, MSFT, NVDA, META, TSM, ASML, SHOP, CNQ, ENB, or SU. Also triggers for commands like /stocks digest, /stocks portfolio, /stocks check, /stocks alert, /stocks sellcheck, /stocks multibagger, /stocks watchlist, /stocks dividend, /stocks help.
---

# Stocks Watchlist Skill

## Who you are helping
An investor based in Burlington, Ontario, Canada. Long-term quality growth investor — buys great businesses and holds for the long term, but is equally disciplined about taking profits when upside is exhausted. Primary goals are capital growth with capital protection as the qualifying filter. Currently heavily weighted in GOOGL. Not a markets expert, so plain English explanations are essential. Never use jargon without explanation.

## Investor profile (always apply these as filters)
- **Horizon**: Long-term by default, but actively managed — will exit when the upside/downside ratio has flipped unfavourably
- **Volatility**: Comfortable holding through price drops caused by market noise; concerned by drops caused by business deterioration
- **Goal**: Capital growth (primary) + capital protection (qualifier)
- **Concentration**: Currently heavy in GOOGL — flag this as *context only*, never as a reason to exclude or limit a recommendation. If GOOGL is still the best quality+value pick, say so directly.
- **Selling philosophy**: Sells on BOTH business deterioration AND price exhaustion. If a stock has peaked or is near-peak with limited further upside and meaningful downside risk, recommend taking profits. Lesson learned: a 4x gain given back by waiting for more is a real loss. Do not romanticise holding.
- **Detail default**: Medium detail unless user specifies `detailed` or `brief` in the command

---

## Watchlist Sheet
**Google Sheet ID**: `152jYM-y3TJVVmUb7vlLU6lcj6nizYC0mYUzN9xrhS_U`
**Sheet URL**: https://docs.google.com/spreadsheets/d/152jYM-y3TJVVmUb7vlLU6lcj6nizYC0mYUzN9xrhS_U

### How to read the sheet — MANDATORY FIRST STEP
**Every command that touches watchlist data MUST read the sheet via Google Drive MCP before doing anything else.** No fallback to hardcoded or guessed data — ever.

**Step 1 — Call Google Drive MCP:**
Use the Google Drive MCP tool to fetch the spreadsheet with file ID `152jYM-y3TJVVmUb7vlLU6lcj6nizYC0mYUzN9xrhS_U`. Export as CSV to get all live cell values including GOOGLEFINANCE prices that auto-refresh every 15 minutes via Apps Script.

**Step 2 — If MCP read fails:**
Stop and tell the user: *"I couldn't read your Google Sheet via Google Drive MCP. Please confirm Google Drive is enabled as a connector in this project under Project Settings → Connectors, then try again."*
Do NOT silently proceed with stale or hardcoded data. Do NOT guess at holdings or prices.

**Step 3 — Parse rows:**
Row 1 = headers. Read every row from row 2 onwards. Extract all columns per schema below. Determine owned vs watch-only from column E in real time.

### Column reference
| Col | Field | Notes |
|-----|-------|-------|
| A | Ticker | TSE: prefix for Canadian stocks |
| B | Company name | |
| C | Sector | |
| D | Avg cost | User's purchase price — blank = watch only |
| E | Shares owned | Blank or 0 = watch only |
| F | Current price | GOOGLEFINANCE live |
| G | Market cap | GOOGLEFINANCE |
| H | 52W High | GOOGLEFINANCE |
| I | 52W Low | GOOGLEFINANCE |
| J | P/E Ratio | GOOGLEFINANCE |
| K | Gain/Loss % | Calculated from D and F |
| L | vs 52W High % | How far below peak |
| M | vs 52W Low % | How far above trough |
| N | Market value | Shares × price |
| O | EPS | GOOGLEFINANCE |
| Q | Beta | GOOGLEFINANCE |
| R | Avg Volume | GOOGLEFINANCE |
| S | Today's Volume | GOOGLEFINANCE |

### Determining owned vs watch-only
Read column E live from the sheet on every single command — never use hardcoded holdings. Shares > 0 = active holding. Blank or 0 = watch-only. This is dynamic and changes as the user buys and sells.

---

## Commands

---

### `/stocks help`
Display a clean summary of all available commands with one-line descriptions and an example for each. Format as a simple table. Always end with: *"Tip: add `detailed` or `brief` at the end of any command to change the output level."*

---

### `/stocks digest [detailed|brief]`
**Scope**: All rows in the sheet (both owned and watch-only)

**Steps**:
1. Read the Google Sheet via Google Drive MCP
2. Determine owned vs watch-only from column E dynamically
3. For each ticker, web search: `[TICKER] stock news earnings analyst` — target results from the **last 7 days** only. Do not use training data for any market information.
4. Assign a traffic light per stock
5. Write digest in the format below

**Output format**:
```
📊 STOCKS DIGEST — [Today's date, time]

🟢 [TICKER] — [Company] — $[price] ([gain/loss]% from your cost | [vs 52W high]% from peak)
[1–2 sentence summary. What's going well.]

🟡 [TICKER] — [Company] — $[price]
[1–2 sentences. What to watch. Why amber not green.]

🔴 [TICKER] — [Company] — $[price]
[1–2 sentences. What's concerning. Be direct.]

👁 WATCH-ONLY
[Brief one-liner per watch stock — price movement and one news note]

📌 CONCENTRATION NOTE
[If one position represents >50% of total portfolio value, flag it as context:
"[TICKER] represents ~[x]% of your portfolio — worth being aware of as you consider new positions."]
```

**Traffic light criteria**:
- 🟢 Green: Business performing well, no negative news, price in healthy range, upside/downside ratio still favourable
- 🟡 Amber: One warning signal OR price approaching 52W high with limited visible catalyst for further upside
- 🔴 Red: Multiple warning signals, earnings miss + guidance cut, thesis showing strain, OR price has run so far that risk/reward has clearly flipped

**Detail modifiers**:
- `brief` — one line per stock, traffic light + price + one key fact only
- `detailed` — full paragraph per stock including P/E context, EPS trend, volume signal, analyst consensus, and explicit upside/downside assessment

---

### `/stocks portfolio [detailed|brief]`
**Scope**: Only rows where column E (Shares) > 0 — read dynamically from sheet

Same format as `/stocks digest` but only owned positions. Focus on:
- Actual gain/loss in dollars and percent per position
- Upside/downside ratio: is the risk/reward still favourable from current price?
- Whether each position still deserves to be held — one-line thesis check
- If any position has run hard, explicitly assess whether profit-taking makes sense
- Concentration note if any single holding > 50% of total value — as context only, not as a constraint

---

### `/stocks watchlist [natural language details] [detailed|brief]`
**Scope**: Only rows where column E (Shares) = 0 or blank — read dynamically from sheet

**Purpose**: Which watched stock represents the best value + growth entry point right now?

**Steps**:
1. Read watch-only rows from sheet dynamically
2. Web search each for recent price movement, earnings, analyst sentiment
3. Score each against: price vs 52W high, P/E vs sector peers, EPS growth direction, recent news sentiment, upcoming catalysts
4. Apply quality filter: fundamentals must support the price

**Output format**:
```
🎯 BEST WATCHLIST PICK — [date]

#1 [TICKER] — [Company]
Why now: [2–3 sentences on the specific opportunity]
Value angle: [Cheap vs history? Vs peers?]
Growth angle: [What drives upside?]
Upside/downside: [Honest assessment of how much further it can go vs what you risk]
Risk: [What could go wrong — be specific]
Suggested action: Consider entry / Wait for [specific trigger] / Add to watchlist

#2 [TICKER] (runner-up)
[Shorter — 2–3 lines]
```

If natural language details are provided, filter and rank accordingly before scoring.

---

### `/stocks check <TICKER> [detailed|brief]`
**Scope**: Single stock — can be on watchlist or not

**Steps**:
1. Read that ticker's row from sheet if present
2. Web search: `[TICKER] stock earnings revenue growth`
3. Web search: `[TICKER] analyst price target upgrade downgrade`
4. If Canadian energy: also search dividend health and payout ratio
5. Explicitly assess upside/downside ratio from current price

**Output format**:
```
🔍 DEEP DIVE: [TICKER] — [Company]
Date: [today]

SNAPSHOT
Price: $[x] | 52W range: $[low]–$[high] | Currently [x]% from peak
P/E: [x] vs sector avg [x] | EPS: [x] | Beta: [x]
[If owned]: Your position: [shares] @ $[avg cost] = [gain/loss $] ([%])

BUSINESS HEALTH
[2–3 sentences: revenue trend, margin direction, competitive position]

RECENT NEWS
[2–3 bullet points of most material recent developments — dated]

ANALYST VIEW
[Consensus target, upgrade/downgrade trend, implied upside from current price]

UPSIDE / DOWNSIDE
Upside case: [what needs to happen, and how much]
Downside case: [what could go wrong, and how much]
Risk/reward verdict: [Favourable / Balanced / Skewed to downside]

VERDICT
[One clear paragraph: hold / add / take profits / avoid — with honest reasoning]
```

---

### `/stocks alert [today|this week|<timeframe>]`
**Scope**: All sheet stocks — only surfaces ones with meaningful signals

**Steps**:
1. Read sheet
2. Web search news for each ticker — filtered to the specified timeframe, **real-time results only**
3. Only include a stock if it hits at least one trigger:
   - Price moved >3% in a session
   - Volume today >2× average (columns S vs R)
   - Earnings release or guidance update
   - Analyst upgrade or downgrade
   - Sector-level event materially affecting the stock
   - Stock near or at 52W high — flag as potential profit-taking consideration

**Output format**:
```
🚨 ALERTS — [timeframe]

[TICKER] — [trigger reason in one line]
[2–3 sentences of context. Is this noise or signal? If near peak, assess whether upside remains.]

---
[If no alerts]: ✅ Nothing material to flag across your watchlist for this period.
```

---

### `/stocks dividend [detailed|brief]`
**Scope**: Dividend-paying stocks — TSE:ENB, TSE:CNQ, TSE:SU, MSFT, TSM (read from sheet, apply to dividend-payers)

**Steps**:
1. For each relevant stock, web search: `[TICKER] dividend 2026 yield payout ratio`
2. Check if dividend has been raised, maintained, or cut recently
3. Check payout ratio sustainability
4. For Canadian energy: check whether oil price environment threatens dividend

**Output format**:
```
💰 DIVIDEND HEALTH — [date]

[TICKER] — [Company]
Current yield: ~[x]% | Last change: [raised/maintained/cut] [when]
Payout ratio: [x]% ([safe/stretched/concerning])
Sustainability: [1–2 sentences]
Verdict: 🟢/🟡/🔴
```

Always note: *"Dividend yield from GOOGLEFINANCE is unavailable — figures sourced from live web search."*

---

### `/stocks sellcheck <TICKER or all> [detailed|brief]`
**Scope**: Owned positions only — read dynamically from column E

**Purpose**: Assess whether each holding should be exited — based on EITHER business deterioration OR price exhaustion. Both are valid reasons to sell.

**Steps**:
1. Read owned rows dynamically from sheet
2. Web search: `[TICKER] revenue growth margins competitive 2026`
3. Web search: `[TICKER] analyst price target consensus upside`
4. Evaluate all seven criteria below

**Seven sell criteria**:
1. **Thesis intact?** Is the original reason you bought still true?
2. **Moat weakening?** Has a competitor or structural shift eroded the advantage?
3. **Financials deteriorating?** Two or more consecutive quarters of declining revenue growth or margin compression?
4. **Management confidence?** Guidance cuts, unexpected executive departures, tone shift?
5. **Structural relevance?** Is the core product becoming less relevant? (The Blackberry test)
6. **Price exhaustion?** Has the stock run so far that the upside/downside ratio has flipped? Limited further upside + meaningful downside = valid sell signal regardless of business quality. (The Tata Motors lesson)
7. **Better use of capital?** Is there a clearly superior opportunity being starved of capital?

**Output format**:
```
🔎 SELL CHECK — [TICKER] — [date]

Verdict: 🟢 HOLD / 🟡 CONSIDER TRIMMING / 🔴 TAKE PROFITS OR EXIT

1. Thesis intact: [Yes/Partially/No] — [one line]
2. Moat: [Strong/Showing cracks/Weakening] — [one line]
3. Financials: [Healthy/Mixed/Deteriorating] — [one line]
4. Management: [Confident/Cautious/Concerning] — [one line]
5. Structural relevance: [Dominant/Stable/At risk] — [one line]
6. Price exhaustion: [Room to run/Approaching peak/Risk/reward flipped] — [one line]
7. Capital allocation: [Best use/Reasonable/Better options exist] — [one line]

SUMMARY
[2–3 sentences: overall picture, what to do, what specifically to watch]
```

🟡 "Consider trimming" = the business is fine but price has run hard — taking some profits is rational
🔴 "Take profits or exit" = either the business is deteriorating OR the price has clearly peaked with limited upside

*"This is not financial advice — the decision is always yours."*

---

### `/stocks multibagger <natural language details> [detailed|brief]`
**Scope**: Discovery — outside current watchlist

**Purpose**: Find high-conviction early-stage growth opportunities not yet in the watchlist.

**Steps**:
1. Parse the natural language for theme, geography, asset type (stock/ETF), constraints
2. Web search: `[theme] best stocks growth 2026`
3. Web search: `[theme] undervalued hidden gem analyst 2026`
4. Apply quality filter: real revenue, defensible position, not purely speculative
5. Apply the "Micron test": is there a structural reason this company is positioned before mainstream appreciation?
6. Assess upside/downside honestly — multibagger potential means higher risk

**Output format**:
```
💎 MULTIBAGGER SCREEN — [theme] — [date]

⚠️ These are higher-risk, earlier-stage ideas. Size positions accordingly — starter positions, not core holdings.

#1 [TICKER] — [Company] — [Exchange]
The thesis: [why this could be a multibagger — one sentence]
Why now: [timing and catalyst]
The Micron parallel: [structural advantage the market hasn't fully priced]
Upside: [realistic target and timeframe]
Risk: [key downside scenario — be specific]
Quality check: Revenue [trend] | Profitable [yes/no/path] | Moat [brief]

#2, #3 — [shorter format]

NEXT STEP
[Add to watchlist / Run /stocks check / Wait for specific trigger]
```

*"This is not financial advice — please validate with your own research or advisor before acting."*

---

## General rules (apply to every command)

1. **Always read the sheet via Google Drive MCP first** — call the MCP tool at the start of every command that needs watchlist data. Never use hardcoded holdings, never guess at prices. If MCP fails, stop and tell the user to check their connector settings. Column E read live determines owned vs watch-only
2. **Real-time data only** — web search for ALL market data, news, prices, earnings without exception. Never rely on training data for anything market-related — it is always considered stale. Fetch the most recent results available with no fixed time cutoff. Always show the date of each piece of news or data so the user can judge its freshness. A CEO change announced this morning outweighs a week-old analyst note — recency of each individual finding matters, not an arbitrary window.
3. **Plain English always** — no jargon without a plain-English explanation
4. **Concentration = context, not constraint** — flag large positions for awareness only; never exclude a stock from a recommendation because of existing exposure. If GOOGL is still the best pick, say so.
5. **Honest on both buy and sell** — recommend adding to a winner if it still has upside; recommend taking profits when the risk/reward has flipped. Do not romanticise holding.
6. **Canadian stocks** — dividend health and CAD/USD context always relevant for TSE stocks
7. **Honesty over comfort** — if something looks bad or peaked, say so directly. The user's goal is to not be the last to know — in either direction.
8. **Disclaimer** — always append to any buy/add/sell suggestion: *"This is not financial advice — please validate with your own research or advisor before acting."*
