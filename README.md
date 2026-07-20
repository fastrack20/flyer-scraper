# Flyer Scraper

A CLI tool that scrapes flyer data from Save.ca (via Flipp API) and saves it as CSV files. Automatically checks for updates **every 6 hours** and commits changes immediately when detected.

## 🚀 Features

- ✅ Scrapes flyer data for multiple Canadian postal codes
- ✅ Saves data as CSV files
- ✅ **Checks for updates every 6 hours**
- ✅ **Only commits when changes are detected** (smart updates)
- ✅ **Automatically syncs to Google Drive** when changes detected
- ✅ Primary update every Thursday at 1:00 AM EST
- ✅ 100% FREE using GitHub Actions
- ✅ Access CSV files from GitHub or Google Drive

## 🔄 Automated Updates

### How It Works:

1. **Every 6 hours**, GitHub Actions:
   - Scrapes fresh flyer data
   - Compares with existing CSV files
   - **Only commits if changes are detected**

2. **Every Thursday at 1:00 AM EST**:
   - Guaranteed full update run
   - Ensures data is always refreshed weekly

This means your data is **always up-to-date** - if a store updates their flyer mid-week, it will be reflected within 6 hours!

## 📊 Accessing the Data

Once deployed to GitHub, access the CSV files via:

```
https://raw.githubusercontent.com/fastrack20/flyer-scraper/main/data/B3K0H6.csv
```

### Using in Your App

**JavaScript/TypeScript:**
```javascript
const response = await fetch(
  'https://raw.githubusercontent.com/fastrack20/flyer-scraper/main/data/B3K0H6.csv'
);
const csvData = await response.text();
console.log(csvData);
```

**Python:**
```python
import pandas as pd

url = 'https://raw.githubusercontent.com/fastrack20/flyer-scraper/main/data/B3K0H6.csv'
df = pd.read_csv(url)
print(df)
```

**React Example:**
```javascript
useEffect(() => {
  fetch('https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/data/M5V2T6.csv')
    .then(res => res.text())
    .then(csv => {
      // Parse CSV and use in your app
      console.log(csv);
    });
}, []);
```

## 📋 CSV Format

Each CSV file contains the following columns:

| Column | Description |
|--------|-------------|
| `id` | Unique flyer ID |
| `storeName` | Store name (e.g., "Walmart", "Canadian Tire") |
| `title` | Flyer title |
| `validFrom` | Start date (ISO format) |
| `validTo` | End date (ISO format) |
| `postalCode` | Postal code |
| `sourceUrl` | Link to view flyer on Flipp |

## 🛠️ Setup Instructions

### 1. Push to GitHub

```bash
cd C:\Users\Admin\.gemini\antigravity\scratch\flyer-scraper
git init
git add .
git commit -m "Initial commit - Flyer scraper with automated updates"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. Enable GitHub Actions

GitHub Actions should be enabled by default. The workflow will:
- Check for updates every 6 hours
- Only commit when changes are detected
- Run guaranteed update every Thursday at 1:00 AM EST

### 3. Manual Trigger (Optional)

To manually update the data:
1. Go to your GitHub repository
2. Click **Actions** tab
3. Select **Update Flyer Data**
4. Click **Run workflow**

## ⚙️ Customization

### Change Update Frequency

Edit `.github/workflows/scrape-flyers.yml`:

```yaml
schedule:
  # Current: Every 6 hours
  - cron: '0 */6 * * *'
  
  # Examples:
  # Every 3 hours: '0 */3 * * *'
  # Every 12 hours: '0 */12 * * *'
  # Every hour: '0 * * * *'
```

### Change Postal Codes

Edit `src/scrape-to-csv.ts` and modify the `postalCodes` array:

```typescript
const postalCodes = ['B3K0H6'];
```

## 🖥️ Local Development

### Run Scraper Locally

```bash
npm install
npx ts-node src/scrape-to-csv.ts
```

### Test with Single Postal Code

```bash
npx ts-node src/index.ts --postal-code B3K0H6
```

## 💰 Cost

**100% FREE** - Uses GitHub Actions free tier (2,000 minutes/month)

With checks every 6 hours, you'll use approximately:
- ~120 runs per month
- ~5-10 minutes per run
- **Total: ~600-1,200 minutes/month** (well within free tier!)

## 📊 Monitoring Updates

Check the **Actions** tab in your GitHub repo to see:
- When updates ran
- Whether changes were detected
- Commit history shows when data actually changed

## 🔧 Troubleshooting

### GitHub Actions Not Running?

1. Check that Actions are enabled in repo settings
2. Verify the workflow file is in `.github/workflows/`
3. Check the **Actions** tab for error logs

### Want More Frequent Updates?

Change the cron schedule to run more often (e.g., every 3 hours or hourly).

### Need Different Postal Codes?

Edit `src/scrape-to-csv.ts` and add your postal codes to the array.

---

## 📝 License

MIT

---

**Questions?** Open an issue on GitHub!
