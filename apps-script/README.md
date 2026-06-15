# Apps Script Setup

Google Sheets only refreshes GOOGLEFINANCE formulas when the sheet is open in a browser. This script forces a refresh every 15 minutes automatically — so Claude always reads current prices even if you haven't opened the sheet.

## Step by step

### 1. Open Apps Script
In your Google Sheet: **Extensions → Apps Script**

A new tab opens with a code editor.

### 2. Paste the script
Delete everything in the editor and paste the full contents of `refresh.gs`.

### 3. Save
Click the floppy disk icon or press `Cmd+S` (Mac) / `Ctrl+S` (Windows).

Name the project anything — `WatchlistRefresh` works.

### 4. Run createTrigger
In the function dropdown at the top of the editor, select **createTrigger** then click the **Run** button (▶).

Google will ask for permissions — click **Advanced → Go to WatchlistRefresh (unsafe)**. This warning is normal for personal scripts you write yourself.

### 5. Verify
Click the **clock icon** on the left sidebar (Triggers).

You should see one trigger: `forceRefresh`, running every 15 minutes.

## Notes

- **15 minutes is the minimum** interval Google Apps Script supports — you can't go lower
- The trigger runs in the background whether your sheet is open or not
- GOOGLEFINANCE only updates during market hours (9:30am–4pm ET) — outside those hours prices will show the previous close
- You only need to run `createTrigger` once ever
- To stop the refresh, run `deleteTrigger` from the editor

## Troubleshooting

**"This app isn't verified" warning** — This is expected for personal scripts. Click Advanced → Go to [project name] (unsafe) to proceed.

**Trigger not appearing** — Make sure you selected `createTrigger` in the dropdown before clicking Run, not `forceRefresh`.

**F2 showing "refreshing..."** — The script briefly sets this value then restores the formula. If it gets stuck, manually type `=GOOGLEFINANCE(A2,"price")` back into F2.
