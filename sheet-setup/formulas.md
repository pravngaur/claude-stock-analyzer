# Google Sheet Formulas

Complete formula reference for the Stock Watchlist sheet.

## Important notes before you start

- **US stocks**: use plain ticker in column A — `GOOG`, `NVDA`, `MSFT`
- **Canadian stocks (TSX)**: use `TSE:` prefix — `TSE:CNQ`, `TSE:ENB`, `TSE:SU`
- Row 1 is headers. Data starts from Row 2
- All GOOGLEFINANCE formulas reference column A for the ticker — make sure column A is filled first
- Drag formulas down from row 2 to cover all your stock rows

---

## GOOGLEFINANCE formulas (columns F–O, Q–S)

Replace `A2` with the relevant row as you drag down.

### Column F — Current Price
```
=GOOGLEFINANCE(A2,"price")
```
Live price with ~20 minute delay. Updates during market hours only.

### Column G — Market Cap
```
=GOOGLEFINANCE(A2,"marketcap")
```
Format as currency with no decimals for readability.

### Column H — 52-Week High
```
=GOOGLEFINANCE(A2,"high52")
```
The highest price over the past 52 weeks.

### Column I — 52-Week Low
```
=GOOGLEFINANCE(A2,"low52")
```
The lowest price over the past 52 weeks.

### Column J — P/E Ratio
```
=GOOGLEFINANCE(A2,"pe")
```
Price to earnings ratio. May return #N/A for some TSX stocks — wrap with IFERROR if needed.

### Column O — EPS (Earnings Per Share)
```
=GOOGLEFINANCE(A2,"eps")
```
Most recent earnings per share. Claude uses this to track earnings direction over time.

### Column Q — Beta
```
=IFERROR(GOOGLEFINANCE(A2,"beta"),"—")
```
Volatility relative to the market. Beta of 1.7 means the stock moves 70% more than the market. IFERROR handles stocks where beta isn't available.

### Column R — Average Volume
```
=IFERROR(GOOGLEFINANCE(A2,"volumeavg"),"—")
```
Average daily trading volume. Claude compares this to today's volume to detect unusual activity.

### Column S — Today's Volume
```
=IFERROR(GOOGLEFINANCE(A2,"volume"),"—")
```
Today's trading volume. If today's volume is 2x+ the average, that's a meaningful signal.

---

## Calculated formulas (columns K–N)

These use your manual inputs (avg cost in D, shares in E) and the live price in F.

### Column K — Your Gain/Loss %
```
=(F2-D2)/D2
```
Format as **Percentage**. Shows how your position is doing from your cost basis.
Will show #DIV/0! until you fill in column D — that's expected.

### Column L — vs 52-Week High %
```
=(F2-H2)/H2
```
Format as **Percentage**. How far the stock is below its 52-week peak.
A stock down 20%+ from its high without a business reason is worth investigating.

### Column M — vs 52-Week Low %
```
=(F2-I2)/I2
```
Format as **Percentage**. How far the stock is above its 52-week trough.

### Column N — Your Market Value
```
=F2*E2
```
Format as **Currency**. Total current value of your position.
Will be blank until you fill in column E (shares owned).

---

## Formatting tips

- Columns K, L, M: Format → Number → **Percent** (shows -18% instead of -0.18)
- Column G: Format → Number → **Financial** with 0 decimal places
- Column N: Format → Number → **Currency**
- Freeze Row 1 (View → Freeze → 1 row) so headers stay visible when scrolling

---

## Columns you fill in manually (once, from your brokerage)

| Column | What to enter |
|--------|--------------|
| A | Ticker symbol |
| B | Company name |
| C | Sector (e.g. Tech, Energy, Consumer) |
| D | Your average purchase price |
| E | Number of shares you own (leave blank for watch-only) |

---

## What GOOGLEFINANCE cannot fetch

These attributes return errors for most stocks — Claude fetches them live via web search instead:

- **Dividend yield** — `yieldpct` broken for most tickers as of 2026
- **Revenue growth** — not available in GOOGLEFINANCE
- **Analyst price targets** — not available
- **Earnings beat/miss** — not available
- **News and sentiment** — not available

This is by design — Claude's web search is more reliable and more current than GOOGLEFINANCE for qualitative data.

---

## Canadian stocks (TSX) known limitations

Even with `TSE:` prefix, some attributes return #N/A for TSX stocks:

| Attribute | US stocks | TSX stocks |
|-----------|-----------|------------|
| Price | ✅ | ✅ |
| 52W High/Low | ✅ | ✅ |
| Market Cap | ✅ | ✅ |
| P/E | ✅ | ⚠️ sometimes |
| EPS | ✅ | ⚠️ sometimes |
| Beta | ✅ | ⚠️ sometimes |
| Dividend yield | ❌ broken | ❌ broken |

For missing Canadian data, Claude fetches it via web search during the digest.
